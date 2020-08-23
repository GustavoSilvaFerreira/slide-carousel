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

const routes = require('./routes/routes');

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
      ...routes
    ])

    await app.start()
    console.log(`Servidor rodando ${app.info.host}:${app.info.port}`);

  } catch(error) {
    console.error('Erro: ', error)
  }
}
main();
