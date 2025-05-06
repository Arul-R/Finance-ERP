// payroll-service/src/services/payrollService.js
const axios = require('axios');
const Payroll = require('../models/Payroll');

const EMPLOYEE_URL = 'http://localhost:5001/api/employees';
const TIMLOG_URL   = 'http://localhost:5006/api/timelogs';
const EXPENSE_URL  = 'http://localhost:5005/api/expenses';

// Basic CRUD
exports.getAllPayrolls = () => Payroll.find().sort({ year: -1, month: -1 });
exports.getPayrollById = id => Payroll.findById(id);
exports.updatePayroll  = (id, data) => Payroll.findByIdAndUpdate(id, data, { new: true });
exports.deletePayroll  = id => Payroll.findByIdAndDelete(id);


// Create payroll and record expense
exports.generateAndRecordExpense = async ({
  employeeId,
  month,
  year,
  bonus = 0,
  deductions = 0
}) => {
  // 1) Fetch employee
  const { data: emp } = await axios.get(`${EMPLOYEE_URL}/${employeeId}`);
  if (!emp) throw new Error('Employee not found');

  // 2) Fetch timelogs for the given employee and month
  const from = new Date(year, month - 1, 1);                      // First day of month
  const to   = new Date(year, month, 0, 23, 59, 59, 999);         // Last day of month

  const response = await axios.get(TIMLOG_URL, {
    params: {
      employeeId,
      dateFrom: from.toISOString(),
      dateTo:   to.toISOString()
    }
  });

  const logs = response.data || [];

  // 3) Calculate salary components
  const totalHours    = logs.reduce((sum, l) => sum + l.hours_worked, 0);
  const standardHours = 160; // e.g., 8 hours/day * 20 workdays
  const overtimeHours = Math.max(0, totalHours - standardHours);

  const rate = emp.salary_type === 'hourly'
    ? emp.base_salary
    : emp.base_salary / standardHours;

  const overtimePay = overtimeHours * rate;
  const totalPay = emp.base_salary + bonus + overtimePay - deductions;

  // 4) Create payroll record
  const record = await Payroll.create({
    employeeId,
    month,
    year,
    baseSalary: emp.base_salary,
    bonus,
    deductions,
    status: 'unpaid'
  });

  // 5) Record payroll as an expense
  await axios.post(EXPENSE_URL, {
    type:        'payroll',
    amount:      totalPay,
    description: `Payroll for ${employeeId} ${month}/${year}`,
    date:        new Date(),
    employee_id: employeeId
  });

  return record;
};














// const Payroll = require("../model/Payroll");

// exports.getAll = () => Payroll.find();
// exports.getById = (id) => Payroll.findById(id);
// exports.getByEmployee = (employeeId) => Payroll.find({ employeeId });
// exports.create = (data) => Payroll.create(data);
// exports.update = (id, data) => Payroll.findByIdAndUpdate(id, data, { new: true });
// exports.remove = (id) => Payroll.findByIdAndDelete(id);
// exports.getByMonthYear = (month, year) =>
//   Payroll.find({ month, year });
