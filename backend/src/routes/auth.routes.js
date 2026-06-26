const express = require("express");
const router = express.Router();
const { signUp, signIn, logout } = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/logout", authMiddleware, logout);

module.exports = router;
