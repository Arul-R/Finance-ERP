// payroll-service/src/controllers/payrollController.js
const payrollService = require('../services/payrollServices');
const axios = require('axios');
const Payroll = require('../models/Payroll');

exports.calculatePayroll = async (req, res) => {
  const { month, year } = req.body;

  try {
    // Fetch all employees
    const { data: employees } = await axios.get('http://localhost:5001/api/employees');

    const payrolls = [];

    for (const emp of employees) {
      // Fetch timelogs for the employee for the specified month
      const { data: timelogs } = await axios.get('http://localhost:5006/api/timelogs', {
        params: {
          employeeId: emp.id,
          dateFrom: `${year}-${month}-01`,
          dateTo: `${year}-${month}-31`
        }
      });

      const totalHours = timelogs.reduce((sum, log) => sum + log.hours_worked, 0);

      if (totalHours >= 1) {
        const hourlyRate = emp.baseSalary / 192;
        let finalSalary;

        if (totalHours <= 192) {
          finalSalary = hourlyRate * totalHours;
        } else {
          const overtimeHours = totalHours - 192;
          finalSalary = (hourlyRate * 192) + (hourlyRate * 1.5 * overtimeHours);
        }

        payrolls.push({
          employeeId: emp.id,
          month,
          year,
          baseSalary: emp.baseSalary,
          hoursWorked: totalHours,
          finalSalary
        });
      }
    }

    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




exports.getAll = async (req, res) => {
  try {
    const data = await payrollService.getAllPayrolls();
    res.json(data);
  } catch (err) {
    console.error('Payroll/getAll error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await payrollService.getPayrollById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    res.json(data);
  } catch (err) {
    console.error('Payroll/getById error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const record = await payrollService.generateAndRecordExpense(req.body);
    res.status(201).json(record);
  }  catch (err) {
    console.error('Payroll/create error:', err.stack || err);
    res.status(500).json({ message: 'Failed to create payroll', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await payrollService.updatePayroll(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    console.error('Payroll/update error:', err);
    res.status(400).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await payrollService.deletePayroll(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Payroll/remove error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getByEmployee = async (req, res) => {
  const data = await service.getByEmployee(req.params.employeeId);
  res.json(data);
};

exports.getByMonthYear = async (req, res) => {
  const { month, year } = req.query;
  const data = await service.getByMonthYear(parseInt(month), parseInt(year));
  res.json(data);
};








// const service = require("../services/payrollServices");

// exports.getAll = async (req, res) => {
//   const data = await service.getAll();
//   res.json(data);
// };

// exports.getById = async (req, res) => {
//   const data = await service.getById(req.params.id);
//   if (!data) return res.status(404).json({ message: "Not found" });
//   res.json(data);
// };


// exports.create = async (req, res) => {
//   const created = await service.create(req.body);
//   res.status(201).json(created);
// };

// exports.update = async (req, res) => {
//   const updated = await service.update(req.params.id, req.body);
//   res.json(updated);
// };

// exports.remove = async (req, res) => {
//   await service.remove(req.params.id);
//   res.json({ message: "Deleted" });
// };
