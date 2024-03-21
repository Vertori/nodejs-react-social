import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import axios from "axios";

const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);

  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("UserContext is not available");
  }

  const { setUser, user } = userContext;

  const navigate = useNavigate();

  const handleLogout = () => {
    setCookies("access_token", "");
    window.localStorage.removeItem("userID");
    delete axios.defaults.headers.common["Authorization"];
    setUser({ auth: false, name: "" });
    navigate("/login");
  };

  const fetchTest = () => {
    axios.get("http://localhost:5000/api/users/current");
  };

  return (
    <div className="fixed top-0 z-50 px-8 py-4 shadow-md navbar bg-base-100">
      <div className="flex-1">
        <Link to="/" className="text-xl btn btn-ghost" onClick={fetchTest}>
          Logo
        </Link>
      </div>
      <div className="flex-none">
        {cookies.access_token && user.auth ? (
          <div className="flex items-center gap-2">
            <p>{user.name}</p>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link to="/recipes" className="justify-between">
                    Recipes
                  </Link>
                </li>
                <li>
                  <Link to="/account">Account</Link>
                </li>
                <li onClick={handleLogout}>
                  <a>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <ul className="px-1 menu menu-horizontal">
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Navbar;
