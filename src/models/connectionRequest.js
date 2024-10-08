const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['ignored', 'intrested', 'accepted', 'rejected'],
            message: `{value} is incorrect status type`,
        }
    }
}, { timestamps: true })

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1});

connectionRequestSchema.pre('save', function (next) {
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error('Cannot send connection request to yourself');
    }
    next();
})

const ConnectionRequestModel = mongoose.model('ConnectionRequestModel', connectionRequestSchema);
module.exports = ConnectionRequestModel;