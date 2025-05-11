const employeeServices = require('../services/employeeServices');

exports.getAll = async (req, res) => {
  const data = await employeeServices.getAllEmployees();
  res.json(data);
};

exports.getById = async (req, res) => {
  const data = await employeeServices.getEmployeeById(req.params.id);
  if (!data) return res.status(404).json({ message: 'Not found' });
  res.json(data);
};

exports.getByEmail = async (req, res) => {
  const data = await employeeServices.getEmployeeByEmail(req.params.email);
  if (!data) return res.status(404).json({ message: 'Employee not found' });
  res.json(data);
};

exports.create = async (req, res) => {
  try {
    // 1) Create in DB
    const emp = await employeeServices.createEmployee(req.body);
    // 2) Publish event via Redis client stored in app.locals
    await employeeServices.publishEmployeeCreated(req.app.locals.pub, emp);
    res.status(201).json(emp);
  } catch (error) {
    console.error('Error creating employee:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Failed to add employee', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await employeeServices.updateEmployee(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Employee not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update employee', error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await employeeServices.deleteEmployee(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete employee', error: error.message });
  }
};
