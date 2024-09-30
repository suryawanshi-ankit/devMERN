const express = require('express');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);

connectDB()
    .then(() => {
        app.listen(3000, () => console.log('server is listening on 3000'));
        console.log("Database connection established...");
    })
    .catch((err) => console.error("Database connot be connected", err))
