const User = require("../models/user.model");

const [
  generateAccessToken,
  generateRefreshToken,
] = require("../utils/generateToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validateSignUpData } = require("../utils/validate");

const signUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Validate the input data
    const { valid, errors } = validateSignUpData({
      firstName,
      lastName,
      email,
      password,
    });
    if (!valid) {
      return res.status(400).json({ errors });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    // Generate token
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    console.log("refreshToken", refreshToken);

    //save refresh token in db
    user.refreshToken = refreshToken;
    await user.save();

    //send tokens
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    //send response
    const registeredUser = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    res.status(201).json({
      message: "User registered successfully",
      data: registeredUser,
    });
  } catch (error) {
    console.error("Error during sign up:", error);
    res.status(500).json({ error: "Server error" });
  }
};

//Sign In Controller
const signIn = async (req, res) => {
  const { email, password } = req.body;
  console.log("SignIn called", req.body);
  // Check if user exists
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    console.log("User found", user.password, password);
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate token
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    //save refresh token in db
    user.refreshToken = refreshToken;
    await user.save();

    //send tokens
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "User signed in successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error during sign in:", error);
    res.status(500).json({ error: "Server error" });
  }
};

//refresh token controller

const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    const previousToken = await User.previousToken;
    if (!token === previousToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Generate token
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    //save refresh token in db
    user.refreshToken = refreshToken;
    await user.save();

    //send tokens
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "User signed in successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Authorization failed",
      error: error.message,
    });
  }
};

//logout controller
const logout = async (req, res) => {
  try {
    user.refreshToken = null;
    await user.save();
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Log out failed",
      error: error.message,
    });
  }
};

module.exports = {
  signUp,
  signIn,
  logout,
  refreshToken,
};
