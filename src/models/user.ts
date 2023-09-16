import mongoose, { Document, ObjectId, Schema } from 'mongoose';
import { ENUMS } from '../common/common';
import { string } from 'joi';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    phone:Number;
    userType:number;
    isVerified:boolean
    booking:{
        _id: any;
        room_id:ObjectId,
        bookedOn:Date,
        check_in_date:string,
        check_out_date:string,
        
    }[];
    createdAt: Date;
  }

export const UserSchema = new mongoose.Schema({
    name:{type:String,require:true},
    email:{type:String,require:true},
    password:{type:String},
    phone:{type:Number},
    userType:{type: Schema.Types.Number,enum: Object.values(ENUMS.USER_TYPE)},
    isVerified:{type:Boolean},
    booking:[{
        room_id:{type: mongoose.Schema.Types.ObjectId, ref: 'Hotel',require: true,},
        bookedOn:{type: Date,default: Date.now},
        check_in_date:{ type:String,require:true},
        check_out_date:{ type:String,require:true}
    }],
    
    createdAt: { type: Date, default: Date.now }
})
const User = mongoose.model<IUser>('users',UserSchema);
export default User


