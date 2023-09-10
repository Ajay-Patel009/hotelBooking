import { ServerRoute } from "@hapi/hapi";
import Joi from "joi";
import { signup, login, logout, forgotPassword, resetPassword } from "../controller/authController";
import authenticateJWT from "../middleware/jwtMiddleware";





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
                password: Joi.string().required(),
                phone: Joi.number().required(),
                userType:Joi.number()

            })
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
                    password: Joi.string().required(),
                })
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
            pre: [{method:authenticateJWT}]
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
                    // password: Joi.string().required(),
                })
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
                    email: Joi.string().required(),
                    newPassword:Joi.string().required()
                })
            }
        }
    },
]