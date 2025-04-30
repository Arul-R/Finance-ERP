const service = require("../services/payrollService");

exports.getAll = async (req, res) => {
  const data = await service.getAll();
  res.json(data);
};

exports.getById = async (req, res) => {
  const data = await service.getById(req.params.id);
  if (!data) return res.status(404).json({ message: "Not found" });
  res.json(data);
};

exports.getByEmployee = async (req, res) => {
  const data = await service.getByEmployee(req.params.employeeId);
  res.json(data);
};

exports.getByMonthYear = async (req, res) => {
  const { month, year } = req.query;
  const data = await service.getByMonthYear(parseInt(month), parseInt(year));
  res.json(data);
};

exports.create = async (req, res) => {
  const created = await service.create(req.body);
  res.status(201).json(created);
};

exports.update = async (req, res) => {
  const updated = await service.update(req.params.id, req.body);
  res.json(updated);
};

exports.remove = async (req, res) => {
  await service.remove(req.params.id);
  res.json({ message: "Deleted" });
};
