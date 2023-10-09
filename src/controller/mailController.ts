import nodemailer from "nodemailer";
import dotenv from "dotenv"
dotenv.config();
const email = process.env.EMAIL;
const pass = process.env.PASSWORD;

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: email,
    pass: pass,
  },
});
export async function sendGmail(email: string,subject: string,data: any,emailTemplate?: any) {
  const bookingMailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: subject,
    html: emailTemplate(data),
  };
  transporter.sendMail(bookingMailOptions, (error, info) => {
    if (error) { 
      console.log(error);

    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

export async function sendRecipient(email: string, filepath: any) {
  try {
   
    const info = await transporter.sendMail({
      to: email,
      subject: "Your booking has been accepted",
      text: `Dear User, Your booking has been approved. Kindly refer to the attached pdf for complete details.`,
      attachments: [
        {
          filename: "booking_details.pdf",
          path: filepath,
        },
      ],
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export async function sendOffersMail(email: string,subject: string,data: string) {
  const bookingMailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: subject,
    text: data,
    // html:emailTemplate(data)
  };
  transporter.sendMail(bookingMailOptions, (error, info) => {
    if (error) {
      console.log(error);
      //   return h.response({ message: 'Error sending email' }).code(500);
    } else {
      console.log("Email sent: " + info.response);
      //   return h.response({ message:USERMSG.OTP_SEND}).code(200);
    }
  });
}
