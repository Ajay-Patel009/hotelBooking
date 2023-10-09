import mongoose, { Document, ObjectId, Schema } from 'mongoose';
import { ENUMS } from '../common/common';



export enum Userstatus {
    inactive,
    active,
    blocked,
    deleted,
  }
export enum UserRole{
  owner,
  customer
}

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    phone:Number;
    userType:number;
    isVerified:boolean;
    status:number;
    createdAt: Date;
  }

export const UserSchema = new mongoose.Schema({
    name:{type:String,require:true},
    email:{type:String,require:true},
    password:{type:String},
    phone:{type:Number},
    userType:{type: Schema.Types.Number,enum: Object.values(ENUMS.USER_TYPE)},
    status:{type:Number},
    isVerified:{type:Boolean},
    createdAt: { type: Date, default: Date.now }
})
const User = mongoose.model<IUser>('users',UserSchema);
export default User


