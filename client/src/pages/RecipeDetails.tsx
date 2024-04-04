import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserRecipe } from "../types";

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
    <div className="mt-[82px] container mx-auto px-2">
      <img
        src={recipeDetails?.imageUrl}
        className="w-full h-[300px] object-cover"
      />
    </div>
  );
};

export default RecipeDetails;
