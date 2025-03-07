const express = require('express');
const routes = express.Router();

const customerController = require('../Controller/customerController');
const { authantication,authorize } = require('../Middlewares/auth');
const customer = require('../Models/customerModel');

routes.post('/register', customerController.register);
routes.post('/login', customerController.login);
routes.get('/',authantication, authorize,customerController.getAllCustomer);
routes.get('/:id',authantication, authorize,customerController.getCustomerById);
routes.put('/update/:id',authantication, authorize,customerController.updateCustomer);
routes.delete('/delete/:id',authantication, authorize,customerController.deleteCustomer);


module.exports = routes;