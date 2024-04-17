const asyncHandler = require("express-async-handler");
const Recipe = require("../models/recipeModel");

const HOME_PAGE_SIZE = 10;
const USER_RECIPES_PAGE_SIZE = 8;

// private access - get users recipes
// GET
// /api/recipes
const getRecipes = asyncHandler(async (req, res, next) => {
  const { page = 0 } = req.query;
  try {
    const recipes = await Recipe.find({ user_id: req.user.id }, null, {
      skip: parseInt(page) * USER_RECIPES_PAGE_SIZE,
      limit: USER_RECIPES_PAGE_SIZE,
    }); // get recipes related to the logged in user

    const totalRecipes = await Recipe.countDocuments({ user_id: req.user.id });
    const pages = Math.ceil(totalRecipes / USER_RECIPES_PAGE_SIZE);
    res.status(200).json({ recipes, pages });
  } catch (err) {
    res.status(500);
    next(new Error("Error, couldn't fetch user's recipes!"));
  }
});

// public access - get public recipes
// GET
// /api/recipes/public
const getPublicRecipes = asyncHandler(async (req, res, next) => {
  const { page = 0 } = req.query;
  const sortDirection = req.query.order === "asc" ? 1 : -1;
  const filterCriteria = {
    isPublic: true,
    ...(req.query.category && { category: req.query.category }),
    ...(req.query.searchTerm && {
      $or: [
        { name: { $regex: req.query.searchTerm, $options: "i" } },
        { instructions: { $regex: req.query.searchTerm, $options: "i" } },
      ],
    }),
  };
  try {
    const publicRecipes = await Recipe.find(filterCriteria, null, {
      skip: parseInt(page) * HOME_PAGE_SIZE,
      limit: HOME_PAGE_SIZE,
    }).sort({ updatedAt: sortDirection });

    const totalRecipes = await Recipe.countDocuments(filterCriteria);

    const pages = Math.ceil(totalRecipes / HOME_PAGE_SIZE);
    res.status(200).json({ recipes: publicRecipes, pages });
  } catch (err) {
    res.status(500);
    next(new Error("Error, couldn't fetch public recipes!"));
  }
});

// public access - get recipes by category
// GET
// /api/recipes/category/:category
const getRecipesByCategory = asyncHandler(async (req, res, next) => {
  let categoryName;
  const { page = 0 } = req.query;

  try {
    categoryName = req.params.category;
    const recipes = await Recipe.find(
      {
        category: categoryName,
        isPublic: true,
      },
      null,
      { skip: parseInt(page) * HOME_PAGE_SIZE, limit: HOME_PAGE_SIZE }
    );

    if (recipes.length > 0) {
      const totalRecipes = await Recipe.countDocuments({
        category: categoryName,
        isPublic: true,
      });
      const pages = Math.ceil(totalRecipes / HOME_PAGE_SIZE);
      res.status(200).json({ recipes, pages });
    } else {
      res.status(404);
      next(new Error(`Error, no recipes found for category: ${categoryName}`));
    }
  } catch (err) {
    res.status(500);
    next(
      new Error(`Error, couldn't fetch recipes for category: ${categoryName}`)
    );
  }
});

// private access - get single recipe by its id
// GET
// /api/recipes/:id
const getRecipe = asyncHandler(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    res.status(404);
    next(new Error("Recipe not found!"));
  }
  res.status(200).json(recipe);
});

// private access - create recipe
// POST
// /api/recipes
const createRecipe = asyncHandler(async (req, res, next) => {
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
    next(new Error("All fields are required!"));
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

// private access - update recipe
// PUT
// /api/recipes/:id
const updateRecipe = asyncHandler(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    res.status(404);
    next(new Error("Recipe not found!"));
  }

  // don't allow to update recipe of another user
  if (recipe.user_id.toString() !== req.user.id) {
    res.status(403);
    next(new Error("No permission for updating other users recipes!"));
  }

  const updatedRecipe = await Recipe.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(201).json(updatedRecipe);
});

// private access - delete recipe
// DELETE
// /api/recipes/:id
const deleteRecipe = asyncHandler(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    res.status(404);
    next(new Error("Recipe not found!"));
  }

  // don't allow to delete recipe of another user
  if (recipe.user_id.toString() !== req.user.id) {
    res.status(403);
    next(new Error("No permission for deleting other users recipes!"));
  }

  await Recipe.deleteOne({ _id: req.params.id });

  res.status(201).json(recipe);
});

module.exports = {
  getRecipes,
  getPublicRecipes,
  getRecipesByCategory,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
