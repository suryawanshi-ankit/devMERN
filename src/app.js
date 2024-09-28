const express = require('express');
const connectDB = require('./config/database');
const User =require('./models/user');

const app = express();

app.use(express.json());

app.post('/signup', async (req, res) => {
    // creating new instance of the user model
    const userData = new User(req.body)

    try {
        await userData.save();
        res.send("User created successfully !!!");
    } catch(err) {
        res.status(400).send("Error saving the user: ", err.message)
    }

})


connectDB()
    .then(() => {
        app.listen(3000, () => console.log('server is listening on 30000'));
        console.log("Database connection established...");
    })
    .catch((err) => console.error("Database connot be connected", err))
