const express    = require('express');
const controller = require('../controllers/employeeController');
const router     = express.Router();
const { auth, checkRole } = require('../middleware/auth');

// Public routes (no auth required)
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.get('/email/:email', controller.getByEmail);

// Protected routes (auth required)
router.post('/', auth, checkRole('Admin'), controller.create);
router.put('/:id', auth, checkRole('Admin'), controller.update);
router.delete('/:id', auth, checkRole('Admin'), controller.remove);

module.exports = router;



// {
//     "_id": {
//       "$oid": "681b51cf513d26867d67c8f2"
//     },
//     "name": "Arul Rajeev",
//     "email": "arulrajeev1@gmail.com",
//     "role": "Employee",
//     "base_salary": 33000,
//     "salary_type": "monthly",
//     "active": true,
//     "createdAt": {
//       "$date": "2025-05-07T12:27:59.723Z"
//     },
//     "updatedAt": {
//       "$date": "2025-05-08T12:55:27.845Z"
//     },
//     "__v": 0
//   }