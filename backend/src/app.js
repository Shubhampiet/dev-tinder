const express = require("express");
const cookieParser = require("cookie-parser");

const authMiddleware = require("./middlewares/auth.middleware");
const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");
const connectionRoutes = require("./routes/connectionRequest.routes");
const feedRoutes = require("./routes/feed.route");

const app = express();
app.use(cookieParser());
//middlewares
app.use(express.json());

//routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", authMiddleware, profileRoutes);
app.use("/api/connection", authMiddleware, connectionRoutes);
app.use("/api", authMiddleware, feedRoutes);
module.exports = app;
