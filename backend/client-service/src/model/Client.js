const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  industry: { type: String },
  address: { type: String },
  poc_name: { type: String, required: true },
  poc_email: { type: String, required: true },
  poc_phone: { type: String },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
}, { timestamps: true });

module.exports = mongoose.model("Client", clientSchema);
