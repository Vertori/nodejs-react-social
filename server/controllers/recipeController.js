const asyncHandler = require("express-async-handler");
const Recipe = require("../models/recipeModel");

//private access
const getRecipes = asyncHandler(async (req, res) => {
  const recipes = await Recipe.find({ user_id: req.user.id }); // get contacts related to the logged in user
  res.status(200).json(recipes);
});

//private access
const getRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    res.status(404);
    throw new Error("Recipe not found!");
  }
  res.status(200).json(recipe);
});

//private access
const createRecipe = asyncHandler(async (req, res) => {
  const { name, ingredients, instructions, imageUrl, cookingTime } = req.body;
  if (!name || !ingredients || !instructions || !imageUrl || !cookingTime) {
    res.status(400);
    throw new Error("All fields are required!");
  }
  const recipe = await Recipe.create({
    name,
    ingredients,
    instructions,
    imageUrl,
    cookingTime,
    user_id: req.user.id,
  });
  res.status(201).json(recipe);
});

//private access
const updateRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    res.status(404);
    throw new Error("Recipe not found!");
  }

  // don't allow to update recipe of another user
  if (recipe.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("No permission for updating other users recipes!");
  }

  const updatedRecipe = await Recipe.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(201).json(updatedRecipe);
});

//private access
const deleteRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    res.status(404);
    throw new Error("Recipe not found!");
  }

  // don't allow to delete recipe of another user
  if (recipe.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("No permission for deleting other users recipes!");
  }

  await Recipe.deleteOne({ _id: req.params.id });

  res.status(201).json(recipe);
});

module.exports = {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
