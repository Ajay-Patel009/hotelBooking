import { ServerRoute } from "@hapi/hapi";
import Joi from "joi";
import { signup, login, logout, forgotPassword, resetPassword, googleSignup, googleCallback } from "../controller/authController";
import authenticateJWT from "../middleware/jwtMiddleware";
import { request } from "http";
import { session } from "../middleware/session";





export const Authroutes: ServerRoute[] = [
    {
      method: 'POST',
      path: '/usersignup',
      handler: signup,
      
      options: {
        auth:false,
        tags: ['api',"userAuth"],   
        description: 'User signup',
        validate: {
            payload: Joi.object({
                name: Joi.string().min(3).max(140),
                email: Joi.string().email().required(),
                password: Joi.string().regex(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+])[A-Za-z0-9!@#$%^&*()_+]{8,}$/).required(),
                phone: Joi.number().required(),
                userType:Joi.number()

            }),
            failAction:async(request,h,err)=>{
                throw err;
            }
        }
    }
    },

    {
        method:'POST',
        path: '/login',
        handler : login,
        options: {
            auth:false,
            tags: ['api','userAuth'],   
            description: 'User login',
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required(),
                    password: Joi.string().regex(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+])[A-Za-z0-9!@#$%^&*()_+]{8,}$/).required(),
                }),
                failAction:async(request,h,err)=>{
                    throw err;
                }
            }
        }
    },

    {
        method:'POST',
        path: '/logout',
        handler : logout,
        options: {
            // auth:'jwt',
            tags: ['api','userAuth'],   
            description: 'logout',
            pre: [{method:authenticateJWT},{method:session}]
        }
    },

    {
        method:'POST',
        path: '/forgotPassword',
        handler : forgotPassword,
        options: {
            auth:false,
            tags: ['api','userAuth'],   
            description: 'forgotPassword',
            validate: {
                payload: Joi.object({
                email: Joi.string().email().required(),
                }),
                failAction:async(request,h,err)=>{
                    throw err;
                }
            }
        }
    },


    {
        method:'POST',
        path: '/resetPassword',
        handler : resetPassword,
        options: {
            // auth:false,
            tags: ['api','userAuth'],   
            description: 'ResetPassword',
            validate: {
                payload: Joi.object({
                    otp: Joi.number().required(),
                    email: Joi.string().email().required(),
                    password: Joi.string().regex(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+])[A-Za-z0-9!@#$%^&*()_+]{8,}$/).required(),
                }),
                failAction:async(request,h,err)=>{
                    throw err;
                }
            }
        }
    },



    {
        method:'GET',
        path:'/',
        handler:googleSignup

    },

    {
        method:'GET',
        path:'/auth/google/callback',
        handler:googleCallback
    }



    
]