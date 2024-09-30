const jwt =require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) throw new Error('Invalid token');

        const decodeObj = await jwt.verify(token, 'dev@devmern');
        const { _id } = decodeObj;
        const user = await User.findById(_id);

        if(!user) throw new Error('User not exist');
        req.user = user;
        next();
    } catch (err) {
        res.status(400).send(`ERROR: ${err.message}`);
    }
}

module.exports = {
    userAuth
}