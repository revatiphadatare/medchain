const Order   = require("../models/Order");
const Product = require("../models/Product");

exports.getAll = async (req, res, next) => {
  try {
    const { status, storeId, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    // Store owner / pharmacist only see their store's orders
    if (req.user.role === "store_owner" || req.user.role === "pharmacist") {
      filter.store = req.user.store?._id || req.user.store;
    } else if (storeId) {
      filter.store = storeId;
    }

    const orders = await Order.find(filter)
      .populate("store", "name city")
      .populate("placedBy", "name email")
      .populate("items.product", "name category")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Order.countDocuments(filter);
    res.json({ success: true, data: orders, total });
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("store","name city address")
      .populate("placedBy","name email")
      .populate("items.product","name category b2bPrice");
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, data: order });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { items } = req.body;
    // Validate stock and compute total
    let totalAmount = 0;
    const enrichedItems = [];
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ success: false, message: `Product ${item.product} not found` });
      if (product.stock < item.quantity)
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
      enrichedItems.push({ product: product._id, quantity: item.quantity, unitPrice: product.b2bPrice });
      totalAmount += item.quantity * product.b2bPrice;
    }

    const storeId = req.user.store?._id || req.user.store || req.body.store;
    const order = await Order.create({
      store: storeId,
      placedBy: req.user._id,
      items: enrichedItems,
      totalAmount,
      notes: req.body.notes,
    });

    // Deduct stock
    for (const item of enrichedItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    const populated = await order.populate("store","name city");
    res.status(201).json({ success: true, data: populated });
  } catch (err) { next(err); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate("store","name city");
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, data: order });
  } catch (err) { next(err); }
};
