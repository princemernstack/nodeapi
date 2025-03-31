const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendOtp(email, otp) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for password reset verification',
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #F8F1E3; padding: 20px; text-align: center;">
          <h1 style="font-family: 'Georgia', serif; color: #2D2926;">Password Reset</h1>
          <p style="font-size: 16px; color: #2D2926;">Let's get you back on track!</p>
          <p style="font-size: 14px; color: #2D2926;">We use this one-time verification code to help you reset your password. You don’t need to remember it for later.</p>
          <h2 style="font-size: 24px; color: #2D2926;">Your OTP for password reset is:</h2>
          <h3 style="font-size: 32px; font-weight: bold; background-color: #FFFFFF; color: #000000; padding: 10px 20px; display: inline-block;">${otp}</h3>
          <p style="font-size: 12px; color: #2D2926; margin-top: 20px;">Please note this code is only valid for 15 minutes.</p>
          <p style="font-size: 14px; color: #2D2926; margin-top: 20px;">If you did not request a password reset, please ignore this email.</p>
          <p style="font-size: 14px; color: #2D2926; margin-top: 20px;">Have questions or trouble resetting your password?</p>
          <p style="font-size: 14px; color: #2D2926;">Just reply to this email or contact <a href="mailto:support@yourservice.com" style="color: #0073e6;">support@yourservice.com</a></p>
          <p style="font-size: 14px; color: #2D2926; margin-top: 40px;">All the Best,</p>
          <p style="font-size: 14px; color: #2D2926;">The Support Team</p>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}


module.exports = { sendOtp };
