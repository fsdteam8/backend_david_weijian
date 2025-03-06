import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: `${process.env.NODEMAILER_EMAIL}`,
    pass: `${process.env.NODEMAILER_EMAIL_PASS}`,
  },
});

const sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: `${process.env.NODEMAILER_EMAIL}`,
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP is: ${otp}`,
  });
};

export {sendOTP}
