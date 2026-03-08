const r = require("express").Router();
const c = require("../controllers/prescription.controller");
const { protect, authorize } = require("../middleware/auth");
r.use(protect);
r.get("/",    authorize("super_admin","pharmacist"), c.getAll);
r.post("/",   authorize("pharmacist"), c.create);
r.patch("/:id/verify", authorize("pharmacist","super_admin"), c.verify);
module.exports = r;
