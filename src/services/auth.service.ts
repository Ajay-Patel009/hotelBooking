
import User, { Userstatus } from "../models/user";
import Boom from '@hapi/boom'
import bcrypt from "bcrypt";
import jwt, { Secret } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { SetOptions, createClient } from "redis";
import { sendGmail } from "../controller/mailController";
import { OTPTemplate, loginCredentialTemplate } from "../common/emailTemplates";
import { USERMSG } from "../common/userResponse";
import { v4 as uuidv4 } from 'uuid';

dotenv.config()
const SECRET_KEY= process.env.SECRET_KEY


const client=createClient();
client.connect()


export class signup_service {

    static async user_signup(name: string, email: string, password: string, phone: number, userType: number) {
            const user=await User.findOne({email});
            const hashedPassword = await bcrypt.hash(password, 10);
            if(user?.status==Userstatus.deleted){
                user.name=name,
                user.password=hashedPassword,
                user.phone=phone,
                user.status=Userstatus.active
                await user.save();
                return user;
            }
            if (!userType) { userType = 1 }
            if (userType == 2) {
                const newUser = new User({
                    name,
                    email,
                    password: hashedPassword,
                    phone,
                    userType,
                    isVerified: false,
                    status:Userstatus.active
                 
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
                    status:Userstatus.active,
                    userType
                });
                await newUser.save();
                return newUser
            }

        }

        static async google_signup(email:string,name:string,password:string){
            const userExist=await User.findOne({email:email});
            if(userExist)
            {
                const token = jwt.sign({ userId:userExist._id, type:"user" }, SECRET_KEY as Secret);
                await client.hSet(userExist._id.toString(), {
                    email: email,
                    status: 'active',
                    deviceId: 'apple_988',
                    IP_Address: "8R5tbf87d6gnf7UHD"
                  })
                return {token,message:"Google sign-In Successful. Please check your mail for the login credentials"};
            }
            else{
                
                const hashedPassword=await bcrypt.hash(password,10);
                const newUser=new User({
                    name:name,
                    email:email,
                    password:hashedPassword,
                    userType:1
                })
                await newUser.save();
                const token = jwt.sign({ userId: newUser._id, type: "user" }, SECRET_KEY as Secret)
                const data={
                    email:email,
                    password:password
                  }
                  await sendGmail(email,"Login Credentials",data,loginCredentialTemplate)
                return {message:"Google sign-Up Successful",token};

            }
        }
       
    }


    export class login_service {
       
            static async UserloginService(email: string, password: string, IP_Address:string,deviceId:string) {
            const user = await User.findOne({ email });
            if (!user)
                throw Boom.notFound('User not found');
            const isPassword = await bcrypt.compare(password, user.password);
            const status=Userstatus.active;
            user.status=status;
            await user.save();
            if(!isPassword) return 0;
            const uid:string= user._id.toString()
            const token = jwt.sign({ userId: uid, type:"user",status:status}, SECRET_KEY as Secret);
            await client.hSet(user._id.toString(), {
                email: email,
                status: 'active',
                deviceId: 'apple_988',
                IP_Address: IP_Address
              })
            return token;
        }
    }


    export class password_reset_service {
        static async forgotPassword(email:string){
            let OTP = Math.floor(1000 + Math.random() * 9000);
            const options:SetOptions={EX:100};
            client.set(email, OTP, options);
            await sendGmail(email,"password reset",OTP,OTPTemplate)
            return 1;
        }


        static async passwordReset(email:string,otp:string,newPassword:string){
            const redisOTP = await client.get(email);
            if(redisOTP!=otp){throw Boom.badRequest(USERMSG.INVALID_OTP);}
                const hashedPassword = await bcrypt.hash(newPassword, 10)
                const update = await User.findOneAndUpdate({ email: email }, { $set: { password: hashedPassword } });
                if (update) {
                  await client.DEL(email);
                  return;
                }

        }
    }

