const Product = require("../models/Product");

exports.getAll = async (req, res, next) => {
  try {
    const { status, category, search, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = new RegExp(category, "i");
    if (search) filter.name = new RegExp(search, "i");

    const products = await Product.find(filter)
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);
    res.json({ success: true, data: products, total });
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, data: p });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const p = await Product.create(req.body);
    res.status(201).json({ success: true, data: p });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!p) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, data: p });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Product deleted" });
  } catch (err) { next(err); }
};

exports.getCategories = async (req, res, next) => {
  try {
    const cats = await Product.distinct("category");
    res.json({ success: true, data: cats });
  } catch (err) { next(err); }
};
