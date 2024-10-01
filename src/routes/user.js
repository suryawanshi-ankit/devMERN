const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');

const userRouter = express.Router();

userRouter.get('/user/request/received', userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user;
        const requestList = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'intrested'
        }).populate('fromUserId', 'firstName lastName photoUrl age gender skills');

        res.json({message: 'People intreseted in you', data: requestList});
    } catch (err) {
        res.status(400).send(`ERRROR : ${err.message}`);
    }
});

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionsData = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: 'accepted'},
                {toUserId: loggedInUser._id, status: 'accepted'}
            ]
        }).populate('fromUserId', 'firstName lastName photoUrl age gender skills')
        .populate('toUserId', 'firstName lastName photoUrl age gender skills');

        const data = connectionsData.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId
        });
        res.json({ data })
    } catch (err) {
        res.status(400).send(`ERRROR : ${err.message}`);
    }
});

module.exports = userRouter;

