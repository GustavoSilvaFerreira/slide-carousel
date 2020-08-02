const Instagram = require('instagram-web-api')
const { config } = require('dotenv')

const env = process.env.NODE_ENV
config({
    path: `./config/.env.${env}`
})

class Insta {
  client = null;
  login = null;

  constructor() {
    const { USER_INSTA, PASSWORD_INSTA } = process.env
    this.client = new Instagram({ username: USER_INSTA, password: PASSWORD_INSTA });
    // this.login = this.login();
  }

  async setLogin() {
    if(this.login === null) {
      this.login = await this.client.login()
    }
    return this.login !== null && this.login.authenticated === true;
  }

  async getByHashtag(hashtag) {
    const hash = await this.client.getMediaFeedByHashtag({ hashtag })
    console.log(hash);
    const result = hash.edge_hashtag_to_media.edges;
    result.forEach(element => {
      console.log('\n', element.node.display_url)
    });
    console.log(result.length);
    hash.edge_hashtag_to_top_posts.edges.forEach(element => {
      console.log('\n', element.node.display_url)
    });
    // console.log(hash)
  }
}

const insta = new Insta();
console.log(insta);
if(insta.setLogin()) {
  insta.getByHashtag('marinalvafaz60');
}

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
