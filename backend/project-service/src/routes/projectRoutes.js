const express = require('express');
const router = express.Router();
const controller = require('../controllers/projectController');
const { auth, checkRole } = require('../middleware/auth');

// Public routes (no auth required)
router.get("/", controller.getAll);
router.get("/:id", controller.getById);

// Protected routes (Admin only)
router.post("/", auth, checkRole('Admin'), controller.create);
router.put("/:id", auth, checkRole('Admin'), controller.update);
router.delete("/:id", auth, checkRole('Admin'), controller.remove);
router.post('/monthly-income', auth, checkRole('Admin'), controller.calculateMonthlyIncome);

module.exports = router;
