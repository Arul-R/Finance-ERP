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
exports.calculateMonthlyRetainerIncome = async (month, year) => {
    try {
        const activeProjects = await Project.find({ status: 'active' });
        const totalIncome = activeProjects.reduce((sum, project) => {
            return sum + (project.monthlyRetainer || 0);
        }, 0);
        return {
            month,
            year,
            totalIncome
        };
    } catch (error) {
        console.error('Error calculating monthly retainer income:', error);
        throw error;
    }
};