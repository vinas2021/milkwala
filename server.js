const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser'); // Fixed typo
const bodyParser = require('body-parser'); // Fixed typo
const app = express();
dotenv.config();

const port = process.env.PORT || 9999

const dbconnect = require('./Config/connection')
const customerRoutes = require('./Routes/customerRoutes')
const milkRoutes = require('./Routes/milkRoutes');

app.use(express.json());
app.use(cookieParser()); // Fixed typo
app.use(bodyParser.urlencoded({extended:true})) // Fixed typo
dbconnect();

// main route

app.use('/customer',customerRoutes);
app.use('/milk', milkRoutes);

app.listen(port , () => {
    console.log(`server is running on ${port}`)
})
