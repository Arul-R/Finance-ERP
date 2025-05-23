// File: api-gateway/src/routes/timeLogRoutes.js
const express = require('express');
const axios   = require('axios');
const router  = express.Router();

// Base URL of your TimeLog service
const TIMELOG_SERVICE = 'http://localhost:5006/api/timelogs';

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
    const response = await axios.get(TIMELOG_SERVICE, { 
      params: req.query,
      headers: forwardHeaders(req)
    });
    res.json(response.data);
  } catch (err) {
    console.error('TimeLog Service Error [GET /]:', err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ 
      error: err.response?.data || err.message 
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const response = await axios.post(TIMELOG_SERVICE, req.body, {
      headers: forwardHeaders(req)
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error('TimeLog Service Error [POST /]:', err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ 
      error: err.response?.data || err.message 
    });
  }
});

router.post('/bulk', async (req, res) => {
  try {
    console.log('Forwarding bulk timelog request:', {
      url: `${TIMELOG_SERVICE}/bulk`,
      body: req.body,
      headers: forwardHeaders(req)
    });
    
    const response = await axios.post(`${TIMELOG_SERVICE}/bulk`, req.body, {
      headers: forwardHeaders(req)
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error('TimeLog Service Error [POST /bulk]:', err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ 
      error: err.response?.data || err.message 
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const response = await axios.get(`${TIMELOG_SERVICE}/${req.params.id}`, {
      headers: forwardHeaders(req)
    });
    res.json(response.data);
  } catch (err) {
    console.error(`TimeLog Service Error [GET /${req.params.id}]:`, err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ 
      error: err.response?.data || err.message 
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const response = await axios.put(`${TIMELOG_SERVICE}/${req.params.id}`, req.body, {
      headers: forwardHeaders(req)
    });
    res.json(response.data);
  } catch (err) {
    console.error(`TimeLog Service Error [PUT /${req.params.id}]:`, err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ 
      error: err.response?.data || err.message 
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const response = await axios.delete(`${TIMELOG_SERVICE}/${req.params.id}`, {
      headers: forwardHeaders(req)
    });
    res.json(response.data);
  } catch (err) {
    console.error(`TimeLog Service Error [DELETE /${req.params.id}]:`, err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ 
      error: err.response?.data || err.message 
    });
  }
});

module.exports = router;
