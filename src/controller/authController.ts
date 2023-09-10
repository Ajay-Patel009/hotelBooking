import Hapi from '@hapi/hapi'
import { Request, ResponseToolkit } from "@hapi/hapi";
import { createClient} from "redis";
import * as dotenv from "dotenv";
import { USERMSG, USERRESPONSE } from "../common/userResponse";
import { login_service, password_reset_service, signup_service } from "../services/auth.service";
import { HTTP } from '../common/codeResponses';

const client = createClient();
client.on('error', err => console.log('Redis Client ERR', err))
client.connect();

dotenv.config();
const PORT = process.env.PORT;
const SECRET_KEY=process.env.SECRET_KEY

export async function signup(request: Request, h: ResponseToolkit) {
  try {
    var { name, email, password, phone ,userType } = <any>request.payload;
    const new_user=await signup_service.user_signup(name, email, password, phone ,userType)
    
    if (new_user) {

      return h
        .response({
          Message:USERMSG.USER_REGISTER,
          Action: `please login: http://localhost:${PORT}/userlogin`,
        })
        .code(USERRESPONSE.USER_LOGIN.statusCode);
    } else {
      return h
        .response({
          Message:USERMSG.EMAIL_NOT_REGISTERED,
          Action: `Try signup : http://localhost:${PORT}/userSignup`,
        })
        .code(409);
    }
  } catch (error) {
    console.error(error);
    return h.response({ "Message:":error}).code(500);
  }
}


export async function login(Request: Request, h: ResponseToolkit) {
  try {
    const { email, password } = <any>Request.payload;
    const token = await login_service.UserloginService(email,password);
    if(token==0)
    {
      return h.response({Message:USERMSG.WRONG_PASSWORD}).code(HTTP.UNAUTHORIZED)
    }
    return h.response({
        token: token,
        Message:USERMSG.USER_LOGIN,
      });
    }
  catch (error) {
    console.error(error);
    return h.response({ "Message:":USERMSG.ERROR}).code(500);
  
  }
}






export async function logout(request:Hapi.Request, h:Hapi.ResponseToolkit) {
  try{

    const uid=request.headers.userId
     if(uid)
     {console.log("delete")
      await client.del(uid.userId.toString());
      return h.response({Message:USERMSG.USER_LOGOUT})
     }
    }
    catch(err)
    {
      return h.response({err:USERMSG.ERROR}).code(HTTP.BAD_REQUEST)
    }
}


export async function forgotPassword(Request: Request, h: ResponseToolkit) {
  try {
    const { email } = <any>Request.payload
    const status=await password_reset_service.forgotPassword(email);
    if(status==0)
    {
      return h.response(USERMSG.USER_NOT_EXIST).code(HTTP.NOT_FOUND)
    }
    return h.response({Message:USERMSG.OTP_SEND}).code(HTTP.SUCCESS)

}
  catch (error) {
    console.log(error);
    return h.response({ message: USERMSG.ERROR }).code(500);
  }
}




export async function resetPassword(Request: Request, h: ResponseToolkit) {
  try{
  const { email, otp, newPassword } = <any>Request.payload;

  await password_reset_service.passwordReset(email,otp,newPassword);
  return h.response(USERMSG.RESET_PASSWORD).code(201)
 }

catch(err)
{
  console.log(err);
  return h.response(USERMSG.ERROR)
}
}

