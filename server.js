const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');
const orderRoutes = require('./routes/orders');
require('dotenv').config();
console.log('JWT Secret:', process.env.ACCESS_TOKEN_SECRET); // Verify loading

// Initialize Express
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/products', require('./routes/productRoutes'));

app.use('/api/orders', orderRoutes);

app.use('/api/auth', require('./routes/auth.routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Server Error' });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});