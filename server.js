require('dotenv').config();
require('module-alias/register');
const express = require('express');
const cors = require('cors');
const app = express();

const { connectDB } = require('@/utils/db');
const PORT = process.env.PORT;
const userRouter = require('@/routes/user.route');

app.use(express.json());
app.use(cors());

app.use('/api/user', userRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});