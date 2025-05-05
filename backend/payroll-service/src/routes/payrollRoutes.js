// payroll-service/src/routes/payrollRoutes.js
const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/payrollController');  // exactly this

router.get('/',       controller.getAll);
router.get('/:id',    controller.getById);
router.post('/',      controller.create);
router.put('/:id',    controller.update);
router.delete('/:id', controller.remove);
router.get("/employee/:employeeId", controller.getByEmployee);
router.get("/month-year", controller.getByMonthYear);

module.exports = router;










// const express = require("express");
// const router = express.Router();
// const controller = require("../controller/payrollController");

// router.get("/", controller.getAll);
// router.get("/:id", controller.getById);
// router.post("/", controller.create);
// router.put("/:id", controller.update);
// router.delete("/:id", controller.remove);

// module.exports = router;
