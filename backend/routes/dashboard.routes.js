const r = require("express").Router();
const c = require("../controllers/dashboard.controller");
const { protect, authorize } = require("../middleware/auth");
r.use(protect);
r.get("/super-admin",  authorize("super_admin"),  c.superAdminStats);
r.get("/store-owner",  authorize("store_owner"),   c.storeOwnerStats);
r.get("/pharmacist",   authorize("pharmacist"),    c.pharmacistStats);
r.get("/distributor",  authorize("distributor"),   c.distributorStats);
module.exports = r;
