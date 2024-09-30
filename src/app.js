const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const { validateSignupData, validateLoginData } = require('./utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt =require('jsonwebtoken');
const { userAuth } = require('./middlewares/auth');

const app = express();

app.use(express.json());
app.use(cookieParser());

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

        if (isPasswordValid) {
            const token = jwt.sign({_id: user._id}, 'dev@devmern', {expiresIn: '7d', });
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

app.get('/profile', userAuth, async (req, res) => {
    try {
        res.send(req.user);
    } catch (err) {
       res.status(400).send(`ERROR : ${err.message}`);
    }
})



connectDB()
    .then(() => {
        app.listen(3000, () => console.log('server is listening on 3000'));
        console.log("Database connection established...");
    })
    .catch((err) => console.error("Database connot be connected", err))
