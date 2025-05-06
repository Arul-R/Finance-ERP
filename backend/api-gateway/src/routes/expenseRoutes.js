// File: api-gateway/src/routes/expenseRoutes.js
const express = require('express');
const axios   = require('axios');
const router  = express.Router();

// Base URL of the Expense service
const EXPENSE_SERVICE = 'http://localhost:5005/api/expenses';

router.get('/', async (req, res) => {
  try {
    const response = await axios.get(EXPENSE_SERVICE, { params: req.query });
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error('Expense Service Error [GET /]', err.message);
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const response = await axios.post(EXPENSE_SERVICE, req.body);
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error('Expense Service Error [POST /]', err.message);
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const response = await axios.get(`${EXPENSE_SERVICE}/${req.params.id}`);
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error(`Expense Service Error [GET /${req.params.id}]`, err.message);
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const response = await axios.put(`${EXPENSE_SERVICE}/${req.params.id}`, req.body);
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error(`Expense Service Error [PUT /${req.params.id}]`, err.message);
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const response = await axios.delete(`${EXPENSE_SERVICE}/${req.params.id}`);
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error(`Expense Service Error [DELETE /${req.params.id}]`, err.message);
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

module.exports = router;
