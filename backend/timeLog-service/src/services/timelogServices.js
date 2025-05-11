const TimeLog = require('../models/TimeLog');

// Get all timelogs with optional filtering
exports.getFiltered = async (filter) => {
  return TimeLog.find(filter).sort({ date: -1 });
};

// Create multiple timelog entries at once
exports.createBulk = async (entries) => {
  return TimeLog.insertMany(entries);
};

// Get all employees who logged time in a specific month/year with their total hours
exports.getLoggedEmployeesWithHours = async (month, year) => {
  try {
    // Validate month and year
    if (month < 1 || month > 12) {
      throw new Error('Invalid month. Must be between 1 and 12');
    }

    // Set the start date to the first day of the month
    const dateFrom = new Date(year, month - 1, 1);
    // Set the end date to the last day of the month
    const dateTo = new Date(year, month, 0);

    console.log(`Searching timelogs from ${dateFrom.toISOString()} to ${dateTo.toISOString()}`);

    // First, let's check what timelogs we have in the database
    const allLogs = await TimeLog.find({
      date: { $gte: dateFrom, $lte: dateTo }
    });
    
    console.log('Found timelogs:', allLogs.map(log => ({
      date: log.date,
      employee_id: log.employee_id,
      hours: log.hours_worked
    })));

    const result = await TimeLog.aggregate([
      {
        $match: {
          date: { $gte: dateFrom, $lte: dateTo }
        }
      },
      {
        $group: {
          _id: '$employee_id',
          hours_worked: { $sum: '$hours_worked' }
        }
      },
      {
        $match: {
          hours_worked: { $gte: 1 }
        }
      },
      {
        $project: {
          employee_id: '$_id',
          hours_worked: 1,
          _id: 0
        }
      }
    ]);

    console.log(`Found ${result.length} employees with logged hours:`, result);
    return result;
  } catch (error) {
    console.error('Error in getLoggedEmployeesWithHours:', error);
    throw error;
  }
};

// Basic CRUD operations
exports.getAllTimeLogs = () => TimeLog.find().sort({ date: -1 });
exports.getTimeLogById = id => TimeLog.findById(id);
exports.createTimeLog = data => TimeLog.create(data);
exports.updateTimeLog = (id, data) => TimeLog.findByIdAndUpdate(id, data, { new: true });
exports.deleteTimeLog = id => TimeLog.findByIdAndDelete(id);









// const TimeLog = require('../models/TimeLog');


// const getFiltered = async (filter) => {
//   return TimeLog.find(filter).sort({ date: -1 });
// };

// module.exports = {
//   getFiltered
// };

// const createBulk = async (entries) => {
//     return TimeLog.insertMany(entries);
//   };
  
//   module.exports = {
//     getFiltered,
//     createBulk
//   };
