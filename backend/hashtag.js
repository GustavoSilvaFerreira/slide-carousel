const Instagram = require('instagram-web-api')
const { config } = require('dotenv')

const env = process.env.NODE_ENV
config({
    path: `./config/.env.${env}`
})

class Insta {
  client = null;
  login = null;
  urlsMedia = [];
  count = 0;

  constructor() {
    const { USER_INSTA, PASSWORD_INSTA } = process.env
    console.log(USER_INSTA, PASSWORD_INSTA);
    this.client = new Instagram({ username: USER_INSTA, password: PASSWORD_INSTA });
    // this.login = this.login();
  }

  clearUrlMedia() {
    this.urlsMedia = [];
  }

  async setLogin() {
    if(this.login === null) {
      this.login = await this.client.login()
    }
    console.log('LOGIN', this.login !== null && this.login.authenticated === true);
    // console.log('Client', this.client);
    return this.login !== null && this.login.authenticated === true;
  }

  async getPhotosByHashtag(hashtag, first = 12, after = '') {
    const photos = await this.client.getPhotosByHashtag({hashtag, first, after});
    // console.log(photos);
    return photos.hashtag && photos.hashtag.edge_hashtag_to_media ? photos.hashtag.edge_hashtag_to_media : null;
  }

  async getMediaByShortcode(shortcode) {
    const response = await this.client.getMediaByShortcode({shortcode});
    return response.edge_sidecar_to_children && response.edge_sidecar_to_children.edges ? response.edge_sidecar_to_children.edges : null;
  }

  async getAllPhotoByHashtag(hashtag, first = 12, after = '') {
    console.log(`buscando #${hashtag}`);
    console.log('total: ', this.urlsMedia.length);
    const photos = await this.getPhotosByHashtag(hashtag, first, after);
    // console.log(photos);
    // console.log(photos.page_info);
    if(!photos) return this.urlsMedia;
    const {
      edges,
      count,
      page_info : {
        has_next_page,
        end_cursor
      }
    } = photos;
    // console.log(photos);
    for (const element of edges) {
      const shortcode = element.node.shortcode;
      const response = await this.getMediaByShortcode(shortcode);
      if(response) {
        this.filterResultUrlsMedia(response);
      } else {
        this.filterResultUrlsMedia([element]);
      }
    }
    // edges.map(async (element) => {
    //   // console.log(element.node.display_url);
    //   // buscar fotos filhas
    //   // if(element.node.display_url.indexOf('21985251_1447137688697648_8438953370420510720_n.jpg') > -1) {
    //   //   console.log({element});
    //     const shortcode = element.node.shortcode;
    //     const response = await this.getMediaByShortcode(shortcode);
    //     // console.log({response});
    //     if(response) {
    //       // console.log(response.length);
    //       // this.urlsMedia.push(...this.filterResultUrlsMedia(response));
    //       this.filterResultUrlsMedia(response);
    //     }
    //   // }
    // })

    // this.filterResultUrlsMedia(edges);
    // const filtered = this.filterResultUrlsMedia(edges);
    // this.urlsMedia.push(...filtered);
    // console.log(this.urlsMedia.length);
    console.log({has_next_page});
    if(has_next_page) {
      return await this.getAllPhotoByHashtag(hashtag, first, end_cursor);
    }

    return this.urlsMedia;
  }

  filterResultUrlsMedia(result) {
    for (const element of result) {
      const displayUrl = element.node.display_url;
      if(!this.urlsMedia.includes(displayUrl) && displayUrl !== null) {
        this.urlsMedia.push(displayUrl);
      }
    }
    // return await result
    //   .map(element => element.node.display_url)
    //   .filter(element => !this.urlsMedia.includes(element) && element !== null);
  }

  async getMediaFeedByHashtag(hashtag) {
    const hash = await this.client.getMediaFeedByHashtag({ hashtag });
    // console.log(hash);
    return hash;
    // result.forEach(element => {
    //   console.log('\n', element.node.display_url)
    // });
    // console.log(result.length);
    // hash.edge_hashtag_to_top_posts.edges.forEach(element => {
    //   console.log('\n', element.node.display_url)
    // });
    // console.log(hash)
  }

  // retorna sempre todas as urls
  async getAllUrlMediaFeedByHashtag(hashtag) {
    if(!this.setLogin()) return [];
    const hash = await this.getMediaFeedByHashtag(hashtag);
    let result = hash.edge_hashtag_to_media.edges;
    // console.log(result);
    this.filterResultUrlsMedia(result);
    // this.urlsMedia.push(...result);
    return this.urlsMedia;
  }
}
module.exports = { Insta };

async function main() {
  try {
    const insta = new Insta();
    // console.log({insta});
    if(!await insta.setLogin()) return [];
    const res = await insta.getAllPhotoByHashtag('avanadebyus');
    // const res = await insta.getAllUrlMediaFeedByHashtag('avanadebyus');
    console.log(res);
    console.log(res.length);
  } catch (error) {
    console.log('error: ', error);
  }
}
main();

// (async () => {
//   // if(this.login === null) {
//   //   this.login = await client.login()
//   //   if(this.login.authenticated !== true) {
//   //     return;
//   //   }
//   // }

//   const hashtag = 'brasil';
//   const hash = await client.getMediaFeedByHashtag({ hashtag })
//   // console.log(hash)
//   const result = hash.edge_hashtag_to_media.edges;
//   result.forEach(element => {
//     console.log('\n', element.node.display_url)
//   });
//   console.log(result.length);
//   // console.log(Object.keys(hash.edge_hashtag_to_media.edges))
//   // const profile = await client.getProfile()
//   // console.log(profile)
// })()
