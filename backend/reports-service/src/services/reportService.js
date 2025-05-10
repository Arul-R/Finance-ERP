const axios = require('axios');
const Report = require('../models/Report');

const EXPENSE_SERVICE_URL = process.env.EXPENSE_SERVICE_URL || 'http://localhost:5005';
const PROJECT_SERVICE_URL = process.env.PROJECT_SERVICE_URL || 'http://localhost:5002';

exports.generateMonthlyFinancialReport = async (month, year) => {
    try {
        // Get expenses data
        const expenseResponse = await axios.post(`${EXPENSE_SERVICE_URL}/api/expenses/months-expense`, {
            month,
            year
        });

        // Get income data from projects
        const incomeResponse = await axios.post(`${PROJECT_SERVICE_URL}/api/projects/monthly-income`, {
            month,
            year
        });

        const expenses = expenseResponse.data;
        const income = incomeResponse.data;

        // Calculate totals
        const payrollExpenses = expenses.find(e => e.type === 'payroll')?.amount || 0;
        const vendorExpenses = expenses.filter(e => e.type === 'vendor')
            .reduce((sum, e) => sum + e.amount, 0);
        const totalExpenses = payrollExpenses + vendorExpenses;

        // Update income calculation to handle both monthly retainer and fixed billing
        const retainerIncome = income.monthlyRetainer || 0;
        const projectIncome = income.billing_type === 'fixed' ? income.total_amount : 0;
        const totalIncome = retainerIncome + projectIncome;

        // Create report object
        const report = new Report({
            month,
            year,
            income: {
                retainerIncome,
                totalIncome
            },
            expenses: {
                payrollExpenses,
                vendorExpenses,
                totalExpenses
            },
            summary: {
                totalIncome,
                totalExpenses,
                netIncome: totalIncome - totalExpenses
            }
        });

        await report.save();
        return report;
    } catch (error) {
        console.error('Error generating monthly financial report:', error);
        throw error;
    }
};

exports.getMonthlyReport = async (month, year) => {
    return Report.findOne({ month, year });
};