const Project = require("../models/Project");

exports.getAllProjects = () => Project.find();
exports.getProjectById = (id) => Project.findById(id);
exports.createProject = (data) => Project.create(data);
exports.updateProject = (id, data) => Project.findByIdAndUpdate(id, data, { new: true });
exports.deleteProject = (id) => Project.findByIdAndDelete(id);
exports.getAllProjects = (employeeId) => {
    if (employeeId) {
      // Find projects where assigned_employees.id matches
      return Project.find({ 'assigned_employees.id': employeeId }).sort({ start_date: -1 });
    } else {
      return Project.find().sort({ start_date: -1 });
    }
  };
// exports.getProjectById = id => Project.findById(id);