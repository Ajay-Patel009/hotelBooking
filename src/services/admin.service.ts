import User from '../models/user';
import Admin from '../models/admin';
import jwt, { Secret } from 'jsonwebtoken'
import { HTTP } from '../common/codeResponses';
import Hotel from '../models/hotel.scema';
import mongoose from 'mongoose';
import Boom from 'boom';
import { SetOptions } from 'redis';
import { OTPTemplate } from '../common/emailTemplates';
import { sendGmail } from '../controller/mailController';
import { createClient } from 'redis';
import bcrypt from 'bcrypt';

const client=createClient();
client.connect()


const SECRET_KEY=process.env.SECRET_KEY;


export class admin_service{
    // static async  createAdmin(name:string,email:string,password:string) {
    //     const createAdmin=await Admin.create({
    //         name,
    //         email,
    //         password,
    //     })
    //     await createAdmin.save();
    //     return createAdmin;
    // }



    static async admin_login(email:string,password:string)
    {
        const isAdmin= await Admin.findOne({email:email});
        console.log(isAdmin)
        if(isAdmin)
        {
            // const isPassword = await bcrypt.compare(password, isAdmin.password);
            if(password==isAdmin.password)
            {
                const token= jwt.sign({ userId: isAdmin._id,type:"admin"}, SECRET_KEY as Secret);
                return [token,HTTP.SUCCESS];
            }
            else{
                return [{},HTTP.NOT_FOUND]
            }
        }
       
    }


    static async delete_post(post_id:string){
        
        const isDeleted= await Hotel.findOneAndDelete({_id:post_id});
        if(isDeleted)
        {
            return true;
        }
        else{
            return false;
        }
    }

    static async verify_owner(ownerId:string){
        const id = new mongoose.Types.ObjectId(ownerId);
        const ownerExist = await User.findById(id);
        console.log(ownerExist)
        if (!ownerExist) {
            return { message: 'owner not found',status:HTTP.NOT_FOUND};
        }
        if (ownerExist.isVerified) {
            return { message: 'owner is already Verified',status:HTTP.CONFLICT };
        } else {
            ownerExist.isVerified = true;
            const verify = await ownerExist.save();
            if (verify) {
                return { message: 'owner verified Successfully',status:HTTP.SUCCESS};
            } else {
                return { message: 'Failed to verify the owner' ,status:HTTP.BAD_REQUEST};
            }
        }
    }


    static async forgot_password(email:string)
    {
        console.log(email)
        const adminExist=await Admin.findOne({email})
        console.log(adminExist)
        if(!adminExist)
        {
            throw Boom.notFound("admin not found");
        }
        let OTP = Math.floor(1000 + Math.random() * 9000);
            const options:SetOptions={EX:100};
            client.set(email, OTP,);
            await sendGmail(email,"password reset",OTP,OTPTemplate);
            return {message:"otp sent"}
    }


    static async password_reset(email:string,otp:string,newPassword:string)
    {
        const adminExist=await Admin.findOne({email:email});
        console.log(adminExist)
        if(!adminExist)
        {
            throw Boom.notFound("admin not found");
        }
        const redis_otp=await client.get(email);
        console.log(redis_otp);
        console.log(otp)
        if(redis_otp!=otp){
            throw Boom.unauthorized("wrong otp");
        }
        const hashedPassword=await bcrypt.hash(newPassword,10);
        const update = await Admin.findOneAndUpdate({ email: email }, { $set: { password: hashedPassword } });
        console.log(update)
        if(!update){
            return "password reset failed"
        }
        if (update) {
          await client.DEL(email);
          return "password reset success";
        }

    }



    static async changePasword(adminId:string,newPassword:string){
        const hashedPassword=await bcrypt.hash(newPassword,10)
        await Admin.findByIdAndUpdate({_id:adminId},{$set:{password:hashedPassword}})
        return "Password changed";
    }


    static async ownersToVerify(){
        const owners=await User.find({isVerified:false,userType:2},{name:1,email:1,createdAt:1});
        return owners
        
    }
}