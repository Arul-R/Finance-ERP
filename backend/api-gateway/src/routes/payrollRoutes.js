// routes/payrollGateway.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

const PAYROLL_SERVICE_BASE = 'http://localhost:5004/api/payrolls';


// GET all payrolls
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(PAYROLL_SERVICE_BASE);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Payroll service error' });
  }
});

// POST to create a payroll record manually (optional)
router.post('/', async (req, res) => {
  try {
    const response = await axios.post(PAYROLL_SERVICE_BASE, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create payroll' });
  }
});

// POST to calculate payrolls for a given month and year
router.post('/calculate', async (req, res) => {
  try {
    const response = await axios.post(`${PAYROLL_SERVICE_BASE}/calculate`, req.body);
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error('Error forwarding to Payroll:', err.message);
    res.status(500).json({ message: 'Payroll calculation failed' });
  }
});


module.exports = router;
