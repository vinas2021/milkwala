const { id, message } = require('../Middlewares/joivalidation');
const { findById } = require('../Models/customerModel');
const Milk = require('../Models/milkModel');
const Customer = require('../Models/customerModel');

// Create a new milk record
exports.createMilk = async (req, res) => {
	try {
		const { id } = req.params;
		const { date = Date.now(), quantity = 1, perLitterPrice = 70, milktype
		} = req.body;
		const customer = await Customer.findOne({ customer_id: id });

		if (!customer) {
			return res.status(404).json({ message: "Customer not found" });
		}

		const totalAmount = quantity * perLitterPrice;

		const milk = new Milk({
			date,
			customer_id: customer.id,
			milkBuyID: customer.customer_id,
			quantity,
			perLitterPrice,
			milktype: milktype,
			totalAmount
		});
		await milk.save();
		res.status(201).json({ message: "Milk Data Add ", milk });

	}
	catch (error) {
		console.error("Error in creating milk:", error);
		res.status(500).json({ message: "Internal Server Error", error: error.message });
	}
}

// Get all milk records
exports.getAllMilk = async (req, res) => {
	try {
		const milkRecords = await Milk.find();
		res.status(200).json(milkRecords);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.getMilkByCustomerId = async (req, res) => {
	try {
		const { id } = req.params;

		const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1); // Start of this month
		const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999); // End of this month

		const milkRecords = await Milk.find({
			date: {
				$gte: startOfMonth, // Greater than or equal to start of month
				$lte: endOfMonth    // Less than or equal to end of month
			},
			milkBuyID: id,
		});

		if (milkRecords.length === 0) {
			return res.status(404).json({ message: 'Milk records not found for the current month' });
		}

		res.status(200).json({
			message: 'Milk records retrieved successfully',
			totalEntries: milkRecords
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Update a milk record
exports.updateMilk = async (req, res) => {
	try {
		const { id } = req.params
		const milkRecord = await Milk.findById(id);
		if (!milkRecord) {
			return res.status(404).json({ message: 'Milk record not found' });
		}

		const updatedData = {
			date: req.body.date || milkRecord.date,
			quantity: req.body.quantity || milkRecord.quantity,
			perLitterPrice: req.body.perLitterPrice || milkRecord.perLitterPrice,
			totalAmount: req.body.quantity || milkRecord.quantity * req.body.perLitterPrice || milkRecord.perLitterPrice
		};
		const name = req.customer.name
		const time = Date.now()

		const updatedMilk = await Milk.findByIdAndUpdate(milkRecord.id, updatedData, { new: true })
		res.status(200).json({ message: "milk data updated ", updatedMilk, name, time });
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};


// Delete a milk record
exports.deleteMilk = async (req, res) => {
	try {
		const { id } = req.params;

		const deletedRecord = await Milk.findByIdAndDelete(id);

		if (!deletedRecord) {
			return res.status(404).json({ message: "Milk record not found" });
		}

		res.status(200).json({ message: "Milk record deleted successfully", deletedRecord });
	} catch (err) {
		res.status(500).json({ message: "Server error", error: err.message });
	}
};


// monthly sales

exports.getMilkDataByMonth = async (req, res) => {

	try {

		const { id } = req.params;

		const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1); // Start of this month

		// console.log(startOfMonth);

		const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999); // End of this month


		// console.log(endOfMonth);

		const milkData = await Milk.find({
			date: {
				$gte: startOfMonth, // Greater than or equal to start of month
				$lte: endOfMonth    // Less than or equal to end of month
			}, milkBuyID: id
		});

		if (milkData.length === 0) {
			return res.status(404).json({ message: "Milk data not found" });
		}


		const totalEntries = milkData.length;

		// total quantity
		const totalQuantity = milkData.reduce((acc, curr) => acc + curr.quantity, 0);
		// console.log(totalQuantity);


		// avg. price
		const avgPrice = (milkData.reduce((acc, curr) => acc + curr.totalAmount, 0) / totalQuantity).toFixed(2);


		// total amount
		const totalAmount = totalQuantity * avgPrice;

		res.status(200).json({ message: "Milk data found", totalEntries, totalQuantity, avgPrice, totalAmount });


	} catch (error) {
		console.error("Error in getting milk data by month:", error);
		res.status(500).json({ message: "Internal Server Error", error: error.message });
	}
}


// get data for last 6 months and query month
exports.MonthWiseData = async (req, res) => {
	try {
		const { id } = req.params;
		const { month } = req.query; // Read month from query params

		// Get the current date
		const currentDate = new Date();
		const currentYear = currentDate.getFullYear();
		console.log(currentYear - 1);

		const currentMonth = currentDate.getMonth();

		let startDate, endDate;

		if (month) { // 12
			// If a specific month is selected, fetch data for that month only
			const selectedMonth = parseInt(month);

			// Validate the month input
			if (isNaN(selectedMonth) || selectedMonth < 1 || selectedMonth > 12) {
				return res.status(400).json({ message: "Invalid month. Please enter a value between 1 and 12." });
			}

			const year = selectedMonth > currentMonth ? currentYear - 1 : currentYear;
			startDate = new Date(year, selectedMonth - 1, 1);
			endDate = new Date(year, selectedMonth, 0, 23, 59, 59, 999);

		} else {
			// If no specific month is provided, fetch the last 6 months of data
			const currentMonth = currentDate.getMonth(); // 0-based index
			startDate = new Date(currentYear, currentMonth - 5, 1); // First day of 6 months ago

			endDate = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999); // Last day of the current month
		}



		// Fetch data from MongoDB
		const milkData = await Milk.find({
			milkBuyID: id,
			date: { $gte: startDate, $lte: endDate },
		});

		if (milkData.length === 0) {
			return res.status(404).json({ message: "Milk data not found" });
		}

		const totalEntries = milkData.length;

		res.status(200).json({
			message: `Milk data for customer ${id} (${month ? `month ${month}` : "last 6 months"})`,
			totalEntries,
			milkData
		});

	} catch (err) {
		res.status(500).json({ message: "Server error", error: err.message });
	}
};

// total payment month wise of all customer
exports.totalPayment = async (req, res) => {
	try {
		const { percentage } = req.query
		const { quantity } = req.query
		// const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1); // Start of this month
		// const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999); // End of this month


		const milkData = await Milk.find({ quantity: { $gte: quantity } });
		// console.log(milkData);		

		const total = milkData.length

		// total amount
		const totalPayment = (milkData.reduce((acc, curr) => acc + curr.totalAmount, 0));

		// paid payment
		const paidPayment = totalPayment * percentage / 100
		
		// due payment
		const duePayment = totalPayment - paidPayment

		// if(!percentage){
		// 	res.status(400).json({message:'percentage is required'})
		// }

		// if()
		res.status(200).json({ message: 'total payment', total, totalPayment, paidPayment, duePayment })



	} catch (error) {
		res.status(500).json({ message: "Internal Server Error", error: error.message });
	}
}