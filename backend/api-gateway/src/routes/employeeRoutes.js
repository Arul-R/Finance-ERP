const express = require('express');
const axios = require('axios');
const router = express.Router();

const EMPLOYEE_SERVICE = 'http://localhost:5001/api/employees';

// Helper function to forward headers
const forwardHeaders = (req) => {
  const headers = {};
  if (req.headers.authorization) {
    headers.authorization = req.headers.authorization;
  }
  return headers;
};

router.get('/', async (req, res) => {
  try {
    const response = await axios.get(EMPLOYEE_SERVICE, { headers: forwardHeaders(req) });
    res.json(response.data);
  } catch (err) {
    console.error('Employee service error:', err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ 
      message: 'Employee service error',
      error: err.response?.data || err.message 
    });
  }
});

router.post('/', async (req, res) => {
  try {
    console.log('Forwarding request to employee service:', {
      url: EMPLOYEE_SERVICE,
      body: req.body,
      headers: forwardHeaders(req)
    });
    
    const response = await axios.post(EMPLOYEE_SERVICE, req.body, { headers: forwardHeaders(req) });
    res.json(response.data);
  } catch (err) {
    console.error('Failed to add employee:', err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ 
      message: 'Failed to add employee',
      error: err.response?.data || err.message 
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const response = await axios.get(`${EMPLOYEE_SERVICE}/${req.params.id}`, { headers: forwardHeaders(req) });
    res.json(response.data);
  } catch (err) {
    console.error('Employee not found:', err.response?.data || err.message);
    res.status(err.response?.status || 404).json({ 
      message: 'Employee not found',
      error: err.response?.data || err.message 
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const response = await axios.put(`${EMPLOYEE_SERVICE}/${req.params.id}`, req.body, { headers: forwardHeaders(req) });
    res.json(response.data);
  } catch (err) {
    console.error('Failed to update employee:', err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ 
      message: 'Failed to update employee',
      error: err.response?.data || err.message 
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const response = await axios.delete(`${EMPLOYEE_SERVICE}/${req.params.id}`, { headers: forwardHeaders(req) });
    res.json(response.data);
  } catch (err) {
    console.error('Failed to delete employee:', err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ 
      message: 'Failed to delete employee',
      error: err.response?.data || err.message 
    });
  }
});

module.exports = router;
