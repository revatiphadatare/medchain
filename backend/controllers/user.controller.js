const User = require("../models/User");

exports.getAll = async (req, res, next) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter).populate("store","name city").sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    const populated = await User.findById(user._id).populate("store","name city");
    res.status(201).json({ success: true, data: populated });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const { password, ...rest } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, rest, { new: true }).populate("store","name city");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

exports.toggleActive = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};
