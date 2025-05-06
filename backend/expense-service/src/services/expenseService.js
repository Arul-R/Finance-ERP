const Expense = require('../models/Expense');

exports.getAllExpenses  = () => Expense.find().sort({ date: -1 });
exports.getExpenseById  = id => Expense.findById(id);
exports.createExpense   = data => Expense.create(data);
exports.updateExpense   = (id, data) => Expense.findByIdAndUpdate(id, data, { new: true });
exports.deleteExpense   = id => Expense.findByIdAndDelete(id);







// const Expense = require('../models/Expense');

// // CRUD
// exports.getAllExpenses    = () => Expense.find().sort({ date: -1 });
// exports.getExpenseById    = id => Expense.findById(id);
// exports.createExpense     = data => Expense.create(data);
// exports.updateExpense     = (id, data) => Expense.findByIdAndUpdate(id, data, { new: true });
// exports.deleteExpense     = id => Expense.findByIdAndDelete(id);

// // Auto-create payroll expense from event
// exports.recordPayrollExpense = async ({ employeeId, total, month, year }) => {
//   const exp = await Expense.create({
//     type: 'payroll',
//     amount: total,
//     description: `Payroll for ${employeeId} ${month}/${year}`,
//     date: new Date(),
//     employee_id: employeeId
//   });
//   return exp;
// };
