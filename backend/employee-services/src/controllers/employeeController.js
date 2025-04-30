const employeeService = require("../services/employeeService");

exports.getAll = async (req, res) => {
  const data = await employeeService.getAllEmployees();
  res.json(data);
};

exports.getById = async (req, res) => {
  const data = await employeeService.getEmployeeById(req.params.id);
  if (!data) return res.status(404).json({ message: "Not found" });
  res.json(data);
};

exports.create = async (req, res) => {
  const created = await employeeService.createEmployee(req.body);
  res.status(201).json(created);
};

exports.update = async (req, res) => {
  const updated = await employeeService.updateEmployee(req.params.id, req.body);
  res.json(updated);
};

exports.remove = async (req, res) => {
  await employeeService.deleteEmployee(req.params.id);
  res.json({ message: "Deleted" });
};
