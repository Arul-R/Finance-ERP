// routes/payrollGateway.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

const PAYROLL_SERVICE_BASE = 'http://localhost:5004/api/payrolls';


// GET all payrolls
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(PAYROLL_SERVICE_BASE, {
      headers: { Authorization: req.headers.authorization }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Payroll service error' });
  }
});

router.get('/month-year', async (req, res) => {
  try {
    const { month, year } = req.query;
    const response = await axios.get(`${PAYROLL_SERVICE_BASE}/month-year`, { 
      params: { month, year },
      headers: { Authorization: req.headers.authorization }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve payrolls for the specified month and year' });
  }
});

// POST to create a payroll record manually (optional)
router.post('/', async (req, res) => {
  try {
    const response = await axios.post(PAYROLL_SERVICE_BASE, req.body, {
      headers: { Authorization: req.headers.authorization }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create payroll' });
  }
});

// POST to calculate payrolls for a given month and year
router.post('/calculate', async (req, res) => {
  try {
    console.log('Forwarding calculate request to payroll service:', req.body);
    const response = await axios.post(`${PAYROLL_SERVICE_BASE}/calculate`, req.body, {
      headers: { Authorization: req.headers.authorization }
    });
    console.log('Payroll service response:', response.data);
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error('Error forwarding to Payroll:', err.response?.data || err.message);
    res.status(500).json({ 
      message: 'Payroll calculation failed',
      error: err.response?.data?.message || err.message
    });
  }
});


module.exports = router;
