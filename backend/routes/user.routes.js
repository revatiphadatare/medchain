const r = require("express").Router();
const c = require("../controllers/user.controller");
const { protect, authorize } = require("../middleware/auth");
r.use(protect, authorize("super_admin"));
r.get("/",    c.getAll);
r.post("/",   c.create);
r.put("/:id", c.update);
r.patch("/:id/toggle", c.toggleActive);
module.exports = r;
