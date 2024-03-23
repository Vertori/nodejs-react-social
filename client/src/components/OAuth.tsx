import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { app } from "../firebase";
import axios from "axios";
import { UseDispatch, useDispatch } from "react-redux";
import { signInSuccess } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const { data } = await axios.post(
        "http://localhost:5000/api/users/google",
        {
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (err) {
      console.log(`Couldn't login with Google, error: ${err}`);
    }
  };

  return (
    <div>
      <button
        className="flex w-full btn"
        type="button"
        onClick={handleGoogleLogin}
      >
        <FcGoogle className="text-2xl" />
        Continue with Google
      </button>
    </div>
  );
};

export default OAuth;
