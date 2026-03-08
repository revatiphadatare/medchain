const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  category:   { type: String, required: true },
  stock:      { type: Number, required: true, default: 0 },
  b2bPrice:   { type: Number, required: true },
  mrp:        { type: Number, required: true },
  supplier:   { type: String, required: true },
  expiryDate: { type: Date, required: true },
  batchNo:    { type: String, required: true },
  status:     { type: String, enum: ["in_stock","low_stock","out_of_stock"], default: "in_stock" },
  description:{ type: String },
}, { timestamps: true });

// Auto-update status based on stock
ProductSchema.pre("save", function (next) {
  if (this.stock === 0) this.status = "out_of_stock";
  else if (this.stock < 200) this.status = "low_stock";
  else this.status = "in_stock";
  next();
});

module.exports = mongoose.model("Product", ProductSchema);
