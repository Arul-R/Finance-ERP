const express = require('express');
const axios = require('axios');
const router = express.Router();

// Replace with the actual host and port of your Vendor service
const VENDOR_SERVICE_URL = 'http://localhost:5007/api/vendors';

// Create a new vendor
router.post('/', async (req, res) => {
  try {
    const response = await axios.post(VENDOR_SERVICE_URL, req.body);
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.response?.data?.error || 'Vendor service error' });
  }
});

// Get all vendors
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(VENDOR_SERVICE_URL);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Vendor service error' });
  }
});

// Get a single vendor by ID
router.get('/:id', async (req, res) => {
  try {
    const response = await axios.get(`${VENDOR_SERVICE_URL}/${req.params.id}`);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.response?.data?.error || 'Vendor service error' });
  }
});

// Update a vendor
router.put('/:id', async (req, res) => {
  try {
    const response = await axios.put(`${VENDOR_SERVICE_URL}/${req.params.id}`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.response?.data?.error || 'Vendor service error' });
  }
});

// Delete a vendor
router.delete('/:id', async (req, res) => {
  try {
    const response = await axios.delete(`${VENDOR_SERVICE_URL}/${req.params.id}`);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.response?.data?.error || 'Vendor service error' });
  }
});

module.exports = router;
