const joi = require('joi');

const customerSchema = joi.object({
    name : joi.string().min(3).max(30).required(),
    phone:joi.string().length(10).pattern(/^[0-9]+$/).required(),
    address: joi.string().min(5).max(100).required(),
    password :joi.string().min(4).required() 

});

module.exports = customerSchema;