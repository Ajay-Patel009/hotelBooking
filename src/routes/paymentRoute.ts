import { ServerRoute } from "@hapi/hapi";
import { ViewMyTransactions, allTransactions, onsuccess, redirectFailedPayment,} from "../controller/payment.controller";
import Joi from "joi";
import authenticateJWT, { adminJwtMiddlware } from "../middleware/jwtMiddleware";
import { session } from "../middleware/session";
const stripe = require('stripe')('sk_test_51NpnFqSDai0wLS7KMsQefprvlODc5hLdMRmdln5TdDKxBz6PnqXeBMoIVLeLDDVB5Xu2HVHHIaVqwdf6laQvLxRT00hu4x82QT');



export const Paymentroutes: ServerRoute[] = [



    {
        method:'GET',
        path:'/paymentOnFailed',
        handler:redirectFailedPayment

    },
    {
        method: 'GET',
        path: '/paymentOnSuccess',
        handler:onsuccess
    },
    {
        method: 'GET',
        path: '/allTransactions',
        options: {
            tags: ['api',"hotel"],   
            description: 'Admin can view the total transaction or the transactions of a particular hotel',
             pre: [{method:adminJwtMiddlware}],
          validate: {
            query: Joi.object({
              owner_id: Joi.string().required().optional(),
            }),
          },
        },
        handler:allTransactions
    },
    {
        method: 'GET',
        path: '/viewMyTransactions',
        options: {
            tags: ['api',"hotel"],   
            description: 'owners or hotel admin can view their transactions details',
             pre: [{method: authenticateJWT},{method:session}],
          
        },
        handler:ViewMyTransactions
    }
]