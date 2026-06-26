const { validateUserProfileData } = require("../utils/validate");
const bcrypt = require("bcryptjs");

const profileView = (req, res) => {
  try {
    const user = req.user; // Access the authenticated user from the request object
    res.status(200).json({
      message: "Profile retrieved successfully",
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving profile",
      error: error.message,
    });
  }
};

const profileUpdate = async (req, res) => {
  try {
    const user = req.user; // Access the authenticated user from the request object
    const { firstName, lastName, age, bio, avatar } = req.body;

    //check for allowed fields
    const allowedFields = ["firstName", "lastName", "age", "bio", "avatar"];
    const updateFields = Object.keys(req.body);

    const isValidOperation = updateFields.every((field) =>
      allowedFields.includes(field),
    );
    if (!isValidOperation) {
      return res.status(400).json({ error: "Invalid updates!" });
    }

    // validate the input data
    const { valid, errors } = validateUserProfileData({
      firstName,
      lastName,
      age,
      bio,
      avatar,
    });

    if (!valid) {
      return res.status(400).json({ errors });
    }

    // Update the user's profile fields
    updateFields.forEach((field) => {
      user[field] = req.body[field];
    });

    await user.save(); // Save the updated user document

    res.status(200).json({
      message: `${firstName} ${lastName}, your profile has been updated successfully`,
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating profile",
      error: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const user = req.user; // Access the authenticated user from the request object
    const { currentPassword, newPassword } = req.body;
    console.log("changePassword called", currentPassword, newPassword);

    // Validate the input data
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Current and new passwords are required" });
    }

    // Check if the current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;

    await user.save(); // Save the updated user document

    res.status(200).json({
      message: "Password has been changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error changing password",
      error: error.message,
    });
  }
};

module.exports = {
  profileView,
  profileUpdate,
  changePassword,
};
