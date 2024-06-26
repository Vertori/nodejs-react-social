import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TLoginSchema, loginSchema } from "../types";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../features/user/userSlice";
import { AppDispatch, RootState } from "../app/store";
import OAuth from "../components/OAuth";
import signBg from "../assets/signBg.avif";

const Login = () => {
  const [serverErrorMessage, setServerErrorMessage] = useState("");
  // const { loading, error } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const loginUser = async (data: TLoginSchema) => {
    try {
      dispatch(signInStart());
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        data
      );
      if (response.data.success === false) {
        dispatch(signInFailure(response.data.message));
      }
      dispatch(signInSuccess(response.data));
      navigate("/");
    } catch (err) {
      if (err instanceof axios.AxiosError) {
        if (err.response && err.response.data.message) {
          setServerErrorMessage(err.response.data.message);
        } else {
          setServerErrorMessage("Something went wrong!");
        }
      } else {
        console.error("Unexpected error:", err);
      }
      dispatch(signInFailure("Login error!"));
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <img className="absolute object-cover w-full h-full" src={signBg} />
      <div className="fixed top-0 left-0 w-full h-screen bg-black/60" />
      <div className="z-40 w-full max-w-xl mx-4">
        <div className="px-8 py-12 bg-white rounded-xl">
          {serverErrorMessage && (
            <div role="alert" className="my-4 alert alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 stroke-current shrink-0"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{serverErrorMessage}</span>
            </div>
          )}
          <form
            className="flex flex-col gap-2"
            onSubmit={handleSubmit(loginUser)}
          >
            <label className="flex items-center gap-2 input input-bordered">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
              </svg>
              <input
                type="text"
                className="grow"
                placeholder="Email"
                {...register("email")}
              />
            </label>
            {errors.email && (
              <p className="text-red-500">{`${errors.email.message}`}</p>
            )}
            <label className="flex items-center gap-2 input input-bordered">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="password"
                className="grow"
                placeholder="Password"
                {...register("password")}
              />
            </label>
            {errors.password && (
              <p className="text-red-500">{`${errors.password.message}`}</p>
            )}
            <button disabled={isSubmitting} className="btn btn-primary">
              Login user
            </button>
          </form>
          {/* divider  */}
          <div className="w-full max-w-xl mx-auto divider">OR</div>
          {/* login with google button  */}
          <OAuth />
        </div>
      </div>
    </div>
  );
};

export default Login;
