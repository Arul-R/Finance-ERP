const Employee = require("../models/Employee");

exports.getAllEmployees = () => Employee.find();
exports.getEmployeeById = (id) => Employee.findById(id);
exports.createEmployee = (data) => Employee.create(data);
exports.updateEmployee = (id, data) => Employee.findByIdAndUpdate(id, data, { new: true });
exports.deleteEmployee = (id) => Employee.findByIdAndDelete(id);
