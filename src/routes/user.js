const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const userRouter = express.Router();

const USER_SAFE_DATA = 'firstName lastName photoUrl age gender skills';

userRouter.get('/user/request/received', userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user;
        const requestList = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'intrested'
        }).populate('fromUserId', USER_SAFE_DATA);

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
        }).populate('fromUserId', USER_SAFE_DATA)
        .populate('toUserId', USER_SAFE_DATA);

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

userRouter.get('/feed', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skip = (page-1) * limit;
        
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select('fromUserId toUserId');

        const hideUserFromFeed = new Set();
        connectionRequest.forEach((request) => {
            hideUserFromFeed.add(request.fromUserId).toString();
            hideUserFromFeed.add(request.toUserId).toString();
        })

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUserFromFeed)}},
                { _id: { $ne: loggedInUser._id}}
            ] 
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.json({ users })
    } catch (err) {
        res.status(400).send(`ERRROR : ${err.message}`);
    }
});

module.exports = userRouter;

