const TimeLog = require('../models/TimeLog');
const timelogServices = require('../services/timelogServices');
const axios = require('axios');

exports.getAll = async (req, res) => {
  try {
    const { employeeId, dateFrom, dateTo } = req.query;

    const query = {};

    if (employeeId) {
      query.employee_id = employeeId;
    }

    if (dateFrom && dateTo) {
      query.date = {
        $gte: new Date(dateFrom),
        $lte: new Date(dateTo)
      };
    }

    const logs = await TimeLog.find(query).sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const log = await TimeLog.findById(req.params.id);
    if (!log) return res.status(404).json({ message: 'TimeLog not found' });
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { project_id, date, hours_worked } = req.body;
    const employee_id = req.user.userId; // Get employee_id from JWT token

    const log = await TimeLog.create({ 
      employee_id, 
      project_id, 
      date, 
      hours_worked 
    });

    // Notify payroll service about the new timelog
    try {
      const PAYROLL_URL = process.env.PAYROLL_URL || 'http://localhost:5004/api/payrolls';
      const month = new Date(date).getMonth() + 1; // +1 because getMonth() returns 0-11
      const year = new Date(date).getFullYear();
      
      console.log('Notifying payroll service:', { month, year });
      await axios.post(`${PAYROLL_URL}/calculate`, { 
        month: parseInt(month), 
        year: parseInt(year) 
      });
      console.log('Payroll service notified successfully');
    } catch (error) {
      console.error('Error notifying payroll service:', error.response?.data || error.message);
      // Don't fail the request if payroll service notification fails
    }

    // Notify expense service about the new timelog
    try {
      const EXPENSE_URL = process.env.EXPENSE_URL || 'http://localhost:5000/api/expenses';
      const month = new Date(date).getMonth() + 1;
      const year = new Date(date).getFullYear();
      
      console.log('Notifying expense service:', { month, year });
      await axios.post(`${EXPENSE_URL}/payroll`, { 
        month: parseInt(month), 
        year: parseInt(year) 
      });
      console.log('Expense service notified successfully');
    } catch (error) {
      console.error('Error notifying expense service:', error.response?.data || error.message);
      // Don't fail the request if expense service notification fails
    }

    res.status(201).json(log);
  } catch (err) {
    console.error('Create timelog error:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.createBulk = async (req, res) => {
  try {
    const entries = req.body;
    if (!Array.isArray(entries)) {
      return res.status(400).json({ error: 'Payload must be an array' });
    }
    const docs = await timelogServices.createBulk(entries);
    res.status(201).json(docs);
  } catch (err) {
    console.error('Bulk create error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updates = req.body;
    const log = await TimeLog.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!log) return res.status(404).json({ message: 'TimeLog not found' });
    res.json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const log = await TimeLog.findByIdAndDelete(req.params.id);
    if (!log) return res.status(404).json({ message: 'TimeLog not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get employees who have logged hours in a specific month with their total hours
exports.getLoggedEmployees = async (req, res) => {
  try {
    const { month, year } = req.body;
    
    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' });
    }

    const logs = await timelogServices.getLoggedEmployeesWithHours(month, year);
    res.json(logs);
  } catch (err) {
    console.error('Error in getLoggedEmployees:', err);
    res.status(500).json({ message: err.message });
  }
};

