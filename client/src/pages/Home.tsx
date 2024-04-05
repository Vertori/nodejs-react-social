import { useState } from "react";
import CategoriesSlider from "../components/CategoriesSlider";
import axios from "axios";
import { UserRecipe } from "../types";
import PublicRecipe from "../components/PublicRecipe";
import { useQuery } from "@tanstack/react-query";

const Home = () => {
  const [category, setCategory] = useState("");

  const {
    data: categoryRecipes,
    isLoading: categoryRecipesLoading,
    isError: isCategoryRecipesError,
  } = useQuery({
    queryKey: ["categoryRecipes", category],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:5000/api/recipes/category/${category}`
      );
      return data as UserRecipe[];
    },
    enabled: Boolean(category),
  });

  const {
    data: allRecipes,
    isLoading: allRecipesLoading,
    isError: isAllRecipesError,
  } = useQuery({
    queryKey: ["allRecipes"],
    queryFn: async () => {
      const { data } = await axios.get(
        "http://localhost:5000/api/recipes/public"
      );
      return data as UserRecipe[];
    },
  });

  const handleCategoryChange = (categoryName: string) => {
    setCategory(categoryName);
  };

  const recipesToDisplay = category === "" ? allRecipes : categoryRecipes;
  const areRecipesLoading = allRecipesLoading || categoryRecipesLoading;

  return (
    <section className="mt-[82px] container mx-auto px-2">
      <CategoriesSlider handleCategoryChange={handleCategoryChange} />
      <p className="mb-4 text-2xl text-red-500">{category} recipes</p>
      {/* recipes container  */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {recipesToDisplay?.map((recipe) => (
          <PublicRecipe recipe={recipe} key={recipe._id} />
        ))}
      </div>
    </section>
  );
};

export default Home;
