const express = require('express');
const router = express.Router();
const vendorController = require('../controller/vendorController');

// Create a new vendor
router.post('/', vendorController.createVendor);

// Get all vendors
router.get('/', vendorController.getAllVendors);

// Get a single vendor by ID
router.get('/:id', vendorController.getVendorById);

// Update a vendor by ID
router.put('/:id', vendorController.updateVendor);

// Delete a vendor by ID
router.delete('/:id', vendorController.deleteVendor);

+// Record a payment to this vendor (and push an expense)
router.post('/:id/payments', vendorController.recordVendorPayment);

module.exports = router;
