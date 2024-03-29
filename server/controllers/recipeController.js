const asyncHandler = require("express-async-handler");
const Recipe = require("../models/recipeModel");

//private access - get users recipes
const getRecipes = asyncHandler(async (req, res) => {
  try {
    const recipes = await Recipe.find({ user_id: req.user.id }); // get recipes related to the logged in user
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500);
    throw new Error("Error, couldn't fetch user's recipes!");
  }
});

//get public recipes
const getPublicRecipes = asyncHandler(async (req, res) => {
  try {
    const publicRecipes = await Recipe.find({ isPublic: true });
    res.status(200).json(publicRecipes);
  } catch (err) {
    res.status(500);
    throw new Error("Error, couldn't fetch public recipes!");
  }
});

//private access - get single recipe by its id
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
  const {
    name,
    category,
    ingredients,
    instructions,
    imageUrl,
    cookingTime,
    isPublic,
  } = req.body;
  if (
    !name ||
    !category ||
    !ingredients ||
    !instructions ||
    !imageUrl ||
    !cookingTime
  ) {
    res.status(400);
    throw new Error("All fields are required!");
  }
  const recipe = await Recipe.create({
    name,
    category,
    ingredients,
    instructions,
    imageUrl,
    cookingTime,
    isPublic,
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
  getPublicRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
