import { useEffect, useState } from "react";
import CategoriesSlider from "../components/CategoriesSlider";
import axios from "axios";
import { UserRecipe } from "../types";

const Home = () => {
  const [category, setCategory] = useState("all");
  const [recipes, setRecipes] = useState<UserRecipe[]>([]);
  const [fetchByCatErr, setFetchByCatErr] = useState("");

  const fetchRecipesByCategory = async (categoryName: string) => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/recipes/category/${categoryName}`
      );
      setRecipes(data);
      setCategory(categoryName);
      setFetchByCatErr("");
    } catch (err) {
      if (err instanceof axios.AxiosError) {
        if (err.response && err.response.data.message) {
          setFetchByCatErr(err.response.data.message);
        } else {
          setFetchByCatErr("Something went wrong!");
        }
      } else {
        console.error("Unexpected error:", err);
      }
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
      {fetchByCatErr && (
        <div role="alert" className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 stroke-current shrink-0"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{fetchByCatErr}</span>
        </div>
      )}
      <p className="text-2xl text-red-500">{category} recipes</p>
      {recipes.map((recipe) => (
        <p key={recipe._id}>{recipe.name}</p>
      ))}
    </section>
  );
};

export default Home;
