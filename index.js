const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose'); // Make sure to import mongoose
const cors = require('cors');
// Express app
const app = express();

// Middleware or routes should be set before connecting to the database
const userRoute = require('./routes/userRoutes');
app.use('/', userRoute);
app.use(express.json());

// connecting vercel
// app.use(cors({
//     origin: ["https://mathongoproject-az32.vercel.app"],
//     methods: ['GET', 'POST'],
//     credentials: true

// }));

// Connecting to the database
mongoose.connect(process.env.MONG_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // Ensure you use these options for mongoose
    .then((result) => {
        // We listen for requests after we connect to the database
        app.listen(process.env.PORT, () => {
            console.log('Server started on port', process.env.PORT);
        });
    })
    .catch((err) => console.log(err));
