const mongoose = require("mongoose");

const StoreSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  city:     { type: String, required: true },
  gstin:    { type: String, required: true, unique: true },
  phone:    { type: String },
  email:    { type: String },
  address:  { type: String },
  status:   { type: String, enum: ["active","pending","suspended"], default: "pending" },
  joinedAt: { type: Date, default: Date.now },
}, { timestamps: true, toJSON: { virtuals: true } });

StoreSchema.virtual("owner", {
  ref: "User", localField: "_id", foreignField: "store", justOne: true,
});

module.exports = mongoose.model("Store", StoreSchema);
