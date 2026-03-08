const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  product:   { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity:  { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true },
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  orderNo:       { type: String, unique: true },
  store:         { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
  placedBy:      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items:         [OrderItemSchema],
  totalAmount:   { type: Number, required: true },
  status:        { type: String, enum: ["pending","processing","shipped","delivered","cancelled"], default: "pending" },
  paymentStatus: { type: String, enum: ["pending","paid","refunded"], default: "pending" },
  notes:         { type: String },
}, { timestamps: true });

// Auto-generate order number
OrderSchema.pre("save", async function (next) {
  if (!this.orderNo) {
    const count = await mongoose.model("Order").countDocuments();
    this.orderNo = `ORD-${String(2800 + count + 1).padStart(4,"0")}`;
  }
  next();
});

module.exports = mongoose.model("Order", OrderSchema);
