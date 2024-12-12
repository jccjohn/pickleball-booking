require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const courtRoutes = require('./routes/courtRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courts', courtRoutes);
app.use('/api/bookings', bookingRoutes);

// Database initialization
db.initializeDatabase();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
