const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['payroll', 'vendor', 'misc'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: String,
  date: {
    type: Date,
    default: Date.now
  },
  employee_id: String,
  vendor_id: String
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
