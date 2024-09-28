const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://AnkitSuryawanshi:Ankit7127@devnode.36a3x.mongodb.net/devMERN');
}

module.exports = connectDB;
