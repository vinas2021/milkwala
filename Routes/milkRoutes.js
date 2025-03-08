const express = require('express');
const router = express.Router();
const milkController = require('../Controller/milkController');

const { authantication, authorize } = require('../Middlewares/auth')
// Create a new milk record
router.post('/create/:id', authantication, authorize, milkController.createMilk);

// Get all milk records
router.get('/find', authantication, authorize, milkController.getAllMilk);


// Get a single milk record by ID
router.get('/findbyid/:id', authantication, authorize, milkController.getMilkByCustomerId);

// Update a milk record by ID
router.put('/update/:id', authantication, authorize, milkController.updateMilk);

// Delete a milk record by ID
router.delete('/delete/:id', authantication, authorize, milkController.deleteMilk);

// get total milk 
router.get('/total/:id', authantication, authorize, milkController.getMilkDataByMonth);

// month wise data
router.get('/month/:id',authantication, authorize, milkController.MonthWiseData);


module.exports = router;