// File: client-service/src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const clientRoutes = require('./routes/clientRouters');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/client_service';
console.log('Connecting to MongoDB:', MONGO_URI);

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Client DB connected successfully');
    console.log('MongoDB connection state:', mongoose.connection.readyState);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/clients', clientRoutes);

// Health check
app.get('/health', (_req, res) => {
  const dbState = mongoose.connection.readyState;
  res.json({ 
    status: 'Client Service OK',
    dbState: dbState,
    dbStateText: ['disconnected', 'connected', 'connecting', 'disconnecting'][dbState]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Client Service running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV || 'development');
});
