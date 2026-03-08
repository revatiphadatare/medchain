const Staff = require("../models/Staff");

const storeFilter = (req) =>
  req.user.role === "super_admin" ? {} : { store: req.user.store?._id || req.user.store };

exports.getAll = async (req, res, next) => {
  try {
    const staff = await Staff.find(storeFilter(req)).populate("store","name city");
    res.json({ success: true, data: staff });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const storeId = req.user.store?._id || req.user.store || req.body.store;
    const s = await Staff.create({ ...req.body, store: storeId });
    res.status(201).json({ success: true, data: s });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const s = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!s) return res.status(404).json({ success: false, message: "Staff not found" });
    res.json({ success: true, data: s });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await Staff.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Staff removed" });
  } catch (err) { next(err); }
};
