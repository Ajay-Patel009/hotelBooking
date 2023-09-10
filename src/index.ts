// 'use strict';

import Hapi from '@hapi/hapi';
import { connectToDatabase } from './db/connection';
import { user_routes} from './routes/userRoutes';
import { Hotelroutes} from './routes/hotelRoutes';

// import { validateToken } from './middleware/validation';
import { createClient } from 'redis';
import { Adminroutes } from './routes/adminRoutes';
import dotenv from 'dotenv';
import { creatAdmin } from './controller/adminController';
import hapiswagger from 'hapi-swagger';
import inert from '@hapi/inert';
import vision from '@hapi/vision';
import http from 'http';

import { Authroutes } from './routes/authRoutes';

import { Server } from 'socket.io';
import socketIo from 'socket.io';


// import { Authroutes } from './routes/authRoutes';
// import Review from './models/reviewSchema';
// import Hotel from './models/hotel.scema';
// import mongoose from 'mongoose';
// import User from './models/user';

import { Log } from 'logging-colorify-v2';
import { classifier } from './bot/bot.training';
dotenv.config();
const PORT = process.env.PORT;
const SECRET_KEY = process.env.SECRET_KEY

connectToDatabase

const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
client.connect();




async function init() {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });



    await creatAdmin();


   

    await server.register([inert, vision, { plugin: hapiswagger, options:
         { info:
            { title: 'API Documentation', version: '1.0.0', }, 
            securityDefinitions: { apiKey: { type: 'apiKey', name: 'Authorization', in: 'header' } },
             security: [{ apiKey: [] }], 
             grouping: 'tags',
              tags: [
                { name: 'userAuth', description: 'User Authentication' }, 
                { name: 'hotel', description: 'Hotel  APIS' }, 
                { name: 'user', description: 'All User  APIs' },
                { name: 'admin', description: 'All admins APIs' },
            ], 
        } 
    }
        ,]);
       

    server.route(user_routes);
    server.route(Authroutes)
    server.route(Hotelroutes);
    server.route(Adminroutes);

    await server.register(inert);

    server.route({
        method: 'POST',
        path: '/chat',
        handler: async(request, h) => {
          const userInput:any = request.query.input; // Get user input from the request payload
          const response = await classifier.classify(userInput); // Use the NLP model to generate a response
          return { response };
        },
      });
   
   



    await server.start();
    console.log('Server running on %s', server.info.uri);
}
process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();