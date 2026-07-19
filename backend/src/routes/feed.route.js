const express = require("express");
const router = express.Router();
const { feed, userSearch } = require("../controllers/feed.controller");

router.get("/feed", feed);
router.get("/search/:email", userSearch);

module.exports = router;
