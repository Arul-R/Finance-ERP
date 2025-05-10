const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);
router.post('/monthly-income', projectController.calculateMonthlyIncome);

module.exports = router;
