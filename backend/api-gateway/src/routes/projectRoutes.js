const express = require('express');
const axios = require('axios');
const router = express.Router();

const PROJECT_SERVICE = 'http://localhost:5002/api/projects';

// Helper function to forward headers
const forwardHeaders = (req) => {
  const headers = {};
  if (req.headers.authorization) {
    headers.authorization = req.headers.authorization;
  }
  return headers;
};

// Public routes (no auth required)
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(PROJECT_SERVICE, {
      headers: forwardHeaders(req)
    });
    res.json(response.data);
  } catch (err) {
    console.error('Project Service Error [GET /]:', err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ 
      error: err.response?.data || err.message 
    });
  }
});

// Protected routes (Admin only)
router.post('/', async (req, res) => {
  try {
    // Check if user has Admin role
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const response = await axios.post(PROJECT_SERVICE, req.body, {
      headers: forwardHeaders(req)
    });
    res.json(response.data);
  } catch (err) {
    console.error('Project Service Error [POST /]:', err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ 
      error: err.response?.data || err.message 
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const response = await axios.delete(`${PROJECT_SERVICE}/${req.params.id}`, {
      headers: forwardHeaders(req)
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error(`Project Service Error [DELETE /${req.params.id}]:`, err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ 
      error: err.response?.data || err.message 
    });
  }
});

// Protected route (Admin only)
router.post('/monthly-income', async (req, res) => {
  try {
    const response = await axios.post(`${PROJECT_SERVICE}/monthly-income`, req.body, {
      headers: forwardHeaders(req)
    });
    res.json(response.data);
  } catch (err) {
    console.error('Project Service Error [POST /monthly-income]:', err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ 
      error: err.response?.data || err.message 
    });
  }
});

module.exports = router;
