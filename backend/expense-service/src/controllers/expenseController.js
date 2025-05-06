const expenseService = require('../services/expenseService');

const axios = require('axios');

exports.getMonthlyPayrollExpense = async (req, res) => {
  const { month, year } = req.body;

  try {
    // Fetch payroll data
    const { data: payrolls } = await axios.post('http://localhost:5002/api/payroll/calculate', { month, year });

    const totalAmount = payrolls.reduce((sum, record) => sum + record.finalSalary, 0);

    const expenseRecord = {
      type: 'payroll',
      amount: totalAmount,
      description: `Total employee salary payout for ${month}/${year}`,
      date: new Date(`${year}-${month}-01`)
    };

    res.json(expenseRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getAll = async (req, res) => {
  const data = await expenseService.getAllExpenses();
  res.json(data);
};

exports.getById = async (req, res) => {
  const data = await expenseService.getExpenseById(req.params.id);
  if (!data) return res.status(404).json({ message: 'Not found' });
  res.json(data);
};

exports.create = async (req, res) => {
  const created = await expenseService.createExpense(req.body);
  res.status(201).json(created);
};

exports.update = async (req, res) => {
  const updated = await expenseService.updateExpense(req.params.id, req.body);
  res.json(updated);
};

exports.remove = async (req, res) => {
  await expenseService.deleteExpense(req.params.id);
  res.json({ message: 'Deleted' });
};








// const expenseService = require('../services/expenseService');

// exports.getAll = async (req, res) => {
//   const data = await expenseService.getAllExpenses();
//   res.json(data);
// };

// exports.getById = async (req, res) => {
//   const data = await expenseService.getExpenseById(req.params.id);
//   if (!data) return res.status(404).json({ message: 'Not found' });
//   res.json(data);
// };

// exports.create = async (req, res) => {
//   const created = await expenseService.createExpense(req.body);
//   res.status(201).json(created);
// };

// exports.update = async (req, res) => {
//   const updated = await expenseService.updateExpense(req.params.id, req.body);
//   res.json(updated);
// };

// exports.remove = async (req, res) => {
//   await expenseService.deleteExpense(req.params.id);
//   res.json({ message: 'Deleted' });
// };
