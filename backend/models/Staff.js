const mongoose = require("mongoose");

const StaffSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  role:         { type: String, required: true },
  shift:        { type: String, enum: ["Morning","Evening","Night"], default: "Morning" },
  status:       { type: String, enum: ["on_duty","off_duty"], default: "off_duty" },
  store:        { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
  phone:        { type: String },
  email:        { type: String },
  joinedAt:     { type: Date, default: Date.now },
  monthlySales: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Staff", StaffSchema);
