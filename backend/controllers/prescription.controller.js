const Prescription = require("../models/Prescription");

exports.getAll = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role === "pharmacist") filter.store = req.user.store?._id || req.user.store;
    if (req.query.status) filter.status = req.query.status;
    const rxs = await Prescription.find(filter)
      .populate("store","name")
      .populate("verifiedBy","name")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: rxs });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const storeId = req.user.store?._id || req.user.store || req.body.store;
    const rx = await Prescription.create({ ...req.body, store: storeId });
    res.status(201).json({ success: true, data: rx });
  } catch (err) { next(err); }
};

exports.verify = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const rx = await Prescription.findByIdAndUpdate(
      req.params.id,
      { status, notes, verifiedBy: req.user._id },
      { new: true }
    ).populate("verifiedBy","name");
    if (!rx) return res.status(404).json({ success: false, message: "Prescription not found" });
    res.json({ success: true, data: rx });
  } catch (err) { next(err); }
};
