import Hapi from '@hapi/hapi'
import { Request, ResponseToolkit } from "@hapi/hapi";
import { createClient} from "redis";
import * as dotenv from "dotenv";
import {USERMSG} from "../common/userResponse";
import { login_service, password_reset_service, signup_service } from "../services/auth.service";
import { OAuth2Client } from 'google-auth-library';
import { ResponseUtil } from '../middleware/response';
import { user_service } from '../services/user.service';
import User from '../models/user';


const client = createClient();
client.on('error', err => console.log('Redis Client ERR', err))
client.connect();

dotenv.config();
const PORT = process.env.PORT;
const SECRET_KEY=process.env.SECRET_KEY

export async function signup(request: Request, h: ResponseToolkit) {
  try {
    var { name, email, password, phone ,userType } = <any>request.payload;
    const userExist=await user_service.checkUserExist({email:email});
    if(userExist){
      return ResponseUtil.conflict(USERMSG.USER_EMAIL_ALREADY,h)
    }
    const new_user=await signup_service.user_signup(name, email, password, phone ,userType)
    
    if (new_user) {
      return ResponseUtil.success(USERMSG.USER_REGISTER,h)
    }
  } catch (error) {
    console.error(error);
    return ResponseUtil.error(USERMSG.ERROR,h)
  }
}


export async function login(Request: Request, h: ResponseToolkit) {
  try {
    const { email, password } = <any>Request.payload;
    const token = await login_service.UserloginService(email,password);
    if(token==0)
    {
      return ResponseUtil.unauthorized(USERMSG.USER_NOT_EXIST,h)
    }
    else{
      return ResponseUtil.success(token,h)
    }
  }
  catch (error) {
    return ResponseUtil.error(USERMSG.ERROR,h);
  
  }
}






export async function logout(request:Hapi.Request, h:Hapi.ResponseToolkit) {
  try{
     const uid=request.headers.userId
     if(uid)
     {
      await client.del(uid.userId.toString());
      return ResponseUtil.success(USERMSG.USER_LOGOUT,h)
     }
  }
    catch(err){return ResponseUtil.error(USERMSG.ERROR,h)}
}


export async function forgotPassword(Request: Request, h: ResponseToolkit) {
  try {
    const { email } = <any>Request.payload;
    const userExist=await user_service.checkUserExist({email:email});
    if(!userExist)return ResponseUtil.notFound(USERMSG.EMAIL_NOT_REGISTERED,h)
    const status=await password_reset_service.forgotPassword(email);
    if(status==1)return ResponseUtil.success(USERMSG.OTP_SEND,h)
}
  catch (error) {
    return ResponseUtil.error(USERMSG.ERROR,h);
  }
}




export async function resetPassword(Request: Request, h: ResponseToolkit) {
  try{
  const { email, otp, password } = <any>Request.payload;
  await password_reset_service.passwordReset(email,otp,password);
  return ResponseUtil.success(USERMSG.RESET_PASSWORD,h)
}

catch(err)
{
  console.log(err);
  return ResponseUtil.error(USERMSG.ERROR,h)
}
}




const oauthClient = new OAuth2Client({
        clientId: '837797227987-84oj9j09cfmv794ekggk1tedp7cbt8i2.apps.googleusercontent.com',
        clientSecret: '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',
        redirectUri: 'http://localhost:3000/auth/google/callback'
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
            audience: '837797227987-84oj9j09cfmv794ekggk1tedp7cbt8i2.apps.googleusercontent.com'
        
            })
            console.log(ticket)

            const {name,email}=ticket.getPayload();
            const payload=ticket.getPayload()
            console.log(payload);
            console.log(name,email)
            oauthClient.revokeToken(tokens.access_token as string);
            const creatUser=await signup_service.google_signup(email,name);
            return creatUser;
        }
    
      
      async function getGoogleSignInUrl() {
     
        const authUrl = oauthClient.generateAuthUrl({
          access_type: 'offline',
          scope:['profile','email']
        });
        return authUrl;
      }

