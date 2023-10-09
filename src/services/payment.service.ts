
import Booking, { BookingStatus } from "../models/booking.schema";
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
    console.log("userrrrrrrrrrrrrrrrrrrrr",user);
    console.log(session.status)
    if(session.status=='unpaid') return false;
    if (user) {
      const newBooking =await Booking.create({
        userId:session.metadata.userId,
        hotelId: session.metadata.hotelId,
        check_in_date: session.metadata.check_in_date,
        check_out_date: session.metadata.check_out_date,
        status:BookingStatus.confirmed,
        bookedOn: new Date(),
      }).then(async (newBooking) => {
        // `newBooking` here contains the newly created booking document
        const newBookingId = newBooking._id;
        const queData:any={
          bookingId:newBookingId,
          email:user.email,
          hotelId: session.metadata.hotelId,
          check_in_date: session.metadata.check_in_date,
          check_out_date: session.metadata.check_out_date,
          bookedOn: new Date(),
        }
        console.log("que data created")
        const newTransation: any = {
          bookingId: newBookingId,
          credit: session.amount_total,
          ownerId: session.metadata.ownerId,
          status: session.status,
          paymentIntent: session.payment_intent,
        };
        console.log("tranaction created")
        await Transaction.create(newTransation);
        const queueName = "booking-notifications";
        const message = JSON.stringify(queData);
        (await channel).assertQueue(queueName);
        (await channel).sendToQueue(queueName, Buffer.from(message));
        return true;
      })
      .catch((error) => {
        console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj",error);
      });
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

