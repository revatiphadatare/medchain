const r = require("express").Router();
const c = require("../controllers/inventory.controller");
const { protect } = require("../middleware/auth");
r.use(protect);
r.get("/alerts", c.getAlerts);
r.patch("/:id/stock", c.updateStock);
module.exports = r;
