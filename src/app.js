const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const validator = require('validator');
const cors = require('cors');
const app = express();
const { userAuth } = require('./middleware/auth');
require('dotenv').config();

// Apply CORS middleware first
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'], // Explicitly allow methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow specific headers
}));

app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

connectDB()
    .then(() => {
        console.log('DB connected');
        app.listen(7777, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch((err) => {
        console.error('DB not connected:', err);
    });