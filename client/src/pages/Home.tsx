import { useEffect, useState } from "react";
import CategoriesSlider from "../components/CategoriesSlider";
import axios from "axios";
import { UserRecipe } from "../types";

const Home = () => {
  const [category, setCategory] = useState("all");
  const [recipes, setRecipes] = useState<UserRecipe[]>([]);

  const fetchRecipesByCategory = async (categoryName: string) => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/recipes/category/${categoryName}`
      );
      setRecipes(data);
      setCategory(categoryName);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchAllRecipes = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/recipes/public"
        );
        console.log(data);
        setRecipes(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllRecipes();
  }, []);

  return (
    <section className="mt-[82px] container mx-auto">
      <CategoriesSlider fetchRecipesByCategory={fetchRecipesByCategory} />
      <p className="text-2xl text-red-500">{category} recipes</p>
      {recipes.map((recipe) => (
        <p key={recipe._id}>{recipe.name}</p>
      ))}
    </section>
  );
};

export default Home;
