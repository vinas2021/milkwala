const jwt = require('jsonwebtoken');
const Customer = require('../Models/customerModel')

const authantication = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "You are not logged in" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const customer = await Customer.findById(decoded.id);

        if (!customer) {
            return res.status(401).json({ message: "Not authorized" });
        }

        req.customer = customer; // Attach user to request object
       
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
// authorize
const authorize = (req, res, next) => {
    if (req.customer.role === "admin") {
        next();
    } else {
        console.log(req.customer.role);
        return res.status(403).json({ message: "Unauthorized: You do not have admin privileges." });
    }
};


module.exports = { authantication, authorize };