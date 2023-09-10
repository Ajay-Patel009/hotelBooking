
import User from "../models/user";
import Boom from '@hapi/boom'
import bcrypt from "bcrypt";
import jwt, { Secret } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { SetOptions, createClient } from "redis";
import { sendGmail } from "../controller/mailController";
import { OTPTemplate } from "../common/emailTemplates";
import { USERMSG } from "../common/userResponse";

dotenv.config()
const SECRET_KEY= process.env.SECRET_KEY


const client=createClient();
client.connect()


export class signup_service {
    // signup for agent
    static async user_signup(name: string, email: string, password: string, phone: string, userType: number) {

            if (!userType) { userType = 1 }
            const user = await User.findOne({ email });
            if (user) {
                throw Boom.conflict(USERMSG.USER_EMAIL_ALREADY)
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            if (userType == 2) {
                const newUser = new User({
                    name,
                    email,
                    password: hashedPassword,
                    phone,
                    userType,
                    isVerified: false
                });
                await newUser.save();
                return newUser;

            }
            else {
                const newUser = new User({
                    name,
                    email,
                    password: hashedPassword,
                    phone,
                    userType
                });
                await newUser.save();
                return newUser
            }

        }
       
    }


    export class login_service {
       static async UserloginService(email: string, password: string) {
            const user = await User.findOne({ email });
            if (!user)
                throw Boom.notFound('User not found');
            const isPassword = await bcrypt.compare(password, user.password);
            if(!isPassword) return 0;
            const uid:string= user._id.toString()
            const token = jwt.sign({ userId: uid, type:"user" }, SECRET_KEY as Secret);
            await client.hSet(user._id.toString(), {
                email: email,
                status: 'active',
                deviceId: 'apple_988',
                IP_Address: "8R5tbf87d6gnf7UHD"
              })
            return token;
        }
    }


    export class password_reset_service {
        static async forgotPassword(email:string){
            const user = await User.findOne({ email: email });
            if (!user) {
              return 0;
            }
            let OTP = Math.floor(1000 + Math.random() * 9000);
            const options:SetOptions={EX:100};
            client.set(email, OTP, options);
            await sendGmail(email,"password reset",OTP,OTPTemplate)
        }


        static async passwordReset(email:string,otp:string,newPassword:string){
            const redisOTP = await client.get(email);
            if(redisOTP!=otp){throw Boom.badRequest("INVALID OTP");}
                const hashedPassword = await bcrypt.hash(newPassword, 10)
                const update = await User.findOneAndUpdate({ email: email }, { $set: { password: hashedPassword } });
                if (update) {
                  await client.DEL(email);
                  return;
                }

        }
    }

