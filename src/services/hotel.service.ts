import mongoose, { ObjectId } from "mongoose";
import User from "../models/user";
import Boom from "@hapi/boom";
import dotenv from 'dotenv';
import { HTTP } from "../common/codeResponses";
import Hotel, { HotelStatus } from "../models/hotel.scema";
import Review from "../models/reviewSchema";
const stripe = require("stripe")(
  "sk_test_51NpnFqSDai0wLS7KMsQefprvlODc5hLdMRmdln5TdDKxBz6PnqXeBMoIVLeLDDVB5Xu2HVHHIaVqwdf6laQvLxRT00hu4x82QT"
);
import { createClient } from "redis";
import { OWNERMSG } from "../common/userResponse";
import Booking, { BookingStatus } from "../models/booking.schema";
import { Client } from '@elastic/elasticsearch';
const elastic_client = new Client({
  node: 'http://localhost:9200', // Replace with your Elasticsearch server's URL
});


const redisClient=createClient();
redisClient.connect()
dotenv.config();
const hostName=process.env.HOST;
const PORT=process.env.PORT;




export class hotel_service {

  static async hotelExist(payload:any){
    return Hotel.find(payload);
  }


  static async indexHotel(hotelData:any) {
    await elastic_client.index({
      index: 'allhotels',
      body: hotelData,
    });
  }



  static async uploadHotel(owner_id: string, requestBody: any) {
    const isOwnerPresent = await User.findById({_id: owner_id,userType: 2,});
    if(!isOwnerPresent) throw Boom.notFound(OWNERMSG.NOT_OWNER);
    if (isOwnerPresent.isVerified == false) throw Boom.unauthorized(OWNERMSG.NOT_VERIFIED);
     
    const propertyData = {
      ...requestBody,
      status:HotelStatus.active,
      "contactInfo.name": isOwnerPresent.name,
      "contactInfo.email": isOwnerPresent.email,
      "contactInfo.phone": isOwnerPresent.phone,
      createdBy: owner_id,
    };
    await this.indexHotel(propertyData);
    const newProperty = await Hotel.create(propertyData);
    if (newProperty) return newProperty;
  }
 static async sea(name:any){
  const result=await Hotel.find({name:name})
  return result
 }
  static async HotelsSearch(query:any) {
    console.log(query,"inside api")
    const body  = await elastic_client.search({
      index: 'allhotels',
      body: {
        query: {
          match: {
            name: query,
          },
        },
      },
    });
    return body.hits.hits;
  }
  

  static async deleteHotel(house_id: string, owner_id: string) {
    const deleteRooms = await Hotel.findOneAndUpdate({_id: house_id,createdBy: owner_id,},{$set:{status:HotelStatus.deleted}});
    if (deleteRooms) return true;
    return false;
  }



  static async filterHotel(price:number,type:number,city:string){
    var data;
    if(price) data=await Hotel.find({price:{$lte:price}});
    if(type) data=await Hotel.find({type:type});
    if(city) data= await Hotel.find({"address.city":city});
    if(price && type)data=await Hotel.find({price:{$lte:price},type:type});
    if(price && type && city) data=await Hotel.find({price:{$lte:price},type:type,"address.city":city});
    if(!data) return
    if(data) return data;
  }




  static async hotelDetails(hotel_id: string) {
    return  await Hotel.findById(hotel_id);
  }




  static async updateHotelDetails(hotel_id: string,owner_id: string,requestBody: any){
    const details= await Hotel.findOneAndUpdate({ _id: hotel_id, createdBy: owner_id },{ $set: requestBody },{ new: true });
    return details;
}




  static async getAllHotel(page: number, limit: number) {
    try {
      const skip = (page - 1) * limit;
      const redisKey = `hotels:${page}:${limit}`;
      const info:any=await redisClient.get(redisKey);
      const hotelList=JSON.parse(info)
      
      
      if(!info){
        const data = await Hotel.find({status:HotelStatus.active},{ name: 1, title: 1, type: 1, price: 1, images: 1, reviews: 1 }).skip(skip).limit(limit);
        const totalCount = await Hotel.countDocuments();
        if (data) {
          const totalPages = Math.ceil(totalCount / limit);
          const response = {
            hotels: data,
            currentPage: page,
            totalPages: totalPages,
          };
          const d=JSON.stringify(response)
          await  redisClient.setEx(redisKey,3600,d)
          const info:any=await redisClient.get(redisKey);
          const hotelList=JSON.parse(info)
          return [hotelList, HTTP.SUCCESS];
      }
    }
     
        return hotelList;
      } 
      
     catch (error) {
      console.error(error);
      return [{}, HTTP.NOT_FOUND];
    }
  }
}

export class hotel_review_service {

static async checkReviewExist(payload:any){
    const reviews= await Review.find(payload);
    console.log(reviews)
    return reviews
}



 static async giveReview(
    hotel_id: string,
    userId: string,
    rating: number,
    text: string
  ) {
  
      
      const isHotel = await Hotel.findById(hotel_id);
      if (!isHotel) {
        return;
      }

      const existingReview = await Review.findOne({ hotel_id: hotel_id });
      if (existingReview) {
        const newReview: any = {
          user_id: new mongoose.Types.ObjectId(userId), // Convert userId to ObjectId
          rating: rating,
          text: text,
        };
        existingReview.reviews.push(newReview);
        await existingReview.save();
        const property = await Review.findOne({ hotel_id: hotel_id });
        const totalReviews = property?.reviews.reduce((total) => total + 1, 0);
        const totalratings = property?.reviews.reduce(
          (total, reviews) => total + reviews.rating,
          0
        );
        //UPDATING THE REVIEWS COUNT IN THE HOTEL COLLECTION
        var avgRating: number;
        if (totalratings && totalReviews) {
          avgRating = totalratings / totalReviews;
          await Hotel.findByIdAndUpdate(
            { _id: hotel_id },

            {
              $set: {
                "reviews.total_reviews": totalReviews,
                "reviews.ratings": avgRating,
              },
            }
          );
        }

        return existingReview;
      } 
      //CREATING A NEW  REVIEW 
      else {
        const newReviewData = {
          hotel_id: hotel_id,
          reviews: [
            {
              user_id: new mongoose.Types.ObjectId(userId),
              rating: rating,
              text: text,
            },
          ],
        };
        const newReview = await Review.create(newReviewData);
        const property = await Review.findOne({ hotel_id: hotel_id });
        //COUNTING TOTAL REVIEWS AND RATINGS
        const totalReviews = property?.reviews.reduce((total) => total + 1, 0);
        const totalratings = property?.reviews.reduce(
          (total, reviews) => total + reviews.rating,
          0
        );
        console.log(totalReviews);
        console.log(totalratings);
        return newReview;
      }
    } 


  

  static async deleteReview(user_id: string, hotel_id: string) {
    
      const id = new mongoose.Types.ObjectId(hotel_id);
      const review = await Review.findOne({ hotel_id: id });
      if (!review) return;
      const reviewIndex = review.reviews.findIndex((review) => hotel_id.toString() == hotel_id);
      if (reviewIndex !== -1) {
        review.reviews.splice(reviewIndex, 1);
        await review.save();
        return review
      } 
    
  }

  static async viewReview(hotelId: mongoose.Types.ObjectId) {
    const id = new mongoose.Types.ObjectId(hotelId);
    const aggregationPipeline = [
      {
        $match: { hotel_id: id },
      },

      {
        $unwind: "$reviews",
      },
      {
        $lookup: {
          from: "users",
          localField: "reviews.user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 0,
          review: "$reviews.text",
          userName: "$user.name",
          rating: "$reviews.rating",
        },
      },
    ];

    const result = await Review.aggregate(aggregationPipeline);
    return result;
  }

  static async viewMyAllReview(userId: mongoose.Types.ObjectId) {
   

      // Use MongoDB aggregation to join Review and Hotel collections
      const id = new mongoose.Types.ObjectId(userId);
      const userReviewsWithHotelNames: any[] = await Review.aggregate([
        {
          $match: {
            "reviews.user_id": id, //mongoose.Types.ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: "hotels", // Collection name for hotels
            localField: "hotel_id",
            foreignField: "_id",
            as: "hotel",
          },
        },
        {
          $unwind: "$hotel",
        },
        {
          $project: {
            _id: 0,
            hotelName: "$hotel.name",
            review: "$reviews",
          },
        },
      ]);

      return userReviewsWithHotelNames;
    }
  }


export class hotel_booking_service {


  static async bookingExist(payload:any){
      return await Booking.findOne(payload);
  }

  static async viewallBookings(hotelId: string) {
    const aggregationPipeline = [
      {
        $match: { hotelId: new mongoose.Types.ObjectId(hotelId) }, // Convert userId to ObjectId
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 0,
          UserName:"$user.name",
          userId:"$user._id",
          bookingDate: "$bookedOn",
          checkInDate: "$check_in_date",
          checkOutDate: "$check_out_date",
          status: "$status",
     
        },
      },
    ];
  
    const result = await Booking.aggregate(aggregationPipeline);
    return result;

  }



  // list of bookings with hotel name
  static async viewBookings(userId: string) {
    const aggregationPipeline = [
      {
        $match: { userId: new mongoose.Types.ObjectId(userId), status:{$ne:BookingStatus.deleted}}, // Convert userId to ObjectId
      },
      {
        $lookup: {
          from: "hotels",
          localField: "hotelId",
          foreignField: "_id",
          as: "hotel",
        },
      },
      {
        $unwind: "$hotel",
      },
      {
        $project: {

          hotelName: "$hotel.name",
          bookingDate: "$bookedOn",
          checkInDate: "$check_in_date",
          checkOutDate: "$check_out_date",
          status: "$status",
     
        },
      },
    ];
  
    const result = await Booking.aggregate(aggregationPipeline);
    return result;
  }
  
  
  

  static async book_hotel(
    userId: string,
    hotelId: string,
    check_in_date: string,
    check_out_date: string
  ) {
    const userExist = await User.findById(userId);
    const hotelExist = await Hotel.findById({ _id: hotelId });
    // if (userExist) {
      // const newBooking = Booking.create({
      //   hotelId: hotelId,
      //   userId:userId,
      //   check_in_date: check_in_date,
      //   check_out_date: check_out_date,
      //   bookedOn: new Date(),
      // });
      // userExist.booking.push(newBooking);
      // await userExist.save();
      // newBooking.email = userExist.email;
      // const bookingIds = userExist.booking.map((booking) => booking._id);
      // const bookingId = bookingIds[bookingIds.length - 1];
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "INR",
              product_data: {
                name: hotelExist?.name,
              },
              unit_amount: hotelExist?.price, // Amount in cents
            },
            quantity: 1,
          },
        ],
        metadata: {
          ownerId: (hotelExist?.createdBy).toString(),
          userId: userId,
          hotelId: hotelId,
          check_in_date: check_in_date,
          check_out_date: check_out_date,
          // bookingId: bookingId,
        },
        mode: "payment",
        success_url:
          // "http://localhost:3000/paymentOnSuccess?sessionId={CHECKOUT_SESSION_ID}", // Redirect URL on success
          `http://${hostName}:${PORT}/paymentOnSuccess?sessionId={CHECKOUT_SESSION_ID}`,
        cancel_url:
          `http://${hostName}:${PORT}/paymentOnFailed?sessionId={CHECKOUT_SESSION_ID}`,
      });
      console.log(session);
      return { sessionUrl: session.url };
    }



    static async cancel_booking(bookingId:string){
      return await Booking.findByIdAndUpdate(bookingId,{
        $set:{
          status:BookingStatus.cancelled
        }
      })
  

    }
  }

