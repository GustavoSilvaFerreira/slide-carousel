const http = require('http');
const { config } = require('dotenv');

const env = process.env.NODE_ENV;
config({
  path: `./config/.env.${env}`
});

const Hapi = require('hapi')

const HapiSwagger = require('hapi-swagger');
const Vision = require('vision');
const Inert = require('inert');

const Boom = require('boom');

const app = new Hapi.Server({
  port: process.env.PORT,
  routes: {
    cors: {
      origin: ['*']
    }
  }
})

async function main() {
  try{
    await app.register([
      Inert,
      Vision,
      {
        plugin: HapiSwagger,
        options: {
          documentationPath: '/v1/documentation',
          info: {
            title: 'API - consulta imagens',
            version: 'v1.0'
          },
          lang: process.env.API_LANG
        }
      }
    ])

    app.route([
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

            let oldPath = 'C:/xampp/htdocs/img/4K Stogram/#brasil';
            let newPath = 'C:/xampp/htdocs/img/marinalvafaz60';

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
      }
    ])

    await app.start()
    console.log(`Servidor rodando ${app.info.host}:${app.info.port}`);

  } catch(error) {
    console.error('Erro: ', error)
  }
}
main();
