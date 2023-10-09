import { createClient } from "redis";
import { ownerDetailTemplate } from "../common/emailTemplates";
import { HOTELMSG } from "../common/hotelResponses";
import { sendGmail } from "../controller/mailController";
import Hotel from "../models/hotel.scema";
import User, { Userstatus } from "../models/user";
import bcrypt from 'bcrypt';
const client=createClient();
client.connect()




export class user_service{

    static async checkUserExist(payload:any){
            return await User.findOne(payload)
    }


    static async getUser(userId:string)
    {
        const user=await User.findById({_id:userId})
        if(!user)
        {
            return false;
        }
        else{
            return user
        }
    }


    static async deleteUser(userId:string){
        const isDeleted=await User.findByIdAndUpdate(userId,{status:Userstatus.deleted});
        const session_status=await client.hSet(userId,"status","inactive");
        if(isDeleted)
        {
            return true
        }
        else{
            return false
        }
    }


    static async updateUser(userId:string, requestBody:any) {
        const user = await User.findById({_id:userId});
        if (!user) return;
        if (requestBody.name) {
            user.name = requestBody.name;
        }
        if (requestBody.phone) {
            user.phone = requestBody.phone;
        }
        const isSave = await user.save();
        if(isSave)return user;
    }


    static async updatePassword(userId:string, currentPassword:string,newPassword:string,confirmPassword:string){
        const user=await User.findById(userId);
        if(!user) return;
        const passwordCheck = await bcrypt.compare(currentPassword, user.password);
        console.log(passwordCheck);
        if(!passwordCheck) return;
        if(newPassword==confirmPassword && passwordCheck)
        {
            const hashedPassword=await bcrypt.hash(newPassword,10);
            user.password=hashedPassword;
            await user.save();
            return user
            
        }
    
    }



    static async ownerContact(hotel_id:string,userId:string) {

        console.log(hotel_id)
        const user=await User.findById(userId);
        if(user){
            const email=user?.email
            const isHotelExist=await Hotel.findById(hotel_id)
            if(!isHotelExist)
            {
             return ({Message:HOTELMSG.HOTEL_NOT_FOUND,code:404})
            }
            if(isHotelExist){
            const data=isHotelExist.contactInfo;
            sendGmail(email,"owner Information",data,ownerDetailTemplate)
            return (isHotelExist.contactInfo)
        }
    }
}
}
    

  
