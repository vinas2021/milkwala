const jwt = require('jsonwebtoken');

// generate JWT token
const generatetoken = (customer_id) => {
    return jwt.sign({ id: customer_id }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

// set cookie in response
const setCookie = (res, token) => {
    const options = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
    }
    res.cookie('token', token, options);
}

module.exports = { generatetoken, setCookie }