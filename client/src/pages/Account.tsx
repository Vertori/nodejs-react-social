import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { useForm } from "react-hook-form";
import ProfileAvatar from "../components/ProfileAvatar";
import { useState } from "react";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../features/user/userSlice";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { TUpdateAccountSchema, updateAccountSchema } from "../types";

const Account = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<TUpdateAccountSchema>({
    resolver: zodResolver(updateAccountSchema),
    values: {
      username: currentUser?.username ?? "",
      email: currentUser?.email ?? "",
      password: "",
      avatar: currentUser?.avatar ?? "",
    },
  });

  // get only those input values that got changed
  function getDirtyValues<
    DirtyFields extends Record<string, unknown>,
    Values extends Record<keyof DirtyFields, unknown>
  >(dirtyFields: DirtyFields, values: Values): Partial<typeof values> {
    const dirtyValues = Object.keys(dirtyFields).reduce((prev, key) => {
      if (!dirtyFields[key]) return prev;

      return {
        ...prev,
        [key]:
          typeof dirtyFields[key] === "object"
            ? getDirtyValues(
                dirtyFields[key] as DirtyFields,
                values[key] as Values
              )
            : values[key],
      };
    }, {});

    return dirtyValues;
  }

  const handleUserUpdate = async (formData: TUpdateAccountSchema) => {
    const modifiedInputData = getDirtyValues(dirtyFields, formData);
    console.log(modifiedInputData);

    try {
      dispatch(updateUserStart());
      const { data } = await axios.post(
        `http://localhost:5000/api/users/update/${currentUser?._id}`,
        modifiedInputData
      );
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="w-full max-w-xl px-4">
        <h1 className="py-8 text-3xl font-semibold text-center">Account</h1>
        <form
          onSubmit={handleSubmit(handleUserUpdate)}
          className="flex flex-col gap-3"
        >
          <ProfileAvatar
            register={register}
            setValue={setValue}
            setFilePercentage={setFilePercentage}
            setFileUploadError={setFileUploadError}
            currentUser={currentUser}
          />
          <p className="self-center text-sm">
            {fileUploadError ? (
              <span className="text-red-700">
                Error while uploading image (Image has to be less than 2 MBs)
              </span>
            ) : filePercentage > 0 && filePercentage < 100 ? (
              <span className="text-slate-700">{`Uploading ${filePercentage}%`}</span>
            ) : filePercentage === 100 ? (
              <span className="text-green-700">
                Successfully uploaded image!
              </span>
            ) : (
              ""
            )}
          </p>
          <label className="flex items-center gap-2 input input-bordered">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
            </svg>
            <input
              type="text"
              className="grow"
              placeholder="Username"
              id="username"
              {...register("username")}
            />
          </label>
          {errors.username && (
            <p className="text-red-500">{`${errors.username.message}`}</p>
          )}
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
              type="email"
              className="grow"
              placeholder="Email"
              id="email"
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
              id="password"
              {...register("password")}
            />
          </label>
          {errors.password && (
            <p className="text-red-500">{`${errors.password.message}`}</p>
          )}
          <button
            disabled={isSubmitting}
            type="submit"
            className="btn btn-primary"
          >
            Update account
          </button>
        </form>
        {/* account actions buttons */}
        <div className="flex justify-between mt-4">
          <button className="btn btn-error">Delete Account</button>
          <button className="btn btn-warning">Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Account;
