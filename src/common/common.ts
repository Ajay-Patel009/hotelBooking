import mongoose, { Document, ObjectId, Schema } from 'mongoose';
import Transaction from '../models/transaction';


 

// interface IGeoAddress extends Document 
//    {
//     city:string,
//     area:string,
//     location: {
//       type: {
//           type: string;
//           enum: ['Point'];
//           required: true;
//       };
//       coordinates: [number, number]; // [longitude, latitude]
//     }
  
// }




export const GeoAddress = new Schema(
     {
       city:{type:String},
       area:{type:String},
    //    country:{type:String},
      location: {
        type: {
            type: String,
            index:'2dsphere',
            enum: ['Point'],
            required: false,
        },
        coordinates: {
            type: [Number,Number],
            required: true,
        },
    }
}).index({ 'address.location': '2dsphere' })

export const ENUMS={



    HOTEL_TYPE:{
        ONE_STAR_HOTEL:1,
        TWO_STAR_HOTEL:2,
        THREE_STAR_HOTEL:3,
        FOUR_STAR_HOTEL:4,
        FIVE_START_HOTEL:5
    },

    USER_TYPE:{
        BUYER:1,
        OWNER:2
    },

    TRANSACTION_STATUS:{
        PENDING:1,
        COMPLETED:2
    }


}


