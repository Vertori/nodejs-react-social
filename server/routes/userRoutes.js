const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
  logoutUser,
} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/logout", logoutUser);

router.get("/current", validateToken, currentUser);

module.exports = router;
