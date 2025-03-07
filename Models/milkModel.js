const { required } = require('joi');
const mongoose = require('mongoose');
const { type } = require('../Middlewares/joivalidation');

const MilkSchema = new mongoose.Schema({
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "customer",
        required: true
    },
    milkBuyID: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    quantity: {
        type: Number,
        default: 1
    },

    milktype: {
        type: String,
        required: true,
        enum: ['cow', 'buffalo'],
        default: 'cow'
    },

    perLitterPrice: {
        type: Number,
        default: 70
    },
    totalAmount: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Milk', MilkSchema);