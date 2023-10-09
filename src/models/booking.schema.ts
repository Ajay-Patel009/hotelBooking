import { number } from 'joi';
import mongoose, { Schema, Document } from 'mongoose';

// Define the Booking interface
interface IBooking extends Document {
  userId: mongoose.Types.ObjectId; // Reference to the User
  hotelId: mongoose.Types.ObjectId; // Reference to the Hotel
  bookedOn: Date;
  check_in_date: string;
  check_out_date: string;
  status:number;
  }

export const enum BookingStatus{
    confirmed,
    cancelled,
    pending,
    completed,
    In_progress,
    deleted


}



// Define the Booking schema
export const BookingSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  bookedOn: { type: Date, default: Date.now },
  check_in_date: { type: String, required: true },
  check_out_date: { type: String, required: true },
  status:{type:Number,required:true}
});

// Create the Booking model
const Booking = mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
