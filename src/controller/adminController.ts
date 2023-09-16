import { Request, ResponseToolkit } from "@hapi/hapi";
import dotenv from "dotenv";
import { USERMSG } from "../common/userResponse";
import Admin from "../models/admin";

import { admin_service } from "../services/admin.service";
import { HOTELMSG } from "../common/hotelResponses";
import exp from "constants";
import { HTTP } from "../common/codeResponses";
import Boom from "boom";
import { emit } from "process";

dotenv.config();
const PORT = process.env.PORT;
const SECRET_KEY = process.env.SECRET_KEY;

//adminRegister function automatically get called when the code executes
export async function creatAdmin() {
  const createAdmin = await Admin.create({
    name: process.env.ADMIN_NAME,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  });
  await createAdmin.save();
  console.log("ADMIN CREATED");
}

export async function adminLogin(request: Request, h: ResponseToolkit) {
  const { email, password } = <any>request.payload;
  const type: string = "admin";
  const admin = await admin_service.admin_login(email, password);
  return admin;
}

export async function deletePost(request: Request, h: ResponseToolkit) {
  try {
    const post_id = request.query.post_id;
    const isDeleted = await admin_service.delete_post(post_id);
    if (isDeleted) {
      return h.response({ Message: HOTELMSG.HOTEL_DELETED }).code(201);
    } else {
      return h.response({ Message: HOTELMSG.HOTEL_DELETE_FAILED }).code(404);
    }
  } catch (err) {
    console.log(err);
    return h.response({ err: USERMSG.ERROR });
  }
}

export async function verifyOwner(request: Request, h: ResponseToolkit) {
  try {
    const ownerId = request.query.ownerId;
    const result = await admin_service.verify_owner(ownerId);
    if (result.message) {
      return h.response({ Message: result.message, status: result.status });
    } else {
      return h.response({ Message: "Failed to verify the seller" });
    }
  } catch (err) {
    console.log(err);
    return h.response({ err: USERMSG.ERROR });
  }
}

export async function adminForgotPassword(request: Request, h: ResponseToolkit) {
    try{
  const {email} =<any>request.payload;
  const otp = await admin_service.forgot_password(email);
  return h.response({ message: otp }).code(HTTP.SUCCESS);
    }
    catch(err)
    {
        return h.response({err:err});
    }
}

export async function adminResetPassword(request: Request, h: ResponseToolkit) {
    try{
  const payload = request.payload as {
    email?: string;
    otp?: string;
    newPassword?: string;
  };

  if (!payload.email || !payload.otp || !payload.newPassword) {
    if(!payload.email){throw Boom.arguments("missing email")}
    if(!payload.otp){throw Boom.arguments("missing otp")};
    if(!payload.newPassword){ throw Boom.arguments("missing password")}
    
  } 
    const { email, otp, newPassword } = payload;
    console.log(email)
    const passwordReset = await admin_service.password_reset(email,otp, newPassword);
    return h.response({ message: passwordReset }).code(HTTP.SUCCESS);
}
catch(err)
{
    console.log(err)
    return h.response({err:err})
  
}
}


export async function adminPaswordChange(request: Request, h: ResponseToolkit) {
    const adminId=request.headers.userId;
    const {newPassword}=<any>request.payload
    console.log(adminId);
    const changePassword=await admin_service.changePasword(adminId.userId,newPassword)
    return h.response(changePassword)
}






















// export async function sendOffers(request:Request, h:ResponseToolkit) {
//     try{
//         const users=User.find();
//         const rabbitMQConnection = amqp.connect('amqp://localhost');
//         const channel =(await rabbitMQConnection).createChannel();
//         const queueName = 'offersQueue';
//         const message = JSON.stringify('100 % discount,,,,,,,,,,,,,,,,, enjoy');
//         (await channel).assertQueue(queueName);
//         (await channel).sendToQueue(queueName, Buffer.from(message));

//         const init = async () => {
//             const rabbitMQConnection = await amqp.connect('amqp://localhost');
//             const channel = await rabbitMQConnection.createChannel();

//             const queueName = 'offerQueue';
//             channel.assertQueue(queueName);

//             channel.consume(queueName, async (message) => {
//                 if(!message) return;
//                 const content=JSON.parse(message.content.toString())
//                 console.log(content)
//                 channel.ack(message);
//             });

//            for(const user of await users)
//               {
//                 sendOffersMail(user.email,"offers",content.toString())
//               };
//         init();
//         return h.response('send').code(201)
//     }
// }
//     catch(err)
//     {
//         console.log(err)
//     }
// }
