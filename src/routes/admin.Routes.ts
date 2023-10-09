import {ServerRoute } from "@hapi/hapi";

import { adminForgotPassword, adminLogin ,adminPaswordChange,adminResetPassword,deletePost, ownersToVerify, verifyOwner} from "../controller/admin.Controller"
import { adminJwtMiddlware } from "../middleware/jwtMiddleware";
import Joi from "joi";



export const Adminroutes: ServerRoute[] = [

    {
        method: 'POST',
        path: '/adminLogin',
        options: {
            auth: false,
            tags: ['api',"admin"],   
            description: 'AdminLogin',
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required(),
                    password: Joi.string().required(),
                }),
                failAction:async(request,h,err)=>{
                    throw err;
                }
            }

        },
        handler: adminLogin

    },
   
    {
        method: 'POST',
        path: '/verifyOwner',
        options: {
            // auth: false
            tags: ['api',"admin"],   
            description: 'Owner  Verification',
            pre: [{method: adminJwtMiddlware}],
            validate: {
                query: Joi.object({
                  
                    ownerId: Joi.string().required(),
                })
            }
        },
        handler: verifyOwner

    },
    {
            method: 'DELETE',
            path: '/deletePost',
            options: {
                tags: ['api',"admin"],   
                description: 'delete hotel post',
                pre: [{method: adminJwtMiddlware}]
            },
            handler: deletePost
    },

    {
        method: 'GET',
        path: '/notVerifiedOwners',
        options: {
            tags: ['api',"admin"],   
            description: 'list of hotels that are not verified',
            pre: [{method: adminJwtMiddlware}]
        },
        handler:ownersToVerify
},

    {
        method: 'POST',
        path: '/adminForgetPassword',
        options: {
            tags: ['api',"admin"],   
            description: 'forget password',
            validate:{
                payload:Joi.object({email:Joi.string().email()}),
                failAction:async(request,h,err)=>{
                    throw err;
                }
   
        },
        handler: adminForgotPassword
      }
    }, 

    {
        method: 'POST',
        path: '/adminResetPassword',
        options: {
            // auth: 'jwt'
            tags: ['api',"admin"],   
            description: 'Reset password',
            validate:{
                payload:Joi.object({
                    email:Joi.string().email().required(),
                    otp:Joi.string().required(),
                    newPassword:Joi.string().required()
                }),
                failAction:async(request,h,err)=>{
                    throw err;
                }
   
        },
        handler: adminResetPassword
      }
    }, 

    {
        method: 'POST',
        path: '/adminChangePassword',
        options: {
            // auth: 'jwt'
            tags: ['api',"admin"],   
            description: 'Change password',
            pre: [{method: adminJwtMiddlware}],
            validate:{
                payload:Joi.object({
                    // email:Joi.string().email().required(),
                    // otp:Joi.string().required(),
                    newPassword:Joi.string().required()
                }),
                failAction:async(request,h,err)=>{
                    throw err;
                }
   
        },
        handler: adminPaswordChange
      }
    }, 
]






