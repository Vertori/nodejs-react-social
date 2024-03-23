const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
  logoutUser,
  loginWithGoogle,
} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/logout", logoutUser);

router.post("/google", loginWithGoogle);

router.get("/current", validateToken, currentUser);

module.exports = router;
