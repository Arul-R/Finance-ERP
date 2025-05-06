const express    = require('express');
const controller = require('../controllers/expenseController');
const router     = express.Router();

router.post('/payroll', controller.getMonthlyPayrollExpense);
router.get('/',      controller.getAll);
router.get('/:id',   controller.getById);
router.post('/',     controller.create);
router.put('/:id',   controller.update);
router.delete('/:id',controller.remove);

module.exports = router;






// const express    = require('express');
// const router     = express.Router();
// const controller = require('../controllers/expenseController');

// router.get('/',      controller.getAll);
// router.get('/:id',   controller.getById);
// router.post('/',     controller.create);
// router.put('/:id',   controller.update);
// router.delete('/:id',controller.remove);

// module.exports = router;
