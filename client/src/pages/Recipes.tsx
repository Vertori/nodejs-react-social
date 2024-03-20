import axios from "axios";
import { useCookies } from "react-cookie";
import { UserRecipe } from "../types";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Recipe from "../components/Recipe";

const Recipes = () => {
  const [cookies] = useCookies(["access_token"]);
  const queryClient = useQueryClient();

  const {
    data: userRecipesData,
    isLoading: UserRecipesLoading,
    isError: UserRecipesError,
  } = useQuery({
    queryKey: ["userRecipes"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:5000/api/recipes", {
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
        },
      });
      console.log(data);
      return data as UserRecipe[];
    },
  });

  const deleteUsersRecipe = useMutation({
    mutationFn: async (recipeId: string) => {
      const { data } = await axios.delete(
        `http://localhost:5000/api/recipes/${recipeId}`,
        {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        }
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {userRecipesData?.map((recipe) => (
          <Recipe recipe={recipe} deleteUsersRecipe={deleteUsersRecipe} />
        ))}
      </div>
    </div>
  );
};

export default Recipes;
