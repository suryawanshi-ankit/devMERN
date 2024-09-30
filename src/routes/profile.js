const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { validateEditProfile } = require('../utils/validation');
const validator = require('validator');
const bcrypt = require('bcrypt');

const profileRouter = express.Router();

profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try {
        res.send(req.user);
    } catch (err) {
       res.status(400).send(`ERROR : ${err.message}`);
    }
})

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        if (!validateEditProfile(req)) throw new Error("Invalid edit request");
        
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => loggedInUser[key]= req.body[key]);
        await loggedInUser.save();
        res.send(`${loggedInUser.firstName}, your profile updated successfuly`);
        
    } catch (err) {
        res.status(400).send(`ERROR : ${err.message}`);
   
    }
})

profileRouter.patch('/profile/forgotpassword', userAuth, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const isOldPasswordValid = await req.user.validatePassword(oldPassword);
        if (!isOldPasswordValid) throw new Error('Old password is not valid !!!');

        const isNewPasswordStrong = validator.isStrongPassword(newPassword);
        if (!isNewPasswordStrong) throw new Error('New password is not strong !!!');

        const hashPassword = await bcrypt.hash(newPassword, 10);
        let loggedInUser = req.user;
        loggedInUser.password = hashPassword;

        await loggedInUser.save();

        res.send(`${loggedInUser.firstName}, your Password update is successfull`);


        // const { newPassword, oldPassword } = req.body;
    } catch (err) {
        res.status(400).send(`ERROR: ${err.message}`);
    }
})

module.exports = profileRouter;