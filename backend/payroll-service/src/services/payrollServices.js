const Payroll = require("../models/Payroll");

exports.getAll = () => Payroll.find();
exports.getById = (id) => Payroll.findById(id);
exports.getByEmployee = (employeeId) => Payroll.find({ employeeId });
exports.create = (data) => Payroll.create(data);
exports.update = (id, data) => Payroll.findByIdAndUpdate(id, data, { new: true });
exports.remove = (id) => Payroll.findByIdAndDelete(id);
exports.getByMonthYear = (month, year) =>
  Payroll.find({ month, year });
