// 'use strict';

import Hapi from '@hapi/hapi';
import { connectToDatabase } from './db/connection';
import { user_routes} from './routes/userRoutes';
import { Hotelroutes} from './routes/hotel.Routes';
import { createClient } from 'redis';
import { Adminroutes } from './routes/admin.Routes';
import dotenv from 'dotenv';
import { creatAdmin } from './controller/admin.Controller';
import hapiswagger from 'hapi-swagger';
import inert from '@hapi/inert';
import vision from '@hapi/vision';
import { Authroutes } from './routes/auth.Routes';
import * as HapiAuthCookie from '@hapi/cookie';
import { Paymentroutes } from './routes/paymentRoute';
import { hotel_service } from './services/hotel.service';
import { Client } from '@elastic/elasticsearch';
const elastic_client = new Client({
  node: 'http://localhost:9200', // Replace with your Elasticsearch server's URL
});



dotenv.config();
const PORT = process.env.PORT;
const SECRET_KEY = process.env.SECRET_KEY;

connectToDatabase

const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
client.connect();




async function init() {

    const server = Hapi.server({port: PORT,host: 'localhost',});
    await creatAdmin();
    await server.register([inert, vision, { plugin: hapiswagger, options:
         { info:
            { title: 'API Documentation of Hotel Booking application', version: '1.0.0', }, 
            securityDefinitions: { apiKey: { type: 'apiKey', name: 'Authorization', in: 'header' } },
             security: [{ apiKey: [] }], 
             grouping: 'tags',
              tags: [
                { name: 'userAuth', description: 'User Authentication'}, 
                { name: 'hotel', description: 'Hotel  APIS'}, 
                { name: 'user', description: 'All User  APIs'},
                { name: 'admin', description: 'All admins APIs'},
            ], 
        } 
    }
    ]);
       
    await server.register(require('@hapi/cookie'));
    await server.register(require('@hapi/bell'));
    

    server.route(user_routes);
    server.route(Authroutes)
    server.route(Hotelroutes);
    server.route(Adminroutes);
    server.route(Paymentroutes);
    await server.start();
    console.log(process.env.ENV)
    console.log('Server running at on', server.info.uri);

    async function createHotelIndex() {
      await elastic_client.indices.create({
        index: 'myhotel',
        body: {
          mappings: {
            properties: {
              name: {
                type: 'text',
                analyzer: 'custom_edge_ngram',
              },
              // Add other properties as needed
            },
          },
          settings: {
            analysis: {
              tokenizer: {
                custom_edge_ngram: {
                  type: 'edge_ngram',
                  min_gram: 1,
                  max_gram: 25,
                  token_chars: ['letter', 'digit'],
                },
              },
              analyzer: {
                custom_edge_ngram: {
                  type: 'custom',
                  tokenizer: 'custom_edge_ngram',
                },
              },
            },
          },
        },
      });
    }
    // await createHotelIndex()
}
process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();


