const Boom = require('boom');
const Insta = require('../hashtag');

module.exports = routes = [
  {
    path: '/v1/picture',
    method: 'GET',
    config: {
      tags: ['api'],
      description: 'Listar imagens',
      notes: 'Retorna as imagens'
    },
    handler: async (request) => {
      try {
        let fs = require('fs');
        let rimraf = require('rimraf');

        let oldPath = process.env.OLD_PATH_DIR;
        let newPath = process.env.NEW_PATH_DIR;

        // test
        let oldFiles = undefined;
        if(fs.existsSync(oldPath)) {
          oldFiles = fs.readdirSync(oldPath);

          oldFiles.map((file) => {
            const splitFile = file.split('.');
            const ext = splitFile[splitFile.length - 1];

            if(ext && (valid = ext === 'jpeg' || ext === 'jpg' || ext === 'png') && fs.existsSync(`${oldPath}/${file}`)) {
              fs.copyFileSync(`${oldPath}/${file}`, `${newPath}/${file}`, function(err) {
                if(err) throw err;
                console.log('Successfully copied!');
              })
            }
          });
        }

        // end test


        // if(fs.existsSync(oldPath)) {
        //   if(fs.existsSync(newPath)) {
        //     rimraf.sync(newPath);
        //   }

        //   fs.rename(oldPath, newPath, function(err) {
        //     if(err) throw err;
        //     console.log('Successfully renamed - AKA moved!');
        //   })
        // }

        let files = fs.readdirSync(newPath);

        files = files.filter((file) => {
          const splitFile = file.split('.');
          const ext = splitFile[splitFile.length - 1];
          let valid = false;
          if(ext) {
              valid = ext === 'jpeg' || ext === 'jpg' || ext === 'png';
          }
          return valid;
        });

        return files;

      } catch (error) {
        console.error('Erro: ', error)
        return Boom.internal();
      }
    }
  },
  {
    path: '/v1/allUrlsMedia',
    method: 'GET',
    config: {
      tags: ['api'],
      description: 'Listar todas as urls das imagens',
      notes: 'Retorna todas as urls das imagens'
    },
    handler: async (request, params) => {
      try {
        const { query: { hashtag } } = request
        console.log(hashtag);
        const insta = new Insta();
        const res = await insta.getAllUrlMediaFeedByHashtag(hashtag);
        return res || [];
      } catch (error) {
        console.error('Erro: ', error)
        return Boom.internal();
      }
    }
  }
]
