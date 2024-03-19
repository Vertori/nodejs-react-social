const express = require("express");
const router = express.Router();
const {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require("../controllers/recipeController");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken); // validating middleware (checking token) for all of the recipe routes
router.route("/").get(getRecipes).post(createRecipe);
router.route("/:id").get(getRecipe).put(updateRecipe).delete(deleteRecipe);

module.exports = router;
