const Connection = require("../models/connection.model");

const connectionRequest = async (req, res) => {
  
  try {
    const toUserId = req.params.id;
    const fromUserId = req.user._id;

    //check if toUser exists in the database
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // console.log("user",req.user, "fromUserId:", fromUserId, "status:", req.params.status);

    if (toUserId === fromUserId) {
      return res
        .status(400)
        .json({ message: "You cannot send a connection request to yourself" });
    }

    const allowerdStatuses = ["interested", "ignored"];

    if (!allowerdStatuses.includes(req.params.status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Check if a connection request already exists between the two users
    const existingConnection = await Connection.findOne({
      $or: [
        { fromUserId: fromUserId, toUserId: toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    console.log("existingConnection", existingConnection);

    if (existingConnection) {
      return res
        .status(400)
        .json({ message: "Connection request already exists" });
    }

    // Create a new connection request
    const newConnection = new Connection({
      fromUserId: fromUserId,
      toUserId: toUserId,
      status: req.params.status,
    });
    await newConnection.save();
    res.status(201).json({
      message: "Connection request sent successfully",
      connection: newConnection,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error sending connection request",
      error: error.message,
    });
  }
};

const connectionResponse = async (req, res) => {
  try {
    const allowerdStatuses = ["accepted", "rejected"];

    if (!allowerdStatuses.includes(req.params.status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const toUserId = req.user._id;
    const fromUserId = req.params.id;

    // Check if fromUser exists in the database
    const fromUser = await User.findById(fromUserId);
    if (!fromUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if toUser is trying to respond to their own connection request
    if (toUserId.toString() === fromUserId) {
      return res.status(400).json({ message: "You cannot be your own friend" });
    }

    // Search for the existing connection request
    const existingConnection = await Connection.findOne({
      fromUserId: fromUserId,
      toUserId: toUserId,
    });

    if (!existingConnection) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    // Update the status of the connection request
    existingConnection.status = req.params.status;
    await existingConnection.save();

    res.status(200).json({
      message: `Connection request ${req.params.status} successfully`,
      connection: existingConnection,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error responding to connection request",
      error: error.message,
    });
  }
};

const viewConnectionRequests = async (req, res) => {
  try {
    const toUserId = req.user._id;

    // Fetch all connection requests for the user with status "interested"
    const connectionRequests = await Connection.find({
      toUserId,
      status: "interested",
    }).populate("fromUserId", "firstName lastName age bio avatar");
    res.status(200).json({ connectionRequests });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving connection requests",
      error: error.message,
    });
  }
};

const viewConnections = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all accepted connections for the user
    const connections = await Connection.find({
        $or: [{ fromUserId: userId }, { toUserId: userId }],
        status: "accepted",
      })
      .populate("fromUserId", "firstName lastName age bio avatar")
      .populate("toUserId", "firstName lastName age bio avatar");

      // Filter out the connectons for other users
      const filteredConnections = connections.map((connection) => {
        if (connection.fromUserId._id.toString() === userId.toString()) {
          return connection.toUserId;
        } else {
          return connection.fromUserId;
        }
      });

    res.status(200).json({ connections: filteredConnections });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving connections",
      error: error.message,
    });
  }
}

module.exports = {
  connectionRequest,
  connectionResponse,
  viewConnectionRequests,
  viewConnections
};
