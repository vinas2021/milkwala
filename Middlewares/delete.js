const Customer = require('../Models/customerModel')

function getNextCustomerId() {
    try {
        const customer = Customer.find({ role: 'customer' });
        const totalCustomer = customer.length
        if (deletedIds.length > 0) {
            return deletedIds.shift(); // Reuse deleted ID
        }
        const maxId = Math.max(customers.map(c => c.id), 0);
        return maxId + 1;


    }
    catch (err) {
        return res.status(500).json({ message: 'server error', err: err.message })
    }

}

// // Example: Adding a new customer
const newCustomerId = getNextCustomerId();
customers.push({ id: newCustomerId, name: "New Customer" });


console.log(customers);
