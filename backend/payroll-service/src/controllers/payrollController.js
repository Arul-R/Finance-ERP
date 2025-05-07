const payrollService = require('../services/payrollServices');
const Payroll = require('../models/Payroll');
const axios = require('axios');

// Get all payrolls
exports.getAll = async (req, res) => {
  try {
    const data = await payrollService.getAllPayrolls();
    res.json(data);
  } catch (err) {
    console.error('Payroll/getAll error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get payroll by ID
exports.getById = async (req, res) => {
  try {
    const data = await payrollService.getPayrollById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Payroll not found' });
    res.json(data);
  } catch (err) {
    console.error('Payroll/getById error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Create payroll
exports.create = async (req, res) => {
  try {
    const record = await payrollService.generateAndRecordExpense(req.body);
    res.status(201).json(record);
  } catch (err) {
    console.error('Payroll/create error:', err.stack || err);
    res.status(500).json({ message: 'Failed to create payroll', error: err.message });
  }
};

// Update payroll
exports.update = async (req, res) => {
  try {
    const updated = await payrollService.updatePayroll(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Payroll not found' });
    res.json(updated);
  } catch (err) {
    console.error('Payroll/update error:', err);
    res.status(400).json({ message: err.message });
  }
};

// Delete payroll
exports.remove = async (req, res) => {
  try {
    const result = await payrollService.deletePayroll(req.params.id);
    if (!result) return res.status(404).json({ message: 'Payroll not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Payroll/remove error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get payrolls by employee ID
exports.getByEmployee = async (req, res) => {
  try {
    const data = await payrollService.getByEmployee(req.params.employeeId);
    res.json(data);
  } catch (err) {
    console.error('Payroll/getByEmployee error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get payrolls by month and year
exports.getByMonthYear = async (req, res) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' });
    }
    
    const data = await payrollService.getByMonthYear(
      parseInt(month),
      parseInt(year)
    );
    
    res.json(data);
  } catch (err) {
    console.error('Payroll/getByMonthYear error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Calculate payroll for all active employees
exports.calculatePayroll = async (req, res) => {
  try {
    const { month, year } = req.body;
    
    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' });
    }
    
    const result = await payrollService.calculateMonthlyPayroll(month, year);
    res.json(result);
  } catch (err) {
    console.error('Payroll/calculatePayroll error:', err);
    res.status(500).json({ message: err.message });
  }
};