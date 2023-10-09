import mongoose, { ObjectId ,Document} from "mongoose";
import { IHotel } from "./hotel.scema";
import { IUser } from "./user";


export interface IReview extends Document {
    hotel_id:IHotel['_id'];
    reviews:{
        _id: any;
        user_id:IUser['_id'],
        rating:number,
        text:string
    }[]
   
}



const reviewSchema = new mongoose.Schema({
    hotel_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel',require:true},
    reviews:[{
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' ,require:true},
        rating: { type: Number, min: 1, max: 5 , require:true},
        text: {type:String, require:true}
    }], 
   });
  const Review = mongoose.model<IReview>('reviews',reviewSchema);
  export default Review;




//   export interface IReview extends Document {
//     hotel_id: IHotel['_id'];
//     user_id: IUser['_id'];
//     rating: number;
//     text: string;
// }

// const reviewSchema = new mongoose.Schema({
//     hotel_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
//     user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     rating: { type: Number, min: 1, max: 5, required: true },
//     text: { type: String, required: true }
// });

// const Review = mongoose.model<IReview>('Review', reviewSchema);
// export default Review;