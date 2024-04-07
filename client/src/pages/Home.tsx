import { useState } from "react";
import CategoriesSlider from "../components/CategoriesSlider";
import axios from "axios";
import { UserRecipe } from "../types";
import PublicRecipe from "../components/PublicRecipe";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { setPage } from "../features/category/categorySlice";

const Home = () => {
  const dispatch = useDispatch();
  const category = useSelector((state: RootState) => state.category.category);
  const page = useSelector((state: RootState) => state.category.page);
  const [totalPages, setTotalPages] = useState(0);

  const {
    data: categoryRecipes,
    isLoading: categoryRecipesLoading,
    isError: isCategoryRecipesError,
  } = useQuery({
    queryKey: ["categoryRecipes", category, page],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:5000/api/recipes/category/${category}`
      );
      setTotalPages(data.pages);
      return data as { recipes: UserRecipe[]; pages: number };
    },
    enabled: Boolean(category),
  });

  const {
    data: allRecipes,
    isLoading: allRecipesLoading,
    isError: isAllRecipesError,
  } = useQuery({
    queryKey: ["allRecipes", page],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:5000/api/recipes/public?page=${page}`
      );
      setTotalPages(data.pages);
      return data as { recipes: UserRecipe[]; pages: number };
    },
  });

  const recipesToDisplay =
    category === "" ? allRecipes?.recipes : categoryRecipes?.recipes;
  const areRecipesLoading = allRecipesLoading || categoryRecipesLoading;

  return (
    <section className="mt-[82px] container mx-auto px-2">
      <CategoriesSlider />
      <p className="mb-4 text-2xl text-red-500">{category} recipes</p>
      {/* recipes container  */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {recipesToDisplay?.map((recipe) => (
          <PublicRecipe recipe={recipe} key={recipe._id} />
        ))}
      </div>
      {/* pagination  */}
      <div className="flex justify-center w-full py-10">
        <div className="mx-auto join">
          <button
            className="join-item btn"
            disabled={page === 0}
            onClick={() => dispatch(setPage(page - 1))}
          >
            «
          </button>
          <button className="join-item btn">Page {page + 1}</button>
          <button
            className="join-item btn"
            disabled={page === totalPages - 1}
            onClick={() => dispatch(setPage(page + 1))}
          >
            »
          </button>
        </div>
      </div>
    </section>
  );
};

export default Home;
