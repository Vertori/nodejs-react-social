const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "Recipe name is required"],
    },
    ingredients: [
      {
        type: String,
        required: [true, "Ingredients are required"],
      },
    ],
    instructions: {
      type: String,
      required: [true, "Instructions are required"],
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
    },
    cookingTime: {
      type: Number,
      required: [true, "Cooking time is required"],
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Recipe = mongoose.model("Recipe", recipeSchema);
module.exports = Recipe;
