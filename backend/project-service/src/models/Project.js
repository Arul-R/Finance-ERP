const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  client_id: { type: String, required: true }, // External MS
  start_date: { type: Date, required: true },
  end_date: { type: Date },
  billing_type: { type: String, enum: ['fixed', 'hourly'], required: true },
  total_amount: { type: Number },
  assigned_employees: [{ type: String }], // Employee IDs
  status: { type: String, enum: ['active', 'completed', 'on-hold'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
