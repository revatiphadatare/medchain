const Store = require("../models/Store");
const User  = require("../models/User");
const Order = require("../models/Order");

exports.getAll = async (req, res, next) => {
  try {
    const { status, city, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (city) filter.city = new RegExp(city, "i");
    if (search) filter.name = new RegExp(search, "i");

    const stores = await Store.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Attach owner and order stats
    const enriched = await Promise.all(stores.map(async (s) => {
      const [owner, orderStats] = await Promise.all([
        User.findOne({ store: s._id, role: "store_owner" }).select("name email phone"),
        Order.aggregate([
          { $match: { store: s._id } },
          { $group: { _id: null, total: { $sum: "$totalAmount" }, count: { $sum: 1 } } }
        ])
      ]);
      return {
        ...s.toObject(),
        owner,
        totalOrders: orderStats[0]?.count || 0,
        totalRevenue: orderStats[0]?.total || 0,
      };
    }));

    const total = await Store.countDocuments(filter);
    res.json({ success: true, data: enriched, total, page: Number(page) });
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ success: false, message: "Store not found" });
    res.json({ success: true, data: store });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const store = await Store.create(req.body);
    res.status(201).json({ success: true, data: store });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const store = await Store.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!store) return res.status(404).json({ success: false, message: "Store not found" });
    res.json({ success: true, data: store });
  } catch (err) { next(err); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const store = await Store.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ success: true, data: store });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await Store.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Store deleted" });
  } catch (err) { next(err); }
};
