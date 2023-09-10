import mongoose, { Document, Schema } from 'mongoose';

interface IAdmin extends Document {
    name: string;
    email: string;
    password: string;
    // phone:Number;
    
    createdAt: Date;
  }

const AdminSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    // phone:{
    //     type:Number,
    //     require:true
    // },
    createdAt: { type: Date, default: Date.now }
})
const Admin = mongoose.model<IAdmin>('Admin',AdminSchema);
export default Admin