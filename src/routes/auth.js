const express = require('express');
const bcrypt = require('bcrypt');
const { validateSignupData, validateLoginData } = require('../utils/validation');
const User = require('../models/user');

const authRouter = express.Router();


authRouter.post('/signup', async (req, res) => {
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

authRouter.get('/login', async (req, res) => {
    try {
        // validating login data
        validateLoginData(req);

        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId});
        if (!user) throw new Error("Invalid credentials !!!");

        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {
            const token = await user.getJWT();
            res.cookie('token', token, {
                expires: new Date(Date.now() + 8 * 3600000)
            });
            res.send('Login successful!!!');
        }
        else throw new Error('Invalid credentials !!!');

    } catch (err) {
        res.status(400).send(`ERROR: ${err.message}`)
    }
})

authRouter.post('/logout', async(req, res) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
    });
    res.send("Logout successful");
})

module.exports = authRouter;