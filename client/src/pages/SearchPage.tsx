import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { recipesCategories } from "../lib/constants";

const SearchPage = () => {
  const [searchFilterData, setSearchFilterData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "",
  });
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm") || "";
    const sortFromUrl = urlParams.get("sort") || "";
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
          `http://localhost:5000/api/recipes/public?${searchQuery}`
        );
        setRecipes(data.recipes);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    };
    fetchResults();
  }, [location.search]);

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
    urlParams.set("category", searchFilterData.category);
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
          >
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
        <button type="submit" className="btn">
          Filter
        </button>
      </form>
    </section>
  );
};

export default SearchPage;
