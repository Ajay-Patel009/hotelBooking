import {ServerRoute } from "@hapi/hapi";

import { adminForgotPassword, adminLogin ,adminPaswordChange,adminResetPassword,deletePost, verifyOwner} from "../controller/adminController"
import authenticateJWT, { adminJwtMiddlware } from "../middleware/jwtMiddleware";
import Joi from "joi";
import { forgotPassword } from "../controller/authController";




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
                })
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
                // auth: 'jwt'
                tags: ['api',"admin"],   
                description: 'delete hotel post',
                pre: [{method: adminJwtMiddlware}]
            },
            handler: deletePost
    },

    {
        method: 'POST',
        path: '/adminForgetPassword',
        options: {
            // auth: 'jwt'
            tags: ['api',"admin"],   
            description: 'forget password',
            validate:{
                payload:Joi.object({email:Joi.string().email()})
   
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
                })
   
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
                })
   
        },
        handler: adminPaswordChange
      }
    }, 
]






