const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = (email, otp) => { 
    console.log(`OTP for ${email}: ${otp}`);
};

export {
    generateOTP,
    sendOTP,
}