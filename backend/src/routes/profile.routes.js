const express = require("express");
const router = express.Router();
const {
  profileView,
  profileUpdate,
  changePassword,
} = require("../controllers/profile.controller");

router.get("/view", profileView);
router.patch("/update", profileUpdate);
router.put("/change-password", changePassword);

module.exports = router;
