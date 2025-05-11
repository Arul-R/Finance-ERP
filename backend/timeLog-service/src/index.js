// File: timeLog-service/src/index.js
require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');
const jwt      = require('jsonwebtoken');

const timeLogRoutes = require('./routes/timeLogRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// 1) Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('TimeLog DB connected'))
  .catch(err => console.error('MongoDB error:', err));

// 2) Mount routes with authentication
app.use('/api/timelogs', authenticateToken, timeLogRoutes);

// 3) Health check
app.get('/health', (_req, res) => res.json({ status: 'TimeLog Service OK' }));

// 4) Start server
const PORT = process.env.PORT || 5006;
app.listen(PORT, () => console.log(`TimeLog Service running on port ${PORT}`));
