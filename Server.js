require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoute');
const app = express();


app.use(express.json());
app.use(cookieParser());

app.use(cors());
connectDB();

app.use('/api/auth', authRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})