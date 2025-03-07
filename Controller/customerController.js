const bcrypt = require('bcrypt')
const { generatetoken, setCookie } = require('../Utils/token')
const Customer = require('../Models/customerModel');
const customerSchema = require('../Middlewares/joivalidation')
const Milk = require('../Models/milkModel');
const customer = require('../Models/customerModel');

// register customer
exports.register = async (req, res) => {
    const { name, phone, address, password } = req.body;

    try {
        // Validate input
        if (!name || !phone || !address || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if phone already exists
        const phoneExist = await Customer.findOne({ phone });
        if (phoneExist) {
            return res.status(400).json({ message: 'Phone already exists' });
        }

        let customer_id;

        // Check if this is the first customer
        const customerCount = await Customer.countDocuments();

        if (customerCount === 0) {
            customer_id = "0000"; // First user gets ID "0000"
        } else if (deletedIds.length > 0) {
            // Reuse the lowest deleted ID
            customer_id = deletedIds.shift().toString().padStart(4, '0');


        } else {
            // Find max customer_id and increment
            const lastCustomer = await Customer.findOne().sort({ customer_id: -1 });
            customer_id = lastCustomer ? (parseInt(lastCustomer.customer_id) + 1).toString().padStart(4, '0') : "0001";
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // Assign role (first customer = admin, others = customer)
        let role = customer_id === "0000" ? "admin" : "customer";

        // Create new customer
        const customer = new Customer({
            customer_id,
            name,
            phone,
            address,
            role,
            password: hashPassword
        });

        await customer.save();

        res.status(201).json({ message: 'Customer created successfully', customer });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// customer login

exports.login = async (req, res) => {
    const { phone, password } = req.body

    try {


        if (!phone || !password) {
            return res.status(400).json({ message: 'All field are required' })
        }

        const customer = await Customer.findOne({ phone });
        if (!customer) {
            return res.status(400).json({ message: 'you are not registered' })
        }

        // console.log(customer.password, " ", password);


        // password compare 
        const valid_password = await bcrypt.compare(password, customer.password)
        if (!valid_password) {
            return res.status(400).json({ message: 'phone number or password is wrong' })
        }


        // create jwt token
        const token = generatetoken(customer._id);


        setCookie(res, token);

        res.status(200).json({ message: 'customer login successfully', customer, token })
    }
    catch (err) {
        console.error('Login error:', err);


        res.status(500).json({ message: 'server error' });
    }
}

// get all customer
exports.getAllCustomer = async (req, res) => {
    try {
        const customer = await Customer.find({ role: 'customer' });
        const totalCustomer = customer.length
        res.status(200).json({ message: 'all customers found', totalCustomer, customer })
    }
    catch (err) {
        return res.status(500).json({ message: 'server error', err: err.message })
    }
}


// Get a single customer by ID
exports.getCustomerById = async (req, res) => {
    try {
        const { id } = req.params
        const customer = await Customer.findOne({ customer_id: id });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json(customer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Update an existing customer
exports.updateCustomer = async (req, res) => {
    try {
        const { id } = req.params
        const customer = await Customer.findOne({ customer_id: id });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        // Update fields if provided in the request body
        const updateCustomer = {
            name: req.body.name || customer.name,
            phone: req.body.phone || customer.phone,
            address: req.body.address || customer.address
        }

        const updatedcustomer = await Customer.findByIdAndUpdate(customer.id, updateCustomer, { new: true });
        res.status(200).json({ message: 'customer data updated', updatedcustomer })
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


// Delete a customer
let deletedIds = [];
exports.deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params
        const customer = await Customer.findOne({ customer_id: id });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        // Delete the customer
        await Customer.deleteOne({ customer_id: id });

        // Store the deleted ID for reuse
        deletedIds.push(parseInt(id));
        deletedIds.sort((a, b) => a - b); // Keep sorted for reuse

        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: err.message });
    }
}

// logout customer 
exports.logout = async (req, res) => {
    setCookie(res, '', { expires: Date.now() });
    res.status(200).json({ message: "customer logout successfully" });

};




