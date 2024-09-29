const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value))
                throw new Error("invalid Email address " + value);
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value))
                throw new Error("Try with strong password " + value);
        }
    },
    age: {
        type: String,
        min: 18,
    },
    gender: {
        type: String,
        validate(value) {
            if (!['male', 'female', 'other'].includes(value))
                throw new Error('Gender data is not valid');
        }
    },
    photoUrl: {
        type: String,
        default: 'https://geographyandyou.com/images/user-profile.png',
        validate(value) {
            if (!validator.isURL(value))
                throw new Error("invalid photo URL " + value);
        }
    },
    about: {
        type: String,
        default: "Please enter your about you...",
        maxLength: 250,
    },
    skills: {
        type: [String]
    }
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);
module.exports = User;