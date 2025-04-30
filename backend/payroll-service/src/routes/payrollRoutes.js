const express = require("express");
const router = express.Router();
const controller = require("../controllers/payrollController");

router.get("/", controller.getAll);
router.get("/employee/:employeeId", controller.getByEmployee);
router.get("/month-year", controller.getByMonthYear);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
