const express = require("express");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");

const app = express();
app.use(cookieParser());
//middlewares
app.use(express.json());

//routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

module.exports = app;
