const TimeLog = require('../models/TimeLog');


const getFiltered = async (filter) => {
  return TimeLog.find(filter).sort({ date: -1 });
};

module.exports = {
  getFiltered
};

const createBulk = async (entries) => {
    return TimeLog.insertMany(entries);
  };
  
  module.exports = {
    getFiltered,
    createBulk
  };
