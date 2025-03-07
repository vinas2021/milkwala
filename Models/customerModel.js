const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const customerSchema = new mongoose.Schema({
    customer_id: {
        type: String,
        required: true,
        unique: true,
    },

    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    phone: {
        type: String,
        required: true,
       
    },
    address: {
        type: String,
        required: true
    },

    role: {
        type: String,
        required: true,
        enum: ['admin', 'customer'],
        default: 'customer'
    },

    password: {
        type: String,
        required: true,
    
    },

    updateat: {
        type: Date,
        default: Date.now
    },

    createdat: {
        type: Date,
        default: Date.now
    }

});

const customer = mongoose.model('customer', customerSchema);

module.exports = customer;