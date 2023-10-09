import Hapi from '@hapi/hapi'
import { Request, ResponseToolkit } from "@hapi/hapi";
import { createClient} from "redis";
import * as dotenv from "dotenv";
import {USERRESPONSE} from "../common/userResponse";
import { login_service, password_reset_service, signup_service } from "../services/auth.service";
import { OAuth2Client } from 'google-auth-library';
import { user_service } from '../services/user.service';
import {httpResponse} from '../middleware/response';
import User, { Userstatus } from '../models/user';
import { LINK } from '../common/common';
import { generateRandomPassword } from '../utils/passwodGen';
import { v4 as uuidv4 } from 'uuid';


const httpresponse=new httpResponse()



const client = createClient();
client.on('error', err => console.log('Redis Client ERR', err))
client.connect();

dotenv.config();

const CLIENT_ID=process.env.GOOGLE_CLIENT_ID;
const SECRET_CODE=process.env.GOOGLE_SECRET_ID;





export async function signup(request: Request, h: ResponseToolkit) {
  try {
    var { name, email, password, phone ,userType } = <any>request.payload;
    const userExist=await user_service.checkUserExist({email:email});
    if(userExist?.status==Userstatus.active) return httpresponse.sendResponse(h,USERRESPONSE.USER_EXIST);
    const new_user=await signup_service.user_signup(name, email, password, phone ,userType)
    if(new_user) return httpresponse.sendResponse(h,USERRESPONSE.USER_REGISTERED);
  
  } catch (error) {
    console.error(error);
    return httpresponse.sendResponse(h,USERRESPONSE.ERROR);

  }
}


export async function login(Request: Request, h: ResponseToolkit) {
  try {
    const { email, password } = <any>Request.payload;
    const user=await user_service.checkUserExist({email:email});

    if(user?.status==Userstatus.deleted) return httpresponse.sendResponse(h,USERRESPONSE.USER_NOT_EXIST)
    if(!user) return httpresponse.sendResponse(h,USERRESPONSE.USER_NOT_EXIST);
    if(user?.status==Userstatus.blocked) return httpresponse.sendResponse(h,USERRESPONSE.USER_BLOCKED);
    const clientIP = Request.info.remoteAddress;
    const deviceId = Request.headers['x-device-id'] as string;
    console.log(deviceId);
    const token = await login_service.UserloginService(email,password,clientIP,deviceId);
    if(token==0)return httpresponse.sendResponse(h,USERRESPONSE.WRONG_PASSWORD);
    return httpresponse.sendResponse(h,USERRESPONSE.USER_LOGIN,token);
   }
  catch (error){
    console.log(error);
    return httpresponse.sendResponse(h,USERRESPONSE.ERROR);
 }
}






export async function logout(request:Hapi.Request, h:Hapi.ResponseToolkit) {
  try{
     const uid=request.headers.userId
     const user=await user_service.checkUserExist({_id:uid.userId, status:{$ne:Userstatus.deleted}});
     if(!user) return;
     user.status=Userstatus.inactive;
     await user.save();
     if(uid)
     {
      await client.del(uid.userId.toString());
      return httpresponse.sendResponse(h,USERRESPONSE.LOGOUT);
     }
  }
    catch(err){return httpresponse.sendResponse(h,USERRESPONSE.ERROR)}
}




export async function forgotPassword(Request: Request, h: ResponseToolkit) {
  try {
    const { email } = <any>Request.payload;
    const userExist=await user_service.checkUserExist({email:email});
    if(!userExist)return httpresponse.sendResponse(h,USERRESPONSE.USER_NOT_EXIST);
    const status=await password_reset_service.forgotPassword(email);
    if(status==1)return httpresponse.sendResponse(h,USERRESPONSE.OTP_SEND);
}
  catch (error) {
    return httpresponse.sendResponse(h,USERRESPONSE.ERROR);
  }
}




export async function resetPassword(Request: Request, h: ResponseToolkit) {
  try{
  const { email, otp, password } = <any>Request.payload;
  await password_reset_service.passwordReset(email,otp,password);
  return httpresponse.sendResponse(h,USERRESPONSE.PASSWORD_CHANGED);
}

catch(err){
  return httpresponse.sendResponse(h,USERRESPONSE.ERROR);
}
}




const oauthClient = new OAuth2Client({
        clientId:CLIENT_ID,
        clientSecret:SECRET_CODE,
        redirectUri:LINK.GOOGLE_REDIRECT_URL,
      });
    
    export async function googleSignup(Request: Request, h: ResponseToolkit) {
     
         const signInUrl = await getGoogleSignInUrl();
          return `
            <html>
              <head>
                <title>Google Sign-In Example</title>
              </head>
              <body>
                <h1>Google Sign-In Example</h1>
                <a href="${signInUrl}">Sign In with Google</a>
              </body>
            </html>
          `;
        }
  
  
      export async function googleCallback(Request: Request, h: ResponseToolkit){
          const code = Request.query.code;
          const { tokens } = await oauthClient.getToken(code as string);
          console.log(tokens);
          const ticket:any=await oauthClient.verifyIdToken(
            {
            idToken:tokens.id_token as string,
            audience: CLIENT_ID
          })
            const {name,email}=ticket.getPayload();
            const payload=ticket.getPayload();
            console.log(payload);
            oauthClient.revokeToken(tokens.access_token as string);
            const password=generateRandomPassword(10);
            const creatUser=await signup_service.google_signup(email,name,password);
         
            return creatUser;
        }
    
      
      async function getGoogleSignInUrl() {
     
        const authUrl = oauthClient.generateAuthUrl({
          access_type: 'offline',
          scope:['profile','email']
        });
        return authUrl;
      }

