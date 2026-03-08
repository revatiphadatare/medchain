const User = require("../models/User");

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    store: user.store,
    company: user.company,
    companyGstin: user.companyGstin,
  };
  res.status(statusCode).json({ success: true, token, user: userData });
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Please provide email and password" });

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password").populate("store");
    if (!user)
      return res.status(401).json({ success: false, message: "No account found with this email" });
    if (!(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: "Incorrect password" });
    if (!user.isActive)
      return res.status(403).json({ success: false, message: "Account is deactivated. Contact administrator." });

    sendToken(user, 200, res);
  } catch (err) { next(err); }
};

// GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("store");
    res.json({ success: true, user });
  } catch (err) { next(err); }
};

// POST /api/auth/register  (public — self-registration)
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, store, company, companyGstin } = req.body;

    if (!name || !email || !password || !role)
      return res.status(400).json({ success: false, message: "Name, email, password and role are required" });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists)
      return res.status(400).json({ success: false, message: "An account with this email already exists" });

    const allowed = ["super_admin", "store_owner", "pharmacist", "distributor"];
    if (!allowed.includes(role))
      return res.status(400).json({ success: false, message: "Invalid role selected" });

    const data = { name: name.trim(), email: email.toLowerCase().trim(), password, role, phone };
    if (store) data.store = store;
    if (company) data.company = company;
    if (companyGstin) data.companyGstin = companyGstin;

    await User.create(data);

    res.status(201).json({
      success: true,
      message: "Account created successfully! Please login with your credentials.",
    });
  } catch (err) { next(err); }
};
