import Room, { hotelSchema } from "../models/hotel.scema";
import Hapi from '@hapi/hapi';
import * as dotenv from "dotenv";
import User from "../models/user";
import { USERMSG } from "../common/userResponse";
import Hotel from "../models/hotel.scema";
import { hotel_booking_service, hotel_review_service, hotel_service } from "../services/hotel.service";
import amqp from 'amqplib';
import { HOTELMSG } from "../common/hotelResponses";
import Transaction from "../models/transaction";
import { HTTP } from "../common/codeResponses";
import mongoose from "mongoose";
import { classifier } from "../bot/bot.training";
const stripe = require('stripe')('sk_test_51NpnFqSDai0wLS7KMsQefprvlODc5hLdMRmdln5TdDKxBz6PnqXeBMoIVLeLDDVB5Xu2HVHHIaVqwdf6laQvLxRT00hu4x82QT');




dotenv.config();
const PORT = process.env.PORT;

export async function uploadHotel(request:Hapi.Request, h:Hapi.ResponseToolkit) {
  try{
    const id=request.headers.userId
    const owner_id=id.userId
    const requestBody = request.payload as typeof hotelSchema;
    await hotel_service.uploadHotel(owner_id,requestBody);
    return h
          .response({
            Message:HOTELMSG.HOTEL_DETAIL_UPDATED
          }).code(200)
 } 
    catch(err)
    {
        console.log(err)
        return h.response(HOTELMSG.ERROR).code(500)
    }
}

export async function deleteHotel(request:Hapi.Request, h:Hapi.ResponseToolkit) {
 try{

    const id=request.headers.userId
    const owner_id=id.userId
    const housing_id: string = request.query.id as string;
    const bool=await hotel_service.deleteHotel(housing_id,owner_id)
    if(bool)
    {
        return h.response({ Message:HOTELMSG.HOTEL_DELETED}).code(201);
    }
    else{
        return h
        .response({ Message:HOTELMSG.HOTEL_NOT_FOUND}).code(404);
    }
} catch(err)
{
    console.log(err);
    return h.response(HOTELMSG.ERROR).code(500)
}}


export async function getAllHotel(request:Hapi.Request, h:Hapi.ResponseToolkit) {
   
try{   
    const page=request.query.page;
    const limit=request.query.limit;
    const [housingData,status]=await hotel_service.getAllHotel(page,limit)
    if(housingData)
    {
        return h.response({
            status:status,
            All_Rooms: housingData,
            Action: `please login: http://localhost:${PORT}/getRoomDetails`}).code(201);
    }
    else{
        return h.response({message:HOTELMSG.HOTEL_NOT_FOUND}).code(404)
     }
}
catch(err)
{   
    console.log(err);
    return h.response(USERMSG.ERROR)
}
}

export async function gethotelDetail(request:Hapi.Request, h:Hapi.ResponseToolkit) {
    try{
    const house_id=request.query.house_id;
    const house_details=await hotel_service.hotelDetails(house_id);
    if(!house_details)
    {
        return h.response({message:HOTELMSG.HOTEL_NOT_FOUND}).code(404)
    }
    else{
        return h.response({house_details}).code(200);
    }
}
    catch(err){
        console.log(err)
        return h.response(HOTELMSG.ERROR);
    }
    
}



export async function filterHotel(request:Hapi.Request, h:Hapi.ResponseToolkit) {
    try{
     const price= request.query.price;
     const type=request.query.type; 
     const city=request.query.city;

     var data;
 
     
     if(price)
     {
       data=await Room.find({price:{$lte:price}});
     }
     if(type)
     {
       data=await Room.find({type:type});
     }
     if(city)
     {
       data= await Room.find({"address.city":city});
     }
      
     if(price && type)
     {
        data=await Room.find({price:{$lte:price},type:type});
     }
     if(price && type && city)
     {
        data=await Room.find({price:{$lte:price},type:type,"address.city":city});
     }

     if(!data)
     {
        {
            return h.response({Message:HOTELMSG.HOTEL_NOT_FOUND}).code(404)
        }
     }
    if(data)
    {
        return h.response({ All_Rooms: data}).code(201);
    }
   }
catch(err)
{
    console.log(err);
}}



export async function updateHotel(request:Hapi.Request, h:Hapi.ResponseToolkit) {
    try{
        const uid=request.headers.userId
        const owner_id=uid.userId
        const hotel_id=request.query.hotel_id;
        const requestBody =request.payload;
        const updatedHouse=await hotel_service.updateHotelDetails(hotel_id,owner_id,requestBody)
        
          if(updatedHouse)
          {
              return h.response({Message:HOTELMSG.HOTEL_DETAIL_UPDATED}).code(201);
          }
          else{
            return h.response({Message:HOTELMSG.HOTEL_DETAIL_UPDATE_FAILED}).code(400);
          }
    }
        catch(err)
        {
            console.log(err)
        }
    }



export async function bookHotel(request:Hapi.Request, h:Hapi.ResponseToolkit) {

    try {
        const rabbitMQConnection = amqp.connect('amqp://localhost');
        const channel =(await rabbitMQConnection).createChannel();
        const uid=request.headers.userId;
        const hotel_id=request.query.hotel_id;
        const isRoom=await Hotel.findById(hotel_id);
        const {check_in_date,check_out_date}=<any>request.payload;

        if(!isRoom)
        {
            return h.response({Message:HOTELMSG.HOTEL_NOT_FOUND}).code(HTTP.NOT_FOUND)
        }
    
        const user = await User.findOne({ _id: uid.userId });
        
        if (user) 
        {
           
            
            const newBooking:any = {
                room_id: hotel_id,
                check_in_date:check_in_date,
                check_out_date:check_out_date,
                bookedOn:new Date()
            };
            user.booking.push(newBooking);
            await user.save();
            
       
            newBooking.email = user.email;
            const bookingIds = user.booking.map((booking) => booking._id);
            const bookingId=(bookingIds[bookingIds.length-1]);
            const newTransation:any={
                bookingId:bookingId,
                debit:uid.userId,
                credit:isRoom.createdBy,
                amount:isRoom.price
                
            }
            const newbooking = await Transaction.create(newTransation);
            const queueName = 'booking-notifications';
            const message = JSON.stringify(newBooking);
            (await channel).assertQueue(queueName);
            (await channel).sendToQueue(queueName, Buffer.from(message));
            return h.response(HOTELMSG.BOOKING_SUCCESS).code(HTTP.SUCCESS);
        }
    }
        catch(err)
        {
           
            return h.response({err:err})
        }
    }


    export async function cancelBooking(request: Hapi.Request, h: Hapi.ResponseToolkit) {
        try {
            const uid = request.headers.userId;
            const booking_id = request.query.booking_id;
            const user = await User.findById(uid.userId);
            const b=new mongoose.Types.ObjectId(booking_id)
            const transaction=await Transaction.findOne({bookingId:b});
            if(!transaction){
                return h.response("no bookings found for this hotel")
            }
            const paymentIntentId=transaction.paymentIntent;
            const refund = await stripe.refunds.create({
                  payment_intent: paymentIntentId,
                  metadata:{
                    bookingId:booking_id,
                    ownerId:(transaction.ownerId).toString()
                  }
                });
                console.log(refund);
                if (user) {
                const bookingIndex = user.booking.findIndex(booking => booking._id.toString() === booking_id);
                console.log(bookingIndex)
                if (bookingIndex !== -1) {
                    const newtransaction = new Transaction({
                        
                        debit:refund.amount, 
                        bookingId:booking_id,
                        ownerId:(transaction.ownerId).toString(),
                        status:refund.status,
                        paymentIntent:refund.payment_intent
                        
                      
                    });
            
    
                    // Save the transaction
                    await newtransaction.save();
    
                    // Remove the booking
                    user.booking.splice(bookingIndex, 1);
                    await user.save();
    
                    return h.response(HOTELMSG.BOOKING_CANCELLED).code(HTTP.SUCCESS);
                } else {
                    return h.response(HOTELMSG.BOOKING_NOT_FOUND).code(HTTP.SUCCESS);
                }
            } else {
                return h.response(USERMSG.USER_NOT_EXIST).code(404);
            }
        } catch (error) {
            console.log(error)
            return h.response(HOTELMSG.ERROR).code(HTTP.ERROR);
        }
    }
    



    export async function viewbookings(request:Hapi.Request, h:Hapi.ResponseToolkit) {
        try{
        const uid=request.headers.userId
        const Bookings=await User.find({_id:uid.userId},{booking:1})
        if(Bookings)
        {
            return h.response({Bookings})
        }
        else{
            return h.response({Message:HOTELMSG.BOOKING_NOT_FOUND}).code(404)
        }
        }
        catch(err)
        {
            console.log(err)
            return h.response({error:USERMSG.ERROR})
        }
        
    } 
    
    export async function viewAllbookings(request:Hapi.Request, h:Hapi.ResponseToolkit){
        try{
        const hotelId=request.query.hotel_id;
        const bookings=await hotel_booking_service.viewallBookings(hotelId)
        return h.response(bookings).code(HTTP.SUCCESS);
        }
        catch(err){
            return h.response(USERMSG.ERROR)
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
            return h.response({review}).code(HTTP.SUCCESS);
        }
        catch(err)
        {
            console.log(err)
            return h.response(USERMSG.ERROR).code(HTTP.ERROR);
        }

    }



  export async function deleteReview(request:Hapi.Request,h:Hapi.ResponseToolkit)
  {
    try{
        const uid=request.headers.userId;
        const hotel_id=request.query.hotel_id;
        const result=await hotel_review_service.deleteReview(uid.userId,hotel_id);
        return h.response(result);
    }
    catch(err)
    {   
        console.log(err);
        return h.response(HOTELMSG.ERROR).code(500)
    }
 }




 export async function getHotelReviewsWithUserNames(request:Hapi.Request, h:Hapi.ResponseToolkit) {
    try {
        const hotel_id=request.query.hotel_id;
        const review=await hotel_review_service.viewReview(hotel_id)
        return h.response({review})
    } catch (error) {
        console.error('Error fetching hotel reviews:', error);
        return h.response(USERMSG.ERROR)
    }
}

export async function viewAllMyReviews(request:Hapi.Request, h:Hapi.ResponseToolkit) {
    try{
        const uid=request.headers.userId;
        const reviews=await hotel_review_service.viewMyAllReview(uid.userId);
        return h.response(reviews)
    }
    catch(err){
        return h.response({err:err});
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
        return h.response("err").code(500);
      }
    }











        
    

























 




   