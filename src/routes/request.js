const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const requestRouter = express.Router();

requestRouter.post('/request/send/:status/:userId', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.userId;
        const status = req.params.status;

        const acceptedStatus = ['ignored', 'intrested'];

        if (!acceptedStatus.includes(status)) throw new Error(`Status ${status} is not valid !!!`);

        const toUser = await User.findById(toUserId);

        if (!toUser) {
            return res.status(404).json({message: 'User not found!!!'})
        }
        const isRequestExists = await ConnectionRequest.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        })

        if (isRequestExists) throw new Error(`Request already exists`);

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });
        const data = await connectionRequest.save();
        res.json({message: `${status} request is sended`, data})
    } catch (err) {
        res.status(400).send(`ERROR: ${err.message}`);
    }
})

requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const {status, requestId} = req.params;

        const acceptedStatus = ['accepted', 'rejected'];

        if (!acceptedStatus.includes(status)) throw new Error(`Status ${status} is not valid !!!`);
        const connectionRequest = await ConnectionRequest.findById({
            _id: requestId,
            toUserId: loggedInUser,
            status: 'interested',
        });
        if (!connectionRequest) throw new Error(`connection request is not found !!!`);

        connectionRequest.status = status;

        const data = await connectionRequest.save();
        res.json({message: `Connection request ${status}`, data});

    } catch (err) {
        res.status(400).send(`ERROR: ${err.message}`);
    }
})

module.exports = requestRouter;