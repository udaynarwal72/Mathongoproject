const nodemailer = require('nodemailer'); // Make sure to import nodemailer  
require("dotenv").config();
const path = require('path');
const UserDetail = require('../model/userModel');
const mongoose = require('mongoose');

const sendUserEmail = async (req, res) => {

    let transporter = nodemailer.createTransport({
        service: "gmail",
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: "udaynarwal8860@gmail.com",
            pass: "rtkh parq rvhg sdwo",
        }
    });;
    // printing user name from UserDetail model
    const parentuser = await UserDetail.find();
    // for(user in parentuser){
    //     console.log(user[0].email);
    // }

    // for (const user of parentuser) {
    //     console.log(user.email);
    // }
    console.log(parentuser[0].city);
    const user = parentuser[0];
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
                html: `<span> Hey ${user.name}!</span> <br> Thankyou for signing up with your email ${user.email}. We have received your city as ${user.city}<br> Team Mathongo <a href="http://localhost:4000/unsubscribe/${user._id}">Unsubscribe</a>`, // html body
            });
        }
    }
    res.send("All email sent successfully");
}
module.exports = {
    sendUserEmail
}