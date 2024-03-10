const express = require('express');
const app = express();
const routes = require('./routes/userRoutes');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');
const rateLimit = require('express-rate-limit');
const dbConnect = require('./config/dataBase');

// Taking Global Variables from .env file into process object
require('dotenv').config();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(fileupload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));
// Mounting Routes
app.use('/api/v1', routes);


// Default Route
app.get('/', (req, res) => {
    res.send('<h1>This is Home Page</h1>');
    console.log('This is home page');
});



// Rate Limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 10, // Max 10 requests
    message: 'Too many requests from this IP, please try again later'
});

app.use(limiter);


// Starting Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`);
});

// Connecting with database
dbConnect();
