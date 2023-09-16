import Hapi, {Request, ResponseToolkit } from '@hapi/hapi';
import dotenv from "dotenv";
import { USERMSG } from '../common/userResponse';
import { user_service } from '../services/user.service';
import exp from 'constants';
import User, { UserSchema } from '../models/user';
import { HTTP } from '../common/codeResponses';
import Transaction, { ITransaction } from '../models/transaction';
import mongoose from 'mongoose';



dotenv.config();
const PORT = process.env.PORT;
const TAX=process.env.TAX;
const PlateformFee=process.env.PLATEFORM_FEE;


export async function getUser(request:Request,h:ResponseToolkit) {
    try{
    const uid=request.headers.userId
    const user=await user_service.getUser(uid.userId)
    if(user)
    {
        return h.response({Details: user}).code(200);
    }
    else{
        return h.response({Message:USERMSG.USER_NOT_EXIST})
    }
 }
 catch(err)
 {
    console.log(err);
}
}

 export async function deleteProfile(request:Hapi.Request, h:Hapi.ResponseToolkit) {
    try{

    const uid=request.headers.userId
    const deleted=await user_service.deleteUser(uid.userId)
    if(deleted)
    {
        return h.response({Message:USERMSG.USER_DELETE});
    }
    else{
        return h.response({Message:USERMSG.ERROR})
    }
}
catch(err)
{
    console.log(err);
}
}

export async function updateProfile(request:Hapi.Request, h:Hapi.ResponseToolkit) {
    try{
    const uid=request.headers.userId
    const requestBody=<any>request.payload

    const [updated_data,status]=await user_service.updateUser(uid.userId,requestBody)
   
    if(updated_data)
    {
        return h.response({
            Message: USERMSG.USER_UPDATED,
            data:updated_data,
            status:status
    });
    }
    else{
        return h.response({Message:USERMSG.USER_UPDATE_FAILED});
    }
    }
    catch(err)
    {
        console.log(err);
    }
}



 export async function changePassword(request:Hapi.Request, h:Hapi.ResponseToolkit) {
    try{
        const uid=request.headers.userId;
        const {currentPassword,newPassword,confirmPassword}=<any>request.payload;
        const newchange=await user_service.updatePassword(uid.userId, currentPassword,newPassword,confirmPassword);
        return h.response(newchange).code(201);
    }
    catch(err)
    {
        return h.response({err})
    }
 }



export async function contactOwner(request:Hapi.Request, h:Hapi.ResponseToolkit) {

    try {
        // const userId=request.auth.credentials.userId;
        const uid=request.headers.userId
        const hotel_id=request.query.hotel_id;
        const contact=await user_service.ownerContact(hotel_id,uid.userId);
        return h.response(contact);

        }
        catch(err)
        {
            console.log(err)
            return h.response({err:USERMSG.ERROR}).code(HTTP.ERROR)
        }
    }




    // export async  function viewtransaction(request: Hapi.Request, h: Hapi.ResponseToolkit){
    //     try {
    //     //   const { userId } = request.query;
    //     const uid=request.headers.userId
    //     const userId=uid.userId
    
    //       // Use MongoDB aggregation to calculate debited and credited amounts
    //       const userTransactions: any[] = await Transaction.aggregate([
    //         {
    //           $match: {
    //             $or: [
    //               { debit: new mongoose.Types.ObjectId(userId) }, // User as sender
    //               { credit: new mongoose.Types.ObjectId(userId) }, // User as receiver
    //             ],
    //           },
    //         },
    //         {
    //           $project: {
    //             _id: 0,
    //             amount: {
    //               $cond: {
    //                 if: { $eq: ['$debit', new mongoose.Types.ObjectId(userId)] },
    //                 then: '$amount', // Debit if the user is the sender
    //                 else: { $multiply: ['$amount', -1] }, // Credit if the user is the receiver
    //               },
    //             },
    //           },
    //         },
    //         {
    //           $group: {
    //             _id: null,
    //             totalDebit: { $sum: { $cond: { if: { $gt: ['$amount', 0] }, then: '$amount', else: 0 } } },
    //             totalCredit: { $sum: { $cond: { if: { $lt: ['$amount', 0] }, then: '$amount', else: 0 } } },
    //           },
    //         },
    //         {
    //           $project: {
    //             _id: 0,
    //             userId,
    //             totalDebit: 1,
    //             totalCredit: 1,
    //           },
    //         },
    //       ]);
    //       const transactionHistory: ITransaction[] = await Transaction.find({
    //         $or: [
    //           { debit: new mongoose.Types.ObjectId(userId) }, // User as sender
    //           { credit: new mongoose.Types.ObjectId(userId) }, // User as receiver
    //         ],
    //       });
    
    //       if (userTransactions.length === 0) {
    //         return h.response({ message: 'No transactions found for the user' }).code(404);
    //       }
    
    //     //   return h.response(userTransactions[0]).code(200);
    //     const profit=userTransactions[0].totalCredit-(-userTransactions[0].totalDebit);
    //     const pateformFee=profit*0.2;
    //     const netProfit=profit-pateformFee
        
    //     return h.response({ transactions: transactionHistory, totals: userTransactions[0],Profit:-profit, PlateformFee:pateformFee,Net_Profit:-netProfit}).code(200);
    //     } catch (error) {
    //       console.error('Error fetching user transactions:', error);
    //       return h.response({ message: 'Internal server error' }).code(500);
    //     }
    //   }




  //   export async  function viewtransaction(request: Hapi.Request, h: Hapi.ResponseToolkit){
  //     try {
  //     //   const { userId } = request.query;
  //     const uid=request.headers.userId
  //       const userId=uid.userId
    
  
  //       const userTransactionsAggregate = await Transaction.aggregate([
  //         {
  //           $match: {
  //             $or: [
  //               { debit: new mongoose.Types.ObjectId(userId) }, // User as sender
  //               { credit: new mongoose.Types.ObjectId(userId) }, // User as receiver
  //             ],
  //           },
  //         },
  //         {
  //           $project: {
  //             _id: 0,
  //             amount: {
  //               $cond: {
  //                 if: { $eq: ['$debit', new mongoose.Types.ObjectId(userId)] },
  //                 then: '$amount', // Debit if the user is the sender
  //                 else: { $multiply: ['$amount', -1] }, // Credit if the user is the receiver
  //               },
  //             },
  //           },
  //         },
  //         {
  //           $group: {
  //             _id: null,
  //             totalDebit: { $sum: { $cond: { if: { $gt: ['$amount', 0] }, then: '$amount', else: 0 } } },
  //             totalCredit: { $sum: { $cond: { if: { $lt: ['$amount', 0] }, then: '$amount', else: 0 } } },
  //           },
  //         },
  //         // {
  //         //   $project: {
  //         //     _id: 0,
  //         //     userId,
  //         //     totalDebit: 1,
  //         //     totalCredit: 1,
  //         //   },
  //         // },
  //       ]);
    
  //       // Step 2: Retrieve the user's transaction history
  //       const transactions = await Transaction.find({
  //         $or: [
  //           { debit: new mongoose.Types.ObjectId(userId) }, // User as sender
  //           { credit: new mongoose.Types.ObjectId(userId) }, // User as receiver
  //         ],
  //       });
    
  //       // Step 3: Create an object containing the transaction history and totals
  //       const transactionHistory = transactions.map((transaction) => {
  //         const isDebited = transaction.debit.toString() === userId;
  //         const isCredited = transaction.credit.toString() === userId;
    
  //         return {
  //           _id: transaction._id,
  //           bookingId:transaction.bookingId,
  //           date: transaction.createdAt,
  //           debited: isDebited ? -transaction.amount : 0,
  //           credited: isCredited ? transaction.amount : 0,
  //         };
  //       });
    
  //       // Step 4: Create an object containing the transaction history and totals
  //       let total_debit=userTransactionsAggregate[0]?.totalDebit || 0;
  //       let total_credit=userTransactionsAggregate[0]?.totalCredit || 0;
  //       let amount=total_credit-total_debit;
  //       let PlateformFee=amount*(5/100);//plateform fee
  //       let profit=amount-PlateformFee;
  //       let tax=profit*15/100;
  //       let totalEarnings=profit-tax;


  //       const responseObj = {
  //         user: userId,
  //         totalDebit: userTransactionsAggregate[0]?.totalDebit || 0,
  //         totalCredit: -userTransactionsAggregate[0]?.totalCredit || 0,
  //         total:amount,
  //         PlateformCharge:PlateformFee,
  //         tax:tax,
  //         profit:totalEarnings,
  //         transactionHistory,
  //       };
    
  //       // Step 5: Send the response
  //       return h.response(responseObj);
  //     }
  //   catch(err)
  //   {
  //     console.log(err)
  //   }
  // }


   
    
    
