
import { HTTP } from "../common/codeResponses";
import { HOTELMSG } from "../common/hotelResponses";
import Transaction from "../models/transaction";
import User from "../models/user";
import amqp from "amqplib";
import dotenv from 'dotenv';

dotenv.config()

const PlateformFee=Number(process.env.PLATEFORM_FEE);
const TAX=Number(process.env.TAX);

export class payment_service {
  static async onSuccessPayment(session: any) {
    const rabbitMQConnection = amqp.connect("amqp://localhost");
    const channel = (await rabbitMQConnection).createChannel();
    const user = await User.findById(session.metadata.userId);
    if (user) {
      const newBooking: any = {
        room_id: session.metadata.hotelId,
        check_in_date: session.metadata.check_in_date,
        check_out_date: session.metadata.check_out_date,
        bookedOn: new Date(),
      };
      user.booking.push(newBooking);
      await user.save();

      newBooking.email = user.email;
      const bookingIds = user.booking.map((booking) => booking._id);
      const bookingId = bookingIds[bookingIds.length - 1];
      const newTransation: any = {
        bookingId: bookingId,
        credit: session.amount_total,
        ownerId: session.metadata.ownerId,
        status: session.status,
        paymentIntent: session.payment_intent,
      };
      await Transaction.create(newTransation);
      const queueName = "booking-notifications";
      const message = JSON.stringify(newBooking);
      (await channel).assertQueue(queueName);
      (await channel).sendToQueue(queueName, Buffer.from(message));
      return { message: HOTELMSG.BOOKING_SUCCESS, code: HTTP.SUCCESS };
    }
  }


  static async adminViewTransaction(ownerId:string){
    if(ownerId){
    const transactions = await Transaction.find({ ownerId: ownerId });
    let totalCredit = 0;
    let totalDebit = 0;

    transactions.forEach((transaction) => {
      if (transaction.credit) {
        totalCredit += transaction.credit;
      }
      if (transaction.debit) {
        totalDebit += transaction.debit;
      }
    });

    const total = totalCredit - totalDebit;
    console.log(PlateformFee)
    const PlateformCharge=total*(PlateformFee/100);
    const tax=total*(TAX/100)
    const profit=total-PlateformCharge-tax;

    
    const transactionDetails = {
      transactions: transactions,
      totalCredit: totalCredit,
      totalDebit: totalDebit,
      total,
      PlateformCharge,
      tax,
      profit: profit,
    };

    return transactionDetails;
  }

  }


  static async adminViewAllTransactions(){
    const transactions=await Transaction.find();
    let totalCredit = 0;
    let totalDebit = 0;

    transactions.forEach((transaction) => {
      if (transaction.credit) {
        totalCredit += transaction.credit;
      }
      if (transaction.debit) {
        totalDebit += transaction.debit;
      }
    });

    const total = totalCredit - totalDebit;
    console.log(PlateformFee)
    const PlateformCharge=total*(PlateformFee/100);
    const tax=total*(TAX/100)
    const profit=total-PlateformCharge-tax;

    
    const transactionDetails = {
      transactions: transactions,
      totalCredit: totalCredit,
      totalDebit: totalDebit,
      total,
      PlateformCharge,
      tax,
      profit: profit,
    };

    return transactionDetails;
  }


  static async ownerViewTransaction(ownerId:string)
  {
    const transactions=await Transaction.find({ownerId:ownerId});
    let totalCredit = 0;
      let totalDebit = 0;
  
      transactions.forEach((transaction) => {
        if (transaction.credit) {
          totalCredit += transaction.credit;
        }
        if (transaction.debit) {
          totalDebit += transaction.debit;
        }
      });
  
      const total = totalCredit - totalDebit;
      console.log(PlateformFee)
      const PlateformCharge=total*(PlateformFee/100);
      const tax=total*(TAX/100)
      const profit=total-PlateformCharge-tax;
  
      
      const transactionDetails = {
        transactions: transactions,
        totalCredit: totalCredit,
        totalDebit: totalDebit,
        total,
        PlateformCharge,
        tax,
        profit: profit,
      };
  
      return {transactionDetails};
  }
}
