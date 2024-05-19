const nodemailer = require('nodemailer'); // Make sure to import nodemailer  
require("dotenv").config();
const UserDetail = require('../model/userModel');

const sendUserEmail = async (req, res) => {

    let transporter = nodemailer.createTransport({
        service: "gmail",
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: process.env.ADMIN_MAIL,
            pass: process.env.ADMIN_PASSWORD,
        }
    });;
    const parentuser = await UserDetail.find();

    for (const user of parentuser) {
        if (user.pushemail == true) {
            let mailOptions = await transporter.sendMail({
                from: {
                    name: "Uday",
                    address: process.env.ADMIN_MAIL
                }, // sender address
                to: user.email, // list of receivers
                subject: "Welcome, to mathongo", // Subject line
                text: `Hello, ${user.name}`,     // plain text body
                html: `Thankyou for signing up with your email ${user.email}. We have received your city as ${user.city}<br> Team Mathongo <a href="https://mathongoproject.vercel.app/unsubscribe/${user._id}">Unsubscribe</a>`, // html body
            });
        }
    }
    res.send("All email sent successfully");
}
module.exports = {
    sendUserEmail
}