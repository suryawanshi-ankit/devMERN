const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');

const app = express();

app.use(express.json());

app.post('/signup', async (req, res) => {
    // creating new instance of the user model
    const userData = new User(req.body);
    try {
        await userData.save();
        res.send("User created successfully !!!");
    } catch (err) {
        res.status(400).send(`Error saving the user: ${err.message}`)
    }

})

app.get('/user', async (req, res) => {
    const firstName = req.body.firstName;
    try {
        const users = await User.find({firstName: firstName});
        if (users?.length === 0) {
            res.status(404).send('User not found');
        } else {
            res.send(users);
        }
    } catch (err) {
        res.status(400).send("Error saving the user: ", err.message)
    }

})

app.get('/feed', async (req, res) => {
    try {
        const data = await User.find({});
        res.send(data);
    } catch (err) {
        res.status(400).send(`Error saving the user: ${err.message}`);
    }

})

app.delete('/user', async (req, res) => {
    const userId = req.body._id;
    try {
        await User.findByIdAndDelete(userId);
        res.send('User deleted successfully !!!');
    } catch (err) {
        res.status(400).send("Error saving the user: ", err.message)
    }

})

app.patch('/user', async (req, res) => {
    // creating new instance of the user model
    const userId = req.body._id;
    const userData = req.body
    console.log(userId, userData)
    try {
        const user = await User.findByIdAndUpdate(userId, userData);
        console.log('user', user);
        res.send("User updated successfully !!!");
    } catch (err) {
        res.status(400).send(`Error Updating the user: ${err.message}`);
    }

})


connectDB()
    .then(() => {
        app.listen(3000, () => console.log('server is listening on 30000'));
        console.log("Database connection established...");
    })
    .catch((err) => console.error("Database connot be connected", err))
