const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
  logoutUser,
  loginWithGoogle,
  updateUser,
  deleteUser,
  saveRecipe,
  deleteSavedRecipe,
} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.post("/google", loginWithGoogle);

router.post("/saveRecipe/:recipeId", validateToken, saveRecipe);

router.delete("/deleteSavedRecipe/:recipeId", validateToken, deleteSavedRecipe);

router.post("/update/:id", validateToken, updateUser);

router.delete("/delete/:id", validateToken, deleteUser);

router.get("/current", validateToken, currentUser);

module.exports = router;
