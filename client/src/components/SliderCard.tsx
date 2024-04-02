interface SliderProps {
  category: {
    name: string;
    image: string;
  };
  fetchRecipesByCategory: (categoryName: string) => void;
}

const SliderCard = ({ category, fetchRecipesByCategory }: SliderProps) => {
  const { name, image } = category;

  const handleClick = () => {
    fetchRecipesByCategory(name);
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-full pt-2 transition border border-gray-100 rounded-md shadow-md cursor-pointer hover:border-gray-400 group"
      onClick={handleClick}
    >
      <div>
        <img
          src={image}
          className="object-cover w-24 h-24 rounded-full select-none"
        />
      </div>
      <div className="my-1">
        <h3 className="font-medium select-none font-primary">{name}</h3>
      </div>
    </div>
  );
};

export default SliderCard;
