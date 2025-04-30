const service = require("../services/clientService");

exports.getAll = async (req, res) => {
  const data = await service.getAllClients();
  res.json(data);
};

exports.getById = async (req, res) => {
  const data = await service.getClientById(req.params.id);
  if (!data) return res.status(404).json({ message: "Not found" });
  res.json(data);
};

exports.create = async (req, res) => {
  const created = await service.createClient(req.body);
  res.status(201).json(created);
};

exports.update = async (req, res) => {
  const updated = await service.updateClient(req.params.id, req.body);
  res.json(updated);
};

exports.remove = async (req, res) => {
  await service.deleteClient(req.params.id);
  res.json({ message: "Deleted" });
};
