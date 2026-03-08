const Product = require("../models/Product");

// GET /api/inventory/alerts
exports.getAlerts = async (req, res, next) => {
  try {
    const thirtyDays = new Date();
    thirtyDays.setDate(thirtyDays.getDate() + 30);

    const [lowStock, outOfStock, expiringSoon] = await Promise.all([
      Product.find({ status: "low_stock" }),
      Product.find({ status: "out_of_stock" }),
      Product.find({ expiryDate: { $lte: thirtyDays }, stock: { $gt: 0 } }),
    ]);

    res.json({ success: true, data: { lowStock, outOfStock, expiringSoon } });
  } catch (err) { next(err); }
};

// PATCH /api/inventory/:id/stock
exports.updateStock = async (req, res, next) => {
  try {
    const { stock } = req.body;
    const p = await Product.findByIdAndUpdate(req.params.id, { stock }, { new: true, runValidators: true });
    if (!p) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, data: p });
  } catch (err) { next(err); }
};
