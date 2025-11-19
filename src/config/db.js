const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/filmesdb';

mongoose.set('strictQuery', false);

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
    // If DB connection fails at startup, exit so process managers can restart or user notices
    process.exit(1);
});

module.exports = mongoose;
