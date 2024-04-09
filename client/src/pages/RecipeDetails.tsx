import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserRecipe } from "../types";
import { BsClock } from "react-icons/bs";
import { IoBookOutline } from "react-icons/io5";
import { GiForkKnifeSpoon } from "react-icons/gi";

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipeDetails, setRecipeDetails] = useState<UserRecipe | null>(null);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      const { data } = await axios.get(
        `http://localhost:5000/api/recipes/${id}`
      );
      setRecipeDetails(data);
    };
    fetchRecipeDetails();
  }, [id]);

  return (
    <div className="mt-[82px] container mx-auto px-3 md:px-0 py-6">
      <div className="flex flex-col items-center justify-center gap-10">
        <img
          src={recipeDetails?.imageUrl}
          className="w-full h-[300px] object-cover"
        />
        <h1 className="text-4xl font-semibold text-center font-primary">
          {recipeDetails?.name}
        </h1>
        {/* recipe details stats  */}
        <div className="grid-rows-3 shadow md:grid-rows-1 stats ">
          {/* cooking time  */}
          <div className="stat">
            <div className="stat-figure text-secondary">
              <BsClock className="text-2xl" />
            </div>
            <div className="stat-title">Cooking Time</div>
            <div className="stat-value">{recipeDetails?.cookingTime} min</div>
          </div>
          {/* ingredients  */}
          <div className="stat">
            <div className="stat-figure text-secondary">
              <IoBookOutline className="text-2xl" />
            </div>
            <div className="stat-title">Ingredients</div>
            <div className="stat-value">
              {recipeDetails?.ingredients.length}
            </div>
          </div>
          {/* servings  */}
          <div className="stat">
            <div className="stat-figure text-secondary">
              <GiForkKnifeSpoon className="text-2xl" />
            </div>
            <div className="stat-title">Servings</div>
            <div className="stat-value">4</div>
          </div>
        </div>
        {/* recipe instructions container */}
        <div className="flex flex-col gap-8 mt-8 lg:flex-row">
          {/* ingredients  */}
          <div className="flex flex-col items-center flex-1 lg:border-r-2 ">
            <h2 className="mb-6 text-2xl font-medium border-b-2 font-primary">
              Ingredients
            </h2>
            {recipeDetails?.ingredients.map((ingredient) => (
              <p className="mb-3 text-center font-primary">{ingredient}</p>
            ))}
          </div>
          {/* instructions  */}
          <div className="flex flex-col items-center flex-1">
            <h2 className="mb-6 text-2xl font-medium border-b-2 font-primary">
              Instructions
            </h2>
            <p className="leading-loose text-center font-primary">
              {recipeDetails?.instructions}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
