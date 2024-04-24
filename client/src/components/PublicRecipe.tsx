import { AiOutlineClockCircle } from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { UserRecipe } from "../types";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { updateUserSuccess } from "../features/user/userSlice";

interface PublicRecipeProps {
  recipe: UserRecipe;
}

const PublicRecipe = ({ recipe }: PublicRecipeProps) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const isRecipeSaved = currentUser?.savedRecipes.includes(recipe._id);

  const handleHeartClick = async (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isRecipeSaved) {
      try {
        await axios.post(
          `http://localhost:5000/api/users/saveRecipe/${recipe._id}`
        );

        const updatedUser = {
          ...currentUser,
          savedRecipes: [...(currentUser?.savedRecipes || []), recipe._id],
        };

        dispatch(updateUserSuccess(updatedUser));
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <Link to={`/recipe/${recipe._id}`}>
      <div key={recipe._id} className="shadow-lg cursor-pointer group">
        <div className="relative overflow-hidden transition duration-500 ease-in-out">
          <span
            className="absolute z-10 flex items-center justify-center p-2 bg-white rounded-full right-2 top-2 hover:text-red-500"
            onClick={handleHeartClick}
          >
            <FaHeart
              className={`text-xl transition ${
                isRecipeSaved ? "text-red-500" : ""
              }`}
            />
          </span>
          <img
            src={recipe.imageUrl}
            className="object-cover w-full h-48 duration-300 ease-in-out group-hover:rotate-6 group-hover:scale-125"
          />
        </div>
        <div className="p-2 hover:">
          <h4 className="font-medium font-primary">{recipe.name}</h4>
          <p className="flex items-center gap-2 text-base font-primary">
            <AiOutlineClockCircle className="text-[#ef4444]" />
            <span>{recipe.cookingTime} min</span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default PublicRecipe;
