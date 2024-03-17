import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";

const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
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
          <button className="btn">Logout</button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
