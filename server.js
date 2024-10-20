require('dotenv').config();
require('module-alias/register');
const express = require('express');
const cors = require('cors');
const app = express();

const { connectDB } = require('@/utils/db');
const PORT = process.env.PORT;
const userRouter = require('@/routes/user.route');
const productRouter = require('@/routes/product.route');
const suppliesRouter = require('@/routes/supplies.route');
const importSlipRouter = require('@/routes/importSlip.route');
const contractRouter = require('@/routes/contract.route');
const exportSlipRouter = require('./src/routes/exportSlip.route');

app.use(express.json());
app.use(cors());

app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/supplies', suppliesRouter);
app.use('/api/importSlip', importSlipRouter);
app.use('/api/contract', contractRouter);
app.use('/api/exportSlip', exportSlipRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});