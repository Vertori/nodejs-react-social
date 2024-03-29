import { Link } from "react-router-dom";
import { UserRecipe } from "../types";
import { UseMutationResult } from "@tanstack/react-query";
import { IoBookOutline } from "react-icons/io5";
import { BsClock } from "react-icons/bs";

interface RecipeProps {
  recipe: UserRecipe;
  deleteUsersRecipe: UseMutationResult<UserRecipe, unknown, string, unknown>;
}

const Recipe = ({ recipe, deleteUsersRecipe }: RecipeProps) => {
  return (
    <div
      className="relative w-full shadow-xl card card-compact max-w-96 bg-base-100"
      key={recipe._id}
    >
      <ul className="absolute menu menu-horizontal bg-base-200 rounded-box top-1 right-1">
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
        <img
          src={recipe.imageUrl}
          alt={`${recipe.name} photo`}
          className="h-[300px] w-full object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{recipe.name}</h2>
        <p className="break-words">
          {recipe.instructions.slice(0, 50) + "..."}
        </p>
        <div className="justify-end card-actions">
          {/* The button to open modal */}
          <label
            htmlFor={`my_modal_${recipe._id}`}
            className="btn btn-primary"
            onClick={() => console.log(recipe.name)}
          >
            Let's cook!
          </label>

          {/* Put this part before </body> tag */}
          <input
            type="checkbox"
            id={`my_modal_${recipe._id}`}
            className="modal-toggle"
          />
          <div className="modal " role="dialog">
            <div className="w-11/12 max-w-5xl modal-box">
              <div>
                <img
                  src={recipe.imageUrl}
                  className="h-[300px] w-full object-cover"
                />
              </div>
              <h1 className="mt-2 text-2xl font-bold">{recipe.name}</h1>
              <div className="divider" />
              {/* main info  */}
              <div className="flex justify-start gap-4">
                {/* cooking time */}
                <div className="flex flex-col items-start justify-center text-base gap-x-2">
                  <div className="flex items-center justify-center gap-x-2">
                    <BsClock />
                    <span className="font-bold text-blue-700">
                      {recipe.cookingTime}
                    </span>
                  </div>
                  <span className="text-lg">Minutes</span>
                </div>
                {/* ingredients amount */}
                <div className="flex flex-col items-start justify-center text-base gap-x-2">
                  <div className="flex items-center justify-center gap-x-2">
                    <IoBookOutline />
                    <span className="font-bold text-blue-700">
                      {recipe.ingredients.length}
                    </span>
                  </div>
                  <span className="text-lg">Ingredients</span>
                </div>
              </div>
              <div className="divider" />
              {/*  ingredients */}
              <div>
                <h3 className="text-lg text-blue-700">Ingredients</h3>
                <ul className="list-disc">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
              <div className="divider" />
              {/* instructions  */}
              <h4 className="text-lg text-blue-700">Instructions</h4>
              <div className="">
                <p className="break-words">{recipe.instructions}</p>
              </div>
            </div>
            <label
              className="modal-backdrop"
              htmlFor={`my_modal_${recipe._id}`}
            >
              Close
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recipe;
