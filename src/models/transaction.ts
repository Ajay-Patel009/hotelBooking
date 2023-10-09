import mongoose, { ObjectId ,Document} from "mongoose";


export interface ITransaction extends Document {

    credit:number;
    debit:number;
    bookingId:ObjectId;
    createdAt:Date;
    status:string;
    paymentIntent:string;
    ownerId:ObjectId;

}

const transactionSchema = new mongoose.Schema({
    ownerId:{ type: mongoose.Schema.Types.ObjectId, ref: 'User',require:true},
    debit:{type:Number},
    bookingId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking',require:true},
    credit:{type:Number,require:true},
    status:{type:String},
    paymentIntent:{type:String,require:true},
    createdAt:{type:Date,default:Date.now()}
})
const Transaction = mongoose.model<ITransaction>('transactions',transactionSchema);
export default Transaction;
