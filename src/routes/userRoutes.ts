import { ServerRoute } from "@hapi/hapi";
import Joi from 'joi'
import { changePassword, contactOwner, deleteProfile, getUser, updateProfile,} from "../controller/userController";
import authenticateJWT from "../middleware/jwtMiddleware";
import { session } from "../middleware/session";






export const user_routes: ServerRoute[] = [
   

    {
        method:'GET',
        path: '/getUser',
        handler : getUser,
        options: {
            // auth:"jwt"
            tags: ['api','user'],   
            description: 'GetUser',
            
            pre: [{method: authenticateJWT},{method:session}]
            
            }
    },
    {
        method:'DELETE',
        path: '/deleteprofile',
        handler : deleteProfile,
        options: {
            // auth:"jwt"
            tags: ['api','user'],   
            description: 'DeleteUser',
            pre: [{method: authenticateJWT},{method:session}]
                }
    },
    {
        method:'PUT',
        path: '/updateProfile',
        handler : updateProfile,
        options: {
            tags: ['api','user'],   
            description: 'UpdateUser',
            pre: [{method: authenticateJWT},{method:session}],
            validate:{
                payload:Joi.object({
                    name:Joi.string().optional(),
                    phone:Joi.number().optional().min(10).max(10),
                }).optional()
            }
            
            }
    ,},


    {
        method:'PUT',
        path: '/updatePassword',
        handler : changePassword,
        options: {
            tags: ['api','user'],   
            description: 'Updatepassword',
            pre: [{method: authenticateJWT},{method:session}],
            validate:{
                payload:Joi.object({
                    currentPassword:Joi.string().required(),
                    // currentPassword:Joi.string().regex(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+])[A-Za-z0-9!@#$%^&*()_+]{8,}$/).required(),
                    newPassword:Joi.string().regex(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+])[A-Za-z0-9!@#$%^&*()_+]{8,}$/).required(),
                    confirmPassword:Joi.string().regex(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+])[A-Za-z0-9!@#$%^&*()_+]{8,}$/).required(),
                }),
                failAction:async(request,h,err)=>{
                    throw err;
                }
            }
            
            }
    ,},


    {
        method:'GET',
        path: '/contactOwner',
        handler :contactOwner,
        options: {
            pre: [{method: authenticateJWT},{method:session}],
            tags: ['api','user'],   
            description: 'get owner details',
            validate:{
                query:Joi.object({
                    hotel_id:Joi.string(),

                })
            }
            
            }
    ,},






]