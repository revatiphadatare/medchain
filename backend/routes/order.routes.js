const r = require("express").Router();
const c = require("../controllers/order.controller");
const { protect, authorize } = require("../middleware/auth");
r.use(protect);
r.get("/",   c.getAll);
r.post("/",  authorize("super_admin","store_owner"), c.create);
r.get("/:id", c.getOne);
r.patch("/:id/status", authorize("super_admin","distributor"), c.updateStatus);
module.exports = r;
