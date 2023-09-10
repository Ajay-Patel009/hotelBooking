
import { Schema } from "mongoose";
import mongoose, { ObjectId ,Document} from "mongoose";
import { ENUMS } from "../common/common";

export interface ITransaction extends Document {

    credit:ObjectId;
    debit:ObjectId;
    bookingId:ObjectId;
    amount:number;
    status:number
}

const transactionSchema = new mongoose.Schema({
    credit:{ type: mongoose.Schema.Types.ObjectId, ref: 'User',require:true},
    debit:{ type: mongoose.Schema.Types.ObjectId, ref: 'User',require:true},
    bookingId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking',require:true},
    amount:{type:Number,require:true},
    status:{type: Schema.Types.Number,enum: Object.values(ENUMS.TRANSACTION_STATUS),}
})
const Transaction = mongoose.model<ITransaction>('transactions',transactionSchema);
export default Transaction;
