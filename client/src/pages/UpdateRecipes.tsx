import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import {
  RecipeDBType,
  TAddRecipeFormSchema,
  UserRecipe,
  addRecipeFormSchema,
} from "../types";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const UpdateRecipes = () => {
  const [serverErrorMessage, setServerErrorMessage] = useState("");
  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();

  // fetch recipe to update
  const { data } = useQuery({
    queryKey: ["recipeToUpdate"],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:5000/api/recipes/${id}`
      );
      return data;
    },
  });

  // modify ingredients for react hook form standard
  const ingredientsFromAPI = data?.ingredients;
  let transformedIngredients = [];
  if (ingredientsFromAPI) {
    transformedIngredients = ingredientsFromAPI.map((ingredient: string) => ({
      ingredient: ingredient,
    }));
  }

  // form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<TAddRecipeFormSchema>({
    resolver: zodResolver(addRecipeFormSchema),
    values: {
      name: data?.name,
      ingredients: transformedIngredients,
      instructions: data?.instructions,
      imageUrl: data?.imageUrl,
      cookingTime: data?.cookingTime,
      isPublic: data?.isPublic,
    },
  });

  // update recipe api db mutation
  const updateRecipe = useMutation({
    mutationFn: async (recipeData: RecipeDBType) => {
      const { data } = await axios.put(
        `http://localhost:5000/api/recipes/${id}`,
        recipeData,
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
      navigate("/recipes");
    },
  });

  // handle mutate function to add new recipe to db
  const handleUpdateRecipe = (data: TAddRecipeFormSchema) => {
    const ingredientsArray = data.ingredients.map(
      (ingredientObject) => ingredientObject.ingredient
    );
    const newData = { ...data, ingredients: ingredientsArray };
    // console.log(newData);
    updateRecipe.mutate(newData);
  };

  // dynamic ingredients inputs
  const { fields, append, remove } = useFieldArray({
    name: "ingredients",
    control,
  });

  return (
    <div className="flex items-center justify-center w-screen min-h-screen">
      <div className="w-full max-w-xl p-4 overflow-y-auto max-h-[65vh]">
        {serverErrorMessage && (
          <div role="alert" className="my-4 alert alert-error">
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
            <span>{serverErrorMessage}</span>
          </div>
        )}
        <form
          onSubmit={handleSubmit(handleUpdateRecipe)}
          className="flex flex-col gap-2"
        >
          <input
            type="text"
            placeholder="Name"
            className="w-full input input-bordered"
            id="name"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-red-500">{`${errors.name.message}`}</p>
          )}
          {fields.map((field, index) => {
            const errorForField = errors?.ingredients?.[index]?.ingredient;
            return (
              <div key={field.id} className="flex flex-col">
                <div className="flex gap-x-1">
                  <input
                    {...register(`ingredients.${index}.ingredient`)}
                    type="text"
                    className="w-full input input-bordered"
                    placeholder={`Ingredient ${index + 1}`}
                  />
                  <button
                    className="btn btn-circle btn-outline"
                    onClick={() => remove(index)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                {errorForField && (
                  <p className="text-red-500">{`${errorForField?.message}`}</p>
                )}
              </div>
            );
          })}
          <button
            onClick={() => {
              append({
                ingredient: "",
              });
            }}
            className="btn"
            type="button"
          >
            Add Ingredient
          </button>
          <textarea
            className="textarea textarea-bordered text-[1rem]"
            placeholder="Instructions"
            id="instructions"
            {...register("instructions")}
          />
          {errors.instructions && (
            <p className="text-red-500">{`${errors.instructions.message}`}</p>
          )}
          <input
            type="text"
            placeholder="Image URL"
            className="w-full input input-bordered"
            id="imageUrl"
            {...register("imageUrl")}
          />
          {errors.imageUrl && (
            <p className="text-red-500">{`${errors.imageUrl.message}`}</p>
          )}
          <input
            type="number"
            placeholder="Cooking time (minutes)"
            className="w-full input input-bordered"
            {...register("cookingTime")}
          />
          {errors.cookingTime && (
            <p className="text-red-500">{`${errors.cookingTime.message}`}</p>
          )}
          <div className="flex justify-end">
            <label className="cursor-pointer label">
              <span className="mr-2 label-text">
                Do you want to make your recipe public?
              </span>
              <input
                type="checkbox"
                id="isPublic"
                className="checkbox checkbox-primary"
                {...register("isPublic")}
              />
            </label>
          </div>
          <button
            disabled={isSubmitting}
            className="btn btn-primary"
            type="submit"
          >
            Update recipe
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateRecipes;
