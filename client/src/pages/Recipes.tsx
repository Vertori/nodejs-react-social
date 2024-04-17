import axios from "axios";
import { useCookies } from "react-cookie";
import { UserRecipe } from "../types";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Recipe from "../components/Recipe";
import { useState } from "react";

const Recipes = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(0);

  const {
    data: userRecipesData,
    isLoading: UserRecipesLoading,
    isError: UserRecipesError,
  } = useQuery({
    queryKey: ["userRecipes", currentPage],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:5000/api/recipes?page=${currentPage}`
      );
      return data as { recipes: UserRecipe[]; pages: number };
    },
  });

  const deleteUsersRecipe = useMutation({
    mutationFn: async (recipeId: string) => {
      const { data } = await axios.delete(
        `http://localhost:5000/api/recipes/${recipeId}`
      );
      return data as UserRecipe;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userRecipes"] });
    },
  });

  if (UserRecipesLoading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (UserRecipesError) {
    return (
      <div className="flex items-center justify-center w-screen h-screen px-2">
        <div role="alert" className="max-w-lg alert alert-error">
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
          <span>Something went wrong! Couldn't get your recipes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 px-12 py-4 mt-32">
      <Link to="/recipes/add" className="btn btn-wide">
        Add new recipe
      </Link>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {userRecipesData?.recipes.map((recipe) => (
          <Recipe
            recipe={recipe}
            deleteUsersRecipe={deleteUsersRecipe}
            key={recipe._id}
          />
        ))}
      </div>
      {/* pagination  */}
      <div className="flex justify-center w-full py-10">
        <div className="mx-auto join">
          <button
            className="join-item btn"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 0}
          >
            «
          </button>
          <button className="join-item btn">Page {currentPage + 1}</button>
          <button
            className="join-item btn"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === (userRecipesData?.pages ?? 0) - 1}
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
};

export default Recipes;
