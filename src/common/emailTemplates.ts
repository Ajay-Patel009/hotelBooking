


export const OTPTemplate=(otp:number) => `

<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f6f6f6;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .header {
        border-radius : 10px;
        background-color: #3498db;
        color: white;
        padding: 10px;
        text-align: center;
      }
      .content {
        background-color: white;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .otp-box {
        background-color: #f2f2f2;
        padding: 10px;
        border-radius: 5px;
        font-size: 18px;
        text-align: center;
        margin-bottom: 15px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Password Reset Request</h1>
      </div>
      <div class="content">
        <p>Hello there,</p>
        <p>You are receiving this email because you (or someone else) has requested a password reset for your account.</p><br>
        <p>This OTP will expire in 30 seconds<p>
        <div class="otp-box">
          Your Reset Password OTP: <strong>${otp}</strong>
        </div>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      </div>
    </div>
  </body>
</html>
`;


export const ownerDetailTemplate = (data:any) => `
<html>
  <!-- Rest of your HTML template -->
  <div class="otp-box">
    Owner Details: <strong>Contact On</strong>
    <p>Name : ${data.name}<p>
    <p>Email : ${data.email}<p>
    <p>Contact : ${data.phone}<p>
   
  </div>
  <!-- Rest of your HTML template -->
</html>
`;



export const hotelBookingTemplate = (data:any) => `
<html>
  <!-- Rest of your HTML template -->
  <div class="otp-box">
     <strong>Booking Details:</strong>
    <p>Booking ID : ${data._id}<p>
    <p>Booking Date : ${data.bookedOn}<p>
    <p>Check In Date : ${data.check_in_date}<p>
    <p>Check Out Date : ${data.check_out_date}<p>
    <p>Contact : ${data.bookedOn}<p>
   
  </div>
  <!-- Rest of your HTML template -->
</html>
`;

