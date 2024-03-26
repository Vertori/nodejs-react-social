const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are required!");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered!");
  }
  //hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });
  console.log(`Usere created: ${user}`);
  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
  res.json({ message: "User registered" });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are required!");
  }
  const user = await User.findOne({ email });
  // compare password with hashed password
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "55m" }
    );
    const { password, ...responseUser } = user._doc;
    res
      .status(200)
      .cookie("access_token", accessToken, { httpOnly: true })
      .json(responseUser);
  } else {
    res.status(401);
    throw new Error("Email or password is not valid");
  }
});

const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

const logoutUser = asyncHandler(async (req, res) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out!");
  } catch (err) {
    res.status(500);
    throw new Error(`Couldn't logout user, error: ${err}`);
  }
});

const loginWithGoogle = asyncHandler(async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN_SECRET
      );
      const { password, ...responseUser } = user._doc;
      return res
        .status(200)
        .cookie("access_token", accessToken, { httpOnly: true })
        .json(responseUser);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const accessToken = jwt.sign(
        { id: newUser._id },
        process.env.ACCESS_TOKEN_SECRET
      );
      const { password, ...responseUser } = newUser._doc;
      return res
        .status(200)
        .cookie("access_token", accessToken, { httpOnly: true })
        .json(responseUser);
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

const updateUser = asyncHandler(async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    res.status(401);
    throw new Error("You can only update your own account!");
  }

  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (err) {
    res.status(500);
    throw new Error(`Error happened while trying to update your account!`);
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  if (req.user.id !== req.params.id) {
    res.status(401);
    throw new Error("You can only delete your own account!");
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token")
    res.status(200).json({ message: "User has been deleted!" });
  } catch (err) {
    res.status(500);
    throw new Error(`Error happened while trying to delete your account!`);
  }
});

module.exports = {
  registerUser,
  loginUser,
  loginWithGoogle,
  logoutUser,
  currentUser,
  updateUser,
  deleteUser,
};
