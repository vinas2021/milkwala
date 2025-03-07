const mongoose = require('mongoose');

const dbconnect = () => {
    mongoose.connect('mongodb://localhost:27017/Duthwala')
        .then(() => {
            console.log('Database connected');
        })
        .catch((err) => {
            console.log('Database connection failed', err);
        });
}
module.exports = dbconnect;