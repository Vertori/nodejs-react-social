import { Link } from "react-router-dom";
import { UserRecipe } from "../types";
import { UseMutationResult } from "@tanstack/react-query";

interface RecipeProps {
  recipe: UserRecipe;
  deleteUsersRecipe: UseMutationResult<UserRecipe, unknown, string, unknown>;
}

const Recipe = ({ recipe, deleteUsersRecipe }: RecipeProps) => {
  return (
    <div
      className="card card-compact max-w-96 w-full bg-base-100 shadow-xl relative"
      key={recipe._id}
    >
      <ul className="menu menu-horizontal bg-base-200 rounded-box absolute top-1 right-1">
        <li>
          <Link
            to={`/recipes/update/${recipe._id}`}
            className="tooltip"
            data-tip="Update"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </Link>
        </li>
        <li>
          <a
            className="tooltip"
            data-tip="Delete"
            onClick={() => deleteUsersRecipe.mutate(recipe._id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </a>
        </li>
      </ul>
      <figure>
        <img src={recipe.imageUrl} alt={`${recipe.name} photo`} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{recipe.name}</h2>
        <p>{recipe.instructions}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary text-white">Let's cook!</button>
        </div>
      </div>
    </div>
  );
};

export default Recipe;
