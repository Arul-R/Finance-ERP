const Project = require("../models/Project");

exports.getAllProjects = () => Project.find();
exports.getProjectById = (id) => Project.findById(id);
exports.createProject = (data) => Project.create(data);
exports.updateProject = (id, data) => Project.findByIdAndUpdate(id, data, { new: true });
exports.deleteProject = (id) => Project.findByIdAndDelete(id);
