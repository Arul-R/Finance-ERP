const mongoose = require('mongoose');
const Project = require('./backend/project-service/src/models/Project');

async function checkActiveProjects() {
  try {
    await mongoose.connect('mongodb://your-server-ip:27017/erp');
    
    const startDate = new Date(2025, 4, 1); // May 1, 2025
    const endDate = new Date(2025, 5, 0); // May 31, 2025
    
    const activeProjects = await Project.find({
      status: 'active',
      $or: [{
        start_date: { $lte: endDate },
        $or: [
          { end_date: { $gte: startDate } },
          { end_date: null }
        ]
      }]
    });
    
    console.log('Active Projects for May 2025:', activeProjects);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkActiveProjects();