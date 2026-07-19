const express = require("express");
const router = express.Router();
const {
  connectionRequest,
  connectionResponse,
  viewConnectionRequests,
  viewConnections,
} = require("../controllers/connection.controller");

// Route to send a connection request
router.post("/request/:status/:id", connectionRequest);

// Route to respond to a connection request
router.post("/response/:status/:id", connectionResponse);

// Route to view all connection requests for the authenticated user
router.get("/review", viewConnectionRequests);

// Route to view all accepted connections for the authenticated user
router.get("/list", viewConnections);

module.exports = router;
