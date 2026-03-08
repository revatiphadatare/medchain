const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  password:     { type: String, required: true, select: false },
  role:         { type: String, enum: ["super_admin","store_owner","pharmacist","distributor"], required: true },
  phone:        { type: String },
  avatar:       { type: String },
  store:        { type: mongoose.Schema.Types.ObjectId, ref: "Store", default: null },
  company:      { type: String },
  companyGstin: { type: String },
  isActive:     { type: Boolean, default: true },
}, { timestamps: true });

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

UserSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model("User", UserSchema);
