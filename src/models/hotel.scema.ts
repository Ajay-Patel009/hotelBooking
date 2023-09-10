import mongoose, { Document, ObjectId, Schema } from 'mongoose';
import { ENUMS} from '../common/common';
import { IUser } from './user';



export interface IHotel extends Document {
    name:string
    title: string;
    type:number;
    description: string;
    price: number;
    amenities:{
     swimming_pool:boolean,
      wifi:boolean,
      gatedSecurity:boolean,
      bathRooms:number,
      parking:boolean,
      spa:boolean

    },
    reviews:{
      total_reviews:number,
      ratings:number,
    },
    address:{
      city:string,
      area:string,
      country:string
      pincode:number
    },
      // location: {
      //   type: {
      //       type: string;
      //       enum: ['Point']
      //       required: false;
      //   };
      //   coordinates: [number, number]; // [longitude, latitude]
      // }
   // },
    images:[string];
    createdAt: Date;
    contactInfo:{
        name:string,
        phone:number, 
        email:string
    },
    createdBy:IUser['_id'];
};





export const hotelSchema = new mongoose.Schema({

    name:{type:String, require: true},
    title: {type: String,required: true},
    description: {type: String,required: true},
    type:{ type: Schema.Types.Number,enum: Object.values(ENUMS.HOTEL_TYPE),},
    price: {type: Number,required: true},
    amenities: {
      swimmingPool:{type:Boolean},
      wifi:{type:Boolean},
      parking:{type:Boolean},
      spa:{type:Boolean}
    },
    address:{
      area:{type:String,required:true},
      city:{type:String,required:true},
      country:{type:String,required:true},
      pincode:{type:Number,required:true}
    },
    reviews:{
      total_reviews:{type:Number},
      ratings:{type:Number}
    },
    // address:{type:GeoAddress},
    contactInfo: {
      name: {type: String},
      phone: {type: String},
      email: {type: String},

    },

  images:[{ type:String}],
 
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  // hotelSchema.index({ 'address.location': '2dsphere' });
  
  const Hotel = mongoose.model<IHotel>('hotels', hotelSchema);
  export default Hotel;
  