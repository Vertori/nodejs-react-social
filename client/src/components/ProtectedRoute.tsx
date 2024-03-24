import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
