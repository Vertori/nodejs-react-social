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

  return (
    <div className="px-8 py-4 shadow-md navbar bg-base-100">
      <div className="flex-1">
        <Link to="/" className="text-xl btn btn-ghost">
          Logo
        </Link>
      </div>
      <div className="flex-none">
        {!cookies.access_token ? (
          <ul className="px-1 menu menu-horizontal">
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </ul>
        ) : (
          <button onClick={handleLogout} className="btn">
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
