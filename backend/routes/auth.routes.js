const router = require("express").Router();
const { login, getMe, register } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth");

router.post("/login",    login);
router.post("/register", register);   // public — no auth needed
router.get("/me",        protect, getMe);

module.exports = router;
