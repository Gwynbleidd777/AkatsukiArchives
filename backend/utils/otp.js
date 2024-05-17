const nodemailer = require("nodemailer");

const sendOTP = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.SECURE),
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });

        const mailOptions = {
            from: process.env.USER,
            to: email,
            subject: 'OTP Verification',
            text: `Your OTP for verification is: ${otp}`,
            html: `<p>Your OTP for verification is: <strong>${otp}</strong></p>`,
        };

        await transporter.sendMail(mailOptions);
        console.log("OTP sent to:", email);
    } catch (error) {
        console.error("Error sending OTP:", error);
        throw new Error("Failed to send OTP");
    }
};

module.exports = sendOTP;
