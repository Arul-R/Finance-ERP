const axios = require('axios');
const Payroll = require('../models/Payroll');

const EMPLOYEE_URL = 'http://localhost:5001/api/employees';
const TIMELOG_URL = 'http://localhost:5006/api/timelogs';
const EXPENSE_URL = 'http://localhost:5000/api/expenses';

// Basic CRUD operations
exports.getAllPayrolls = () => Payroll.find().sort({ year: -1, month: -1 });
exports.getPayrollById = id => Payroll.findById(id);
exports.updatePayroll = (id, data) => Payroll.findByIdAndUpdate(id, data, { new: true });
exports.deletePayroll = id => Payroll.findByIdAndDelete(id);
exports.getByEmployee = (employeeId) => Payroll.find({ employeeId });
exports.getByMonthYear = (month, year) => Payroll.find({ month, year });

// Calculate payroll for a specific employee
exports.calculateEmployeePayroll = async (employeeId, month, year) => {
  // Fetch employee details
  const { data: employee } = await axios.get(`${EMPLOYEE_URL}/${employeeId}`);
  if (!employee) {
    throw new Error(`Employee with ID ${employeeId} not found`);
  }

  // Fetch time logs for the employee for the given month
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  
  const { data: timeLogs } = await axios.get(TIMELOG_URL, {
    params: {
      employeeId: employeeId,
      dateFrom: startDate.toISOString(),
      dateTo: endDate.toISOString()
    }
  });

  // Calculate total hours worked
  const totalHours = timeLogs.reduce((sum, log) => sum + log.hours_worked, 0);
  
  // Calculate salary based on hours worked
  const standardHours = 192; // Standard monthly hours
  let finalSalary;
  
  if (employee.salary_type === 'monthly') {
    if (totalHours >= standardHours) {
      finalSalary = employee.base_salary;
      // Add overtime if applicable
      const overtimeHours = totalHours - standardHours;
      const hourlyRate = employee.base_salary / standardHours;
      finalSalary += overtimeHours * hourlyRate * 1.5;
    } else {
      // Prorated salary if less than full hours
      finalSalary = (employee.base_salary / standardHours) * totalHours;
    }
  } else if (employee.salary_type === 'hourly') {
    // For hourly employees
    const regularHours = Math.min(totalHours, standardHours);
    const overtimeHours = Math.max(0, totalHours - standardHours);
    
    finalSalary = (regularHours * employee.base_salary) + 
                  (overtimeHours * employee.base_salary * 1.5);
  }

  return {
    employeeId,
    name: employee.name,
    month,
    year,
    totalHours,
    baseSalary: employee.base_salary,
    finalSalary,
    overtimeHours: Math.max(0, totalHours - standardHours)
  };
};

// Calculate payroll for all employees for a specific month
exports.calculateMonthlyPayroll = async (month, year) => {
  try {
    // Validate month and year
    if (month < 1 || month > 12) {
      throw new Error('Invalid month. Must be between 1 and 12');
    }

    console.log('Calculating payroll for:', { month, year });

    // Get all timelogs for the specified month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    console.log('Fetching timelogs from:', startDate, 'to:', endDate);
    
    const { data: timeLogs } = await axios.get(TIMELOG_URL, {
      params: {
        dateFrom: startDate.toISOString(),
        dateTo: endDate.toISOString()
      }
    });
    
    console.log('Found timelogs:', timeLogs);
    
    if (!timeLogs || timeLogs.length === 0) {
      return {
        payrolls: [],
        totalAmount: 0,
        message: `No timelogs found for ${year}-${month}`
      };
    }

    // Get all employees
    const { data: allEmployees } = await axios.get(EMPLOYEE_URL);
    console.log('Found employees:', allEmployees);
    
    // Map of employee_id to employee details
    const employeeMap = {};
    allEmployees.forEach(emp => {
      employeeMap[emp._id] = emp;
    });
    
    // Group timelogs by employee
    const employeeTimeLogs = {};
    timeLogs.forEach(log => {
      if (!employeeTimeLogs[log.employee_id]) {
        employeeTimeLogs[log.employee_id] = [];
      }
      employeeTimeLogs[log.employee_id].push(log);
    });
    
    console.log('Grouped timelogs by employee:', employeeTimeLogs);
    
    // Calculate payroll for each employee
    const payrolls = [];
    let totalPayrollAmount = 0;
    
    for (const [employeeId, logs] of Object.entries(employeeTimeLogs)) {
      const employee = employeeMap[employeeId];
      if (!employee || !employee.active) continue;
      
      console.log('Processing employee:', employee.name);
      
      const standardHours = 192;
      const totalHours = logs.reduce((sum, log) => sum + log.hours_worked, 0);
      const regularHours = Math.min(totalHours, standardHours);
      const overtimeHours = Math.max(0, totalHours - standardHours);
      
      let finalSalary;
      
      if (employee.salary_type === 'monthly') {
        if (totalHours >= standardHours) {
          finalSalary = employee.base_salary;
          // Add overtime if applicable
          const hourlyRate = employee.base_salary / standardHours;
          finalSalary += overtimeHours * hourlyRate * 1.5;
        } else {
          // Prorated salary if less than full hours
          finalSalary = (employee.base_salary / standardHours) * totalHours;
        }
      } else if (employee.salary_type === 'hourly') {
        finalSalary = (regularHours * employee.base_salary) + 
                      (overtimeHours * employee.base_salary * 1.5);
      }
      
      console.log('Calculated salary:', { 
        employee: employee.name,
        totalHours,
        regularHours,
        overtimeHours,
        finalSalary
      });
      
      try {
        // Create or update payroll record
        const existingPayroll = await Payroll.findOne({
          employeeId,
          month,
          year
        });
        
        let payroll;
        if (existingPayroll) {
          console.log('Updating existing payroll for:', employee.name);
          payroll = await Payroll.findByIdAndUpdate(
            existingPayroll._id,
            {
              baseSalary: employee.base_salary,
              finalSalary,
              status: 'unpaid'
            },
            { new: true }
          );
        } else {
          console.log('Creating new payroll for:', employee.name);
          payroll = await Payroll.create({
            employeeId,
            month,
            year,
            baseSalary: employee.base_salary,
            finalSalary,
            bonus: 0,
            deductions: 0,
            status: 'unpaid'
          });
        }
        
        console.log('Saved payroll record:', payroll);
        
        payrolls.push({
          ...payroll.toObject(),
          finalSalary,
          totalHours,
          regularHours,
          overtimeHours
        });
        
        totalPayrollAmount += finalSalary;
      } catch (error) {
        console.error('Error saving payroll record:', error);
        throw error;
      }
    }
    
    console.log('Final payroll calculation:', {
      totalPayrolls: payrolls.length,
      totalAmount: totalPayrollAmount
    });
    
    return {
      payrolls,
      totalAmount: totalPayrollAmount,
      message: `Successfully calculated payroll for ${year}-${month}`
    };
  } catch (error) {
    console.error('Error calculating monthly payroll:', error);
    throw new Error(`Payroll calculation failed: ${error.message}`);
  }
};

// Generate payroll record and create expense entry
exports.generateAndRecordExpense = async ({
  employeeId,
  month,
  year,
  bonus = 0,
  deductions = 0
}) => {
  // Calculate payroll for employee
  const payrollData = await this.calculateEmployeePayroll(employeeId, month, year);
  const finalSalary = payrollData.finalSalary;
  
  // Create payroll record
  const payroll = await Payroll.create({
    employeeId,
    month,
    year,
    baseSalary: payrollData.baseSalary,
    bonus,
    deductions,
    status: 'unpaid'
  });
  
  // Create expense record
  await axios.post(EXPENSE_URL, {
    type: 'payroll',
    amount: finalSalary,
    description: `Payroll for ${employeeId} ${month}/${year}`,
    date: new Date(year, month - 1, 1),
    employee_id: employeeId
  });
  
  return {
    ...payroll.toObject(),
    finalSalary,
    totalHours: payrollData.totalHours,
    overtimeHours: payrollData.overtimeHours
  };
};