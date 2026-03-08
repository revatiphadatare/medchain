const mongoose = require("mongoose");

const PrescriptionSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  medicine:    { type: String, required: true },
  doctor:      { type: String, required: true },
  store:       { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
  verifiedBy:  { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status:      { type: String, enum: ["pending","approved","rejected"], default: "pending" },
  quantity:    { type: Number, required: true },
  notes:       { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Prescription", PrescriptionSchema);
