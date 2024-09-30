const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const { validateSignupData, validateLoginData } = require('./utils/validation');
const bcrypt = require('bcrypt');

const app = express();

app.use(express.json());

app.post('/signup', async (req, res) => {
    // creating new instance of the user model
    try {
        // validating signup data
        validateSignupData(req);

        // encrypt the password
        const { password } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        
        const userData = new User({
            ...req.body,
            password: hashPassword,
        });
        await userData.save();
        res.send("User created successfully !!!");
    } catch (err) {
        res.status(400).send(`ERROR: ${err.message}`)
    }
})

app.get('/login', async (req, res) => {
    try {
        // validating login data
        validateLoginData(req);

        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId});
        if (!user) throw new Error("Invalid credentials !!!");

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) res.send('Login successful!!!');
        else throw new Error('Invalid credentials !!!');

    } catch (err) {
        res.status(400).send(`ERROR: ${err.message}`)
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

app.patch('/user/:userId', async (req, res) => {
    // creating new instance of the user model
    const userId = req.params?.userId;
    const userData = req.body
    try {
        const ALLOWED_UPDATES = ['photoUrl', 'about', 'gender', 'age', 'skills'];

        const isUpdateAllowed = Object.keys(userData).every(k => ALLOWED_UPDATES.includes(k));

        if (!isUpdateAllowed) throw new Error("Update not allowed");
        if (userData?.skills?.length > 10) throw new Error("Allowed skills is 10");


        const user = await User.findByIdAndUpdate(userId, userData, {
            returnDocument: "after",
            runValidators: true,
        });
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
