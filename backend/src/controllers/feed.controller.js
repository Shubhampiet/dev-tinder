const Connection = require("../models/connection.model");
const User = require("../models/user.model");

const feed = async (req, res) => {
  const user = req.user;
  const page = req.query.page || 1
  const limit = req.query.limit || 10
  try {
    // Fetch all connections for logged in user
    const connections = await Connection.find({
      $or: [{ fromUserId: user._id }, { toUserId: user._id }],
    }).select("fromUserId toUserId");

    // Fetch all users except the logged in user and their connections

    const hideUserIds = new Set();
    hideUserIds.add(user._id.toString());

    connections.forEach((conn) => {
      hideUserIds.add(conn.fromUserId.toString());
      hideUserIds.add(conn.toUserId.toString());
    });

    console.log("hideUserIds", hideUserIds);

    const feedUsers = await User.find({
      _id: { $nin: Array.from(hideUserIds) },
    }).skip((page-1)*limit).limit(limit);
    console.log("feedUsers", feedUsers);
    res.status(200).json({
      message: "Feed retrieved successfully",
      users: feedUsers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving feed",
      error: error.message,
    });
  }
};

const userSearch = async (req, res) => {
  const user = req.user;
  const targetUserEmail = req.params.email;
  try {
    const targetUser = await User.findOne({ email: targetUserEmail });

    res.status(200).json({
      message: "Success",
      targetUser: targetUser,
    });
  } catch (error) {
    res.send(500).json({
      message: "Error in user search",
      error: error.message,
    });
  }
};

module.exports = {
  feed,
  userSearch,
};
