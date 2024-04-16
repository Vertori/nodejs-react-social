import axios from "axios";
import {
  deleteUserStart,
  deleteUserSuccess,
  logoutUserFailure,
  logoutUserStart,
  logoutUserSuccess,
} from "../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../app/store";

const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.user);

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      await axios.delete(
        `http://localhost:5000/api/users/delete/${currentUser?._id}`
      );
      dispatch(deleteUserSuccess());
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = async () => {
    try {
      dispatch(logoutUserStart());
      const { data } = await axios.post(
        "http://localhost:5000/api/users/logout"
      );
      if (data.success === false) {
        dispatch(logoutUserFailure(data.message));
        return;
      }
      dispatch(logoutUserSuccess());
      navigate("/login");
    } catch (err) {
      dispatch(logoutUserFailure(err));
    }
  };

  return {
    handleDeleteUser,
    handleLogout,
  };
};

export default useAuth;
