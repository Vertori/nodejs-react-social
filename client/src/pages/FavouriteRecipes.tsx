import { UserRecipe } from "../types";
import axios from "axios";
import PublicRecipe from "../components/PublicRecipe";
import { useQuery } from "@tanstack/react-query";

const FavouriteRecipes = () => {
  const {
    data: favouriteRecipesData,
    isLoading: isFavouriteRecipesLoading,
    isError: isFavouriteRecipesError,
  } = useQuery({
    queryKey: ["favouriteRecipes"],
    queryFn: async () => {
      const { data } = await axios.get(
        "http://localhost:5000/api/recipes/favourite"
      );
      return data as UserRecipe[];
    },
  });

  if (isFavouriteRecipesLoading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (isFavouriteRecipesError) {
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {favouriteRecipesData?.map((recipe) => (
          <PublicRecipe recipe={recipe} key={recipe._id} />
        ))}
      </div>
    </div>
  );
};

export default FavouriteRecipes;
