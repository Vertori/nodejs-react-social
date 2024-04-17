import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { recipesCategories } from "../lib/constants";
import PublicRecipe from "../components/PublicRecipe";
import { UserRecipe } from "../types";
import PaginationClassic from "../components/PaginationClassic";

const SearchPage = () => {
  const [searchFilterData, setSearchFilterData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "",
  });
  const [recipes, setRecipes] = useState<UserRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm") || "";
    const sortFromUrl = urlParams.get("sort") || "desc";
    const categoryFromUrl = urlParams.get("category") || "";
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSearchFilterData({
        ...searchFilterData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        const searchQuery = urlParams.toString();
        const { data } = await axios.get(
          `http://localhost:5000/api/recipes/public?${searchQuery}&page=${currentPage}`
        );
        setRecipes(data.recipes);
        setTotalPages(data.pages);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    };
    fetchResults();
  }, [location.search, currentPage]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.target.id === "searchTerm") {
      setSearchFilterData({
        ...searchFilterData,
        searchTerm: e.target.value,
      });
    }
    if (e.target.id === "sort") {
      const order = e.target.value || "desc";
      setSearchFilterData({
        ...searchFilterData,
        sort: order,
      });
    }
    if (e.target.id === "category") {
      const category = e.target.value || "";
      setSearchFilterData({
        ...searchFilterData,
        category,
      });
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchFilterData.searchTerm);
    if (searchFilterData.category) {
      urlParams.set("category", searchFilterData.category);
    }
    urlParams.set("sort", searchFilterData.sort);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <section className="container px-2 mx-auto mt-36">
      <form
        className="flex flex-col gap-x-8 gap-y-4 md:flex-row"
        onSubmit={handleFormSubmit}
      >
        {/* search term  */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="searchTerm"
            className="font-semibold font-primary whitespace-nowrap"
          >
            Search term
          </label>
          <input
            type="text"
            id="searchTerm"
            placeholder="Search term"
            className="w-full max-w-xs input input-bordered"
            value={searchFilterData.searchTerm}
            onChange={handleInputChange}
          />
        </div>
        {/* category  */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="category"
            className="font-semibold font-primary whitespace-nowrap"
          >
            Category
          </label>
          <select
            className="w-full max-w-xs select select-bordered"
            id="category"
            onChange={handleInputChange}
            value={searchFilterData.category || ""}
          >
            <option disabled selected></option>
            {recipesCategories.map((category, index) => (
              <option key={index} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        {/* sort  */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="sort"
            className="font-semibold font-primary whitespace-nowrap"
          >
            Sort
          </label>
          <select
            className="w-full max-w-xs select select-bordered"
            id="sort"
            onChange={handleInputChange}
            value={searchFilterData.sort}
          >
            <option value="desc">Latest</option>
            <option value="asc">Oldest</option>
          </select>
        </div>
        <button type="submit" className="md:self-end btn">
          Filter
        </button>
      </form>
      <div className="w-full mt-12 ">
        <h1 className="pb-2 text-xl font-medium border-b border-gray-300 font-primary">
          Searched results
        </h1>
        <div className="grid grid-cols-1 gap-3 mt-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {!loading && recipes.length === 0 && (
            <p className="text-xl text-gray-500 font-primary">
              No recipes found.
            </p>
          )}
          {loading && (
            <span className="loading loading-spinner loading-md"></span>
          )}
          {!loading &&
            recipes &&
            recipes.map((recipe) => (
              <PublicRecipe recipe={recipe} key={recipe._id} />
            ))}
        </div>
      </div>
      {/* pagination  */}
      <PaginationClassic
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </section>
  );
};

export default SearchPage;
