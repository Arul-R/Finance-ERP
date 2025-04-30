const service = require("../services/projectService");

exports.getAll = async (req, res) => {
  const data = await service.getAllProjects();
  res.json(data);
};

exports.getById = async (req, res) => {
  const data = await service.getProjectById(req.params.id);
  if (!data) return res.status(404).json({ message: "Not found" });
  res.json(data);
};

exports.create = async (req, res) => {
  const created = await service.createProject(req.body);
  res.status(201).json(created);
};

exports.update = async (req, res) => {
  const updated = await service.updateProject(req.params.id, req.body);
  res.json(updated);
};

exports.remove = async (req, res) => {
  await service.deleteProject(req.params.id);
  res.json({ message: "Deleted" });
};
