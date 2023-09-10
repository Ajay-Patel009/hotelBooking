import { HTTP } from "../common/codeResponses";
import { ownerDetailTemplate } from "../common/emailTemplates";
import { HOTELMSG } from "../common/hotelResponses";
import { sendGmail } from "../controller/mailController";
import Hotel from "../models/hotel.scema";
import User from "../models/user";
import bcrypt from 'bcrypt';
import  Boom  from "@hapi/boom";
import { USERMSG } from "../common/userResponse";




export class user_service{
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
        const isDeleted=await User.findByIdAndDelete(userId);
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
        console.log(user)
        if (!user) {
            return [{},HTTP.NOT_FOUND];
        }
        
        if (requestBody.name) {
            user.name = requestBody.name;
        }
        if (requestBody.phone) {
            user.phone = requestBody.phone;
        }
        const isSave = await user.save();
        if(isSave)return [user,HTTP.SUCCESS];
        else return [{},HTTP.NOT_FOUND];
    }


    static async updatePassword(userId:string, currentPassword:string,newPassword:string,confirmPassword:string){
        const user=await User.findById(userId);
        console.log(user)
        if(!user)
        {
            return Boom.notFound(USERMSG.USER_NOT_EXIST);
        }
        console.log(user.password)
        const passwordCheck = await bcrypt.compare(currentPassword, user.password);
        console.log(passwordCheck)
        if(!passwordCheck){
            return Boom.unauthorized(USERMSG.WRONG_PASSWORD)
        }
        if(newPassword==confirmPassword)
        {
            const hashedPassword=await bcrypt.hash(newPassword,10);
            user.password=hashedPassword;
            await user.save();
            return {message:USERMSG.RESET_PASSWORD,statusCode:HTTP.SUCCESS};
        }
        else{
            throw Boom.unauthorized(USERMSG.PASSWORD_MISSMATCH)
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
    

  
