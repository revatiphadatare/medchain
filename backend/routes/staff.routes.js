const r = require("express").Router();
const c = require("../controllers/staff.controller");
const { protect, authorize } = require("../middleware/auth");
r.use(protect);
r.get("/",    authorize("super_admin","store_owner"), c.getAll);
r.post("/",   authorize("super_admin","store_owner"), c.create);
r.put("/:id", authorize("super_admin","store_owner"), c.update);
r.delete("/:id", authorize("super_admin","store_owner"), c.remove);
module.exports = r;
