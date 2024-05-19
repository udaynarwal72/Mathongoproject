// models/userModel.js
const mongoose = require('mongoose');
// Create a schema for the user
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // Use a Map to handle dynamic custom properties
    city: { type: String, required: true },
    pushemail: { type: Boolean, default: true },
});
//very very important if a user got a unique email then only we will push that
const UserDetail = mongoose.model('myUserDetails', userSchema);
module.exports = UserDetail;