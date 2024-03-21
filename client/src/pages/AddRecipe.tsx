import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { RecipeDBType, UserRecipe } from "../types";
import { useCookies } from "react-cookie";
import { FieldValues, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const addRecipeFormSchema = z.object({
  name: z.string(),
  ingredients: z.array(
    z.object({
      ingredient: z.string(),
    })
  ),
  instructions: z.string(),
  imageUrl: z.string().url(),
  cookingTime: z.coerce.number().positive(),
});

type TAddRecipeFormSchema = z.infer<typeof addRecipeFormSchema>;

const AddRecipe = () => {
  const [serverErrorMessage, setServerErrorMessage] = useState("");
  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<TAddRecipeFormSchema>({
    resolver: zodResolver(addRecipeFormSchema),
    defaultValues: {
      ingredients: [{ ingredient: "" }, { ingredient: "" }],
    },
  });

  const addNewRecipe = useMutation({
    mutationFn: async (recipeData: RecipeDBType) => {
      const { data } = await axios.post(
        "http://localhost:5000/api/recipes",
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

  const handleAddNewRecipe = (data: TAddRecipeFormSchema) => {
    const ingredientsArray = data.ingredients.map(
      (ingredientObject) => ingredientObject.ingredient
    );
    const newData = { ...data, ingredients: ingredientsArray };
    console.log(newData);
    addNewRecipe.mutate(newData);
  };

  const { fields, append, remove } = useFieldArray({
    name: "ingredients",
    control,
  });

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="w-full max-w-xl px-4">
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
          onSubmit={handleSubmit(handleAddNewRecipe)}
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
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-x-1">
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
          ))}
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
          <button
            disabled={isSubmitting}
            className="btn btn-primary"
            type="submit"
          >
            Add new recipe
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRecipe;
