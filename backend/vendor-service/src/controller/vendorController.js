const Vendor = require('../model/vendor');

// Create
exports.createVendor = async (req, res) => {
  try {
    const vendor = new Vendor(req.body);
    await vendor.save();
    res.status(201).json(vendor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All
exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get One
exports.getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
exports.updateVendor = async (req, res) => {
  try {
    req.body.updatedAt = new Date();
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete
exports.deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json({ message: 'Vendor deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.recordVendorPayment = async (req, res) => {
  const { id: vendorId } = req.params;
  const { amount, date = new Date().toISOString(), description = '' } = req.body;

  // Validate
  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Must provide a positive numeric amount' });
  }

  try {
    // 1) Ensure vendor exists
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });

    // 2) Push to Expenses MS
    const EXPENSES_URL = 'http://localhost:5005/api/expenses';
    const expensePayload = {
      type:        'vendor',
      amount,
      description: description || `Payment to vendor ${vendor.name}`,
      date,
      vendor_id:   vendorId
    };

    const response = await axios.post(EXPENSES_URL, expensePayload);

    // 3) Return the created expense object (from Expenses MS)
    return res.status(response.status).json(response.data);

  } catch (err) {
    console.error('recordVendorPayment error:', err.message || err);
    const status = err.response?.status || 500;
    const msg    = err.response?.data || { error: err.message || 'Unknown error' };
    return res.status(status).json(msg);
  }
};