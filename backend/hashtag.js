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

  constructor() {
    const { USER_INSTA, PASSWORD_INSTA } = process.env
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
    return this.login !== null && this.login.authenticated === true;
  }

  async getPhotosByHashtag(hashtag, first = 12, after = '') {
    const photos = await this.client.getPhotosByHashtag({hashtag, first, after});
    return photos.hashtag.edge_hashtag_to_media;
  }

  async getAllPhotoByHashtag(hashtag, first = 50, after = '') {
    const photos = await this.client.getPhotosByHashtag({hashtag, first, after});
    // console.log(photos);
    const {
      edges,
      count,
      page_info : {
        has_next_page,
        end_cursor
      }
    } = photos.hashtag.edge_hashtag_to_media;
    // console.log(photos);
    const filtered = await this.filterResultUrlsMedia(edges);
    this.urlsMedia.push(...filtered);
    console.log(this.urlsMedia.length);
    if(has_next_page) {
      return await this.getAllPhotoByHashtag(hashtag, first, end_cursor);
    }

    return this.urlsMedia;
  }

  async filterResultUrlsMedia(result) {
    return await result
      .map(element => element.node.display_url)
      .filter(element => !this.urlsMedia.includes(element) && element !== null);
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
    console.log(result);
    result = this.filterResultUrlsMedia(result);
    this.urlsMedia.push(...result);
    return this.urlsMedia;
  }
}
module.exports = { Insta };

async function main() {
  const insta = new Insta();
  const res = await insta.getAllPhotoByHashtag('brasil1');
  // const res = await insta.getAllUrlMediaFeedByHashtag('brasil');
  console.log(res);
  console.log(res.length);
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
