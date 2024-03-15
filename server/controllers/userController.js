const asyncHandler = require("express-async-handler");

const registerUser = asyncHandler(async (req, res) => {
  res.json({ message: "User registered" });
});

const loginUser = asyncHandler(async (req, res) => {
  res.json({ message: "User logged in" });
});

const currentUser = asyncHandler(async (req, res) => {
  res.json({ message: "Current user info" });
});

module.exports = { registerUser, loginUser, currentUser };
