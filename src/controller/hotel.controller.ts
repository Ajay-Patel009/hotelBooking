import Room, { HotelStatus, hotelSchema } from "../models/hotel.scema";
import Hapi from '@hapi/hapi';
import * as dotenv from "dotenv";
import User from "../models/user";
import { USERMSG, USERRESPONSE } from "../common/userResponse";
import Hotel from "../models/hotel.scema";
import { hotel_booking_service, hotel_review_service, hotel_service } from "../services/hotel.service";
import amqp from 'amqplib';
import { HOTELMSG, HOTEL_RESPONSE, REVIEW_RESPONSE } from "../common/hotelResponses";
import Transaction from "../models/transaction";
import { HTTP,} from "../common/codeResponses";
import mongoose from "mongoose";
import { classifier } from "../bot/bot.training";
import {httpResponse} from '../middleware/response';
import { user_service } from "../services/user.service";
import { BOOKING_RESPONSE } from "../common/bookingResponse";
import Boom from "@hapi/boom";
import { BookingStatus } from "../models/booking.schema";

const stripe = require('stripe')('sk_test_51NpnFqSDai0wLS7KMsQefprvlODc5hLdMRmdln5TdDKxBz6PnqXeBMoIVLeLDDVB5Xu2HVHHIaVqwdf6laQvLxRT00hu4x82QT');
const httpresponse=new httpResponse()



dotenv.config();
const PORT = process.env.PORT;

export async function uploadHotel(request:Hapi.Request, h:Hapi.ResponseToolkit) {
  try{
    const id=request.headers.userId
    const owner_id=id.userId
    const requestBody = request.payload as typeof hotelSchema;
    const newHotel=await hotel_service.uploadHotel(owner_id,requestBody);
    return httpresponse.sendResponse(h,HOTEL_RESPONSE.LIST_HOTELS,newHotel);
 } 
    catch(error)
    {
        if(Boom.isBoom(error)) return h.response({error:error})
        return httpresponse.sendResponse(h,HOTEL_RESPONSE.ERROR);
    }
}



export async function deleteHotel(request:Hapi.Request, h:Hapi.ResponseToolkit) {
 try{

    const id=request.headers.userId
    const owner_id=id.userId
    const hotelId: string = request.query.id as string;
    const hotel=await hotel_service.hotelExist({_id:hotelId,status:HotelStatus.active})
    if(!hotel) return httpresponse.sendResponse(h,HOTEL_RESPONSE.HOTEL_NOT_EXIST);
    const bool=await hotel_service.deleteHotel(hotelId,owner_id)
    if(bool) return httpresponse.sendResponse(h,HOTEL_RESPONSE.DELETED);
  
} 
catch(err)
 {
    console.log(err);
    return httpresponse.sendResponse(h,HOTEL_RESPONSE.ERROR);
 }}


export async function getAllHotel(request:Hapi.Request, h:Hapi.ResponseToolkit) {
   
try{   
    const page=request.query.page;
    const limit=request.query.limit;
    const housingData=await hotel_service.getAllHotel(page,limit)
    if(housingData) return httpresponse.sendResponse(h,HOTEL_RESPONSE.GET_HOTELS,housingData);
    return httpresponse.sendResponse(h,HOTEL_RESPONSE.NOT_FOUND);
}
catch(err)
{   
    return httpresponse.sendResponse(h,HOTEL_RESPONSE.ERROR);
}
}





export async function gethotelDetail(request:Hapi.Request, h:Hapi.ResponseToolkit) {
    try{
    const house_id=request.query.hotel_id;
    const house_details=await hotel_service.hotelDetails(house_id);
    if(!house_details) return httpresponse.sendResponse(h,HOTEL_RESPONSE.NOT_FOUND);
    return httpresponse.sendResponse(h,HOTEL_RESPONSE.HOTEL_DETAIL,house_details);
}
    catch(err){
        console.log(err)
        return httpresponse.sendResponse(h,HOTEL_RESPONSE.ERROR);
    }
}





export async function filterHotel(request:Hapi.Request, h:Hapi.ResponseToolkit) {
    try{
     const price= request.query.price;
     const type=request.query.type; 
     const city=request.query.city;
     const filtered_hotels=await hotel_service.filterHotel(price,type,city);
     if(!filterHotel) return httpresponse.sendResponse(h,HOTEL_RESPONSE.NOT_FOUND);
     return httpresponse.sendResponse(h,HOTEL_RESPONSE.GET_HOTELS,filtered_hotels)
    
   }
catch(err)
{
    console.log(err);
}
}


export async function searchHotels(request:Hapi.Request, h:Hapi.ResponseToolkit) {
    try{
        const query='dhaba'
        console.log(query)
        const data=await hotel_service.HotelsSearch(query);
        if(!data) return h.response("not found")
        return h.response(data);
    }
    catch(err){
        console.log(err)
    }
    
}
export async function searchit(request:Hapi.Request, h:Hapi.ResponseToolkit) {
   const data=await hotel_service.sea('haweli');
   return h.response(data);
}








export async function updateHotel(request:Hapi.Request, h:Hapi.ResponseToolkit) {
    try{
        const uid=request.headers.userId
        const owner_id=uid.userId
        const hotel_id=request.query.hotel_id;
        const requestBody =request.payload;
        const updatedHotel=await hotel_service.updateHotelDetails(hotel_id,owner_id,requestBody)
        if(updatedHotel) return httpresponse.sendResponse(h,HOTEL_RESPONSE.UPADTE_HOTEL,updatedHotel);
        return httpresponse.sendResponse(h,HOTEL_RESPONSE.ERROR);
          
    }
        catch(err)
        {
            return httpresponse.sendResponse(h,HOTEL_RESPONSE.ERROR);
        }
}



// export async function bookHotel(request:Hapi.Request, h:Hapi.ResponseToolkit) {

//     try {
//         const rabbitMQConnection = amqp.connect('amqp://localhost');
//         const channel =(await rabbitMQConnection).createChannel();
//         const uid=request.headers.userId;
//         const hotel_id=request.query.hotel_id;
//         const {check_in_date,check_out_date}=<any>request.payload;  
//         // const isRoom=await Hotel.findById(hotel_id);
//         const isRoom=await hotel_service.hotelExist({_id:hotel_id});
//         if(!isRoom) return httpresponse.sendResponse(h,hotelResponses.NOT_FOUND)
//         const user=await user_service.checkUserExist({_id:uid.userId})
//         if(!user) return httpresponse.sendResponse(h,USERRESPONSE.USER_NOT_EXIST);
//         // const user = await User.findOne({ _id: uid.userId });
        
//         if (user) 
//         {
           
            
//             const newBooking:any = {
//                 room_id: hotel_id,
//                 check_in_date:check_in_date,
//                 check_out_date:check_out_date,
//                 bookedOn:new Date()
//             };
//             user.bo{_id:bookingId,status:{$eq:BookingStatus.confirmed}}oking.push(newBooking);
//             await user.save();
            
       
//             newBooking.email = user.email;
//             const bookingIds = user.booking.map((booking) => booking._id);
//             const bookingId=(bookingIds[bookingIds.length-1]);
//             const newTransation:any={
//                 bookingId:bookingId,
//                 debit:uid.userId,
//                 credit:isRoom.createdBy,
//                 amount:isRoom.price
                
//             }
//             const newbooking = await Transaction.create(newTransation);
//             const queueName = 'booking-notifications';
//             const message = JSON.stringify(newBooking);
//             (await channel).assertQueue(queueName);
//             (await channel).sendToQueue(queueName, Buffer.from(message));
//             return h.response(HOTELMSG.BOOKING_SUCCESS).code(HTTP.SUCCESS);
//         }
//     }
//         catch(err)
//         {
           
//             return h.response({err:err})
//         }
//     }


    // export async function cancelBooking(request: Hapi.Request, h: Hapi.ResponseToolkit) {
    //     try {
            
    //         const uid = request.headers.userId;
    //         const booking_id = request.query.booking_id;
    //         const user =await user_service.checkUserExist({_id:uid.userId})
    //         const b=new mongoose.Types.ObjectId(booking_id)
    //         const transaction=await Transaction.findOne({bookingId:b});
    //         if(!transaction){
    //             return h.response("no bookings found for this hotel")
    //         }

    //         const paymentIntentId=transaction.paymentIntent;
    //         const refund = await stripe.refunds.create({
    //               payment_intent: paymentIntentId,
    //               metadata:{
    //                 bookingId:booking_id,
    //                 ownerId:(transaction.ownerId).toString()
    //               }
    //             });
    //             console.log(refund);
    //             if (user) {
    //             const bookingIndex = user.booking.findIndex(booking => booking._id.toString() === booking_id);
    //             console.log(bookingIndex)
    //             if (bookingIndex !== -1) {
    //                 const newtransaction = new Transaction({
                        
    //                     debit:refund.amount, 
    //                     bookingId:booking_id,
    //                     ownerId:(transaction.ownerId).toString(),
    //                     status:refund.status,
    //                     paymentIntent:refund.payment_intent
                        
                      
    //                 });
            
    
    //                 // Save the transaction
    //                 await newtransaction.save();
    
    //                 // Remove the booking
    //                 user.booking.splice(bookingIndex, 1);
    //                 await user.save();
    
    //                 return h.response(HOTELMSG.BOOKING_CANCELLED).code(HTTP.SUCCESS);
    //             } else {
    //                 return h.response(HOTELMSG.BOOKING_NOT_FOUND).code(HTTP.SUCCESS);
    //             }
    //         } else {
    //             return h.response(USERMSG.USER_NOT_EXIST).code(404);
    //         }
    //     } catch (error) {
    //         console.log(error)
    //         return h.response(HOTELMSG.ERROR).code(HTTP.ERROR);
    //     }
    // }

    export async function cancelBooking(request:Hapi.Request,h:Hapi.ResponseToolkit){
        const bookingId=request.query.booking_id;
        const bookingExist=await hotel_booking_service.bookingExist({_id:bookingId,status:{$eq:BookingStatus.confirmed}});
        if(!bookingExist) return httpresponse.sendResponse(h,BOOKING_RESPONSE.NOT_EXIST);
        const cancelBooking=await hotel_booking_service.cancel_booking(bookingId);
        if(cancelBooking) return httpresponse.sendResponse(h,BOOKING_RESPONSE.BOOKING_CANCEL) 

        
    }
    



    export async function viewbookings(request:Hapi.Request, h:Hapi.ResponseToolkit) {
        try{
            const uid=request.headers.userId;
            const booking=await hotel_booking_service.viewBookings(uid.userId);
            if(!booking) return httpresponse.sendResponse(h,BOOKING_RESPONSE.NOT_FOUND)
            return httpresponse.sendResponse(h,BOOKING_RESPONSE.GET_BOOKING,booking)
        }
        catch(err)
        {
            console.log(err)
            return httpresponse.sendResponse(h,BOOKING_RESPONSE.ERROR)
        }
        
    } 



    
    export async function viewAllbookings(request:Hapi.Request, h:Hapi.ResponseToolkit){
        try{
            const hotelId=request.query.hotel_id;
            const bookings=await hotel_booking_service.viewallBookings(hotelId)
            if(!bookings) return httpresponse.sendResponse(h,BOOKING_RESPONSE.NOT_FOUND)
            return httpresponse.sendResponse(h,BOOKING_RESPONSE.GET_BOOKING,bookings);
        }
        catch(err){
            return httpresponse.sendResponse(h,BOOKING_RESPONSE.ERROR)
        }
    }




    export async function uploadImage(request:Hapi.Request,h:Hapi.ResponseToolkit) {
        try {
            const data: any = request.payload;
            const uid=request.headers.userId;
            const room_id=request.query.room_id;
                if (!data.file) {
                    return h.response({ message: "No file Provided" }).code(400);
                }
                const name = data.file.hapi.filename;
                const isRoom=await Room.findById({_id:room_id})
                console.log(isRoom);
                if(isRoom)
                {
                    isRoom.images.push(name);
                    await isRoom.save();
                    return h.response("file uploaded Succesfully")
                }
              
            }
            catch(err)
            {
                return h.response(HOTELMSG.ERROR)
                
            }
        }




    export async function addReview(request:Hapi.Request,h:Hapi.ResponseToolkit) {
        try{
            const uid=request.headers.userId;
            const hotel_id=(request.query.hotel_id);
            const userId=uid.userId
            const{rating,text}=<any>request.payload
            console.log(hotel_id)
            const review=await hotel_review_service.giveReview(hotel_id,userId,rating,text);
            return httpresponse.sendResponse(h,REVIEW_RESPONSE.ADD_REVIEW);
        }
        catch(err)
        {
            return h.response(USERMSG.ERROR).code(HTTP.ERROR);
        }

    }



  export async function deleteReview(request:Hapi.Request,h:Hapi.ResponseToolkit)
  {
    try{
        const uid=request.headers.userId;
        const review_id=request.query.review_id;
        const reviewExist=await hotel_review_service.checkReviewExist({_id:review_id,"reviews.user_id":uid.userId});
        if(!reviewExist) return httpresponse.sendResponse(h,REVIEW_RESPONSE.REVIEW_NOT_EXIST)
        await hotel_review_service.deleteReview(uid.userId,review_id);
        return httpresponse.sendResponse(h,REVIEW_RESPONSE.DELETE_REVIEW);
    }
    catch(err)
    {   
        console.log(err);
        return httpresponse.sendResponse(h,REVIEW_RESPONSE.ERROR);
    }
 }




 export async function getHotelReviewsWithUserNames(request:Hapi.Request, h:Hapi.ResponseToolkit) {
    try {
        const hotel_id=request.query.hotel_id;
        const review=await hotel_review_service.viewReview(hotel_id)
        if(!review) return httpresponse.sendResponse(h,REVIEW_RESPONSE.REVIEW_NOT_FOUND);
        return httpresponse.sendResponse(h,REVIEW_RESPONSE.GET_REVIEWS,review);
    }
     catch (error) {
        return httpresponse.sendResponse(h,REVIEW_RESPONSE.ERROR);
    }
}





export async function viewAllMyReviews(request:Hapi.Request, h:Hapi.ResponseToolkit) {
    try{
        const uid=request.headers.userId;
        const reviews=await hotel_review_service.viewMyAllReview(uid.userId);
        if(!reviews) return httpresponse.sendResponse(h,REVIEW_RESPONSE.REVIEW_NOT_FOUND)
        return httpresponse.sendResponse(h,REVIEW_RESPONSE.GET_REVIEWS,reviews)
    }
    catch(err){
        return httpresponse.sendResponse(h,REVIEW_RESPONSE.ERROR);
    }
}





export async function chatBot(request:Hapi.Request, h:Hapi.ResponseToolkit) {
    const userInput:any = request.query.query; // Get user input from the request payload
          const response = classifier.classify(userInput); // Use the NLP model to generate a response
          return h.response({ response });
    
}




export async function hotelBooking(request:Hapi.Request, h:Hapi.ResponseToolkit) {
    const uid=request.headers.userId;
    const hotel_id=request.query.hotel_id;
    const {check_in_date,check_out_date}=<any>request.payload;
    try {

    const re=await hotel_booking_service.book_hotel(uid.userId,hotel_id,check_in_date,check_out_date)
    return re;
  
    } catch (error) {
        console.error(error);
        return httpresponse.sendResponse(h,BOOKING_RESPONSE.ERROR);
      }
    }











        
    

























 




   