import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { handleLogout } = useAuth();

  return (
    <header className="fixed top-0 z-50 px-8 py-4 bg-base-100 navbar">
      <div className="container mx-auto">
        <div className="flex-1">
          <Link to="/" className="text-xl btn btn-ghost">
            Logo
          </Link>
        </div>
        <div className="flex-none">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <p>{currentUser.username}</p>
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-10 rounded-full">
                    <img alt="User avatar" src={currentUser.avatar} />
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
    </header>
  );
};

export default Navbar;
