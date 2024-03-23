import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";

const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);

  const navigate = useNavigate();

  const handleLogout = () => {
    setCookies("access_token", "");
    window.localStorage.removeItem("userID");
    delete axios.defaults.headers.common["Authorization"];
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
          <ul className="px-1 menu menu-horizontal">
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </ul>
      </div>
    </div>
  );
};

export default Navbar;
