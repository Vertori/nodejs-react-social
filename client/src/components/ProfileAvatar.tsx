import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

const ProfileAvatar = ({
  register,
  currentUser,
  setValue,
  setFilePercentage,
  setFileUploadError,
}: {
  register: any;
  currentUser: any;
  setValue: any;
  setFilePercentage: any;
  setFileUploadError: any;
}) => {
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);

  const { ref: registerRef, ...rest } = register("profilePicture");
  const [file, setFile] = useState<File | undefined>(undefined);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleUploadedFile = (e: any) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      setFile(selectedFile);
    }
    const urlImage = URL.createObjectURL(selectedFile);
    setPreview(urlImage);
  };

  const handleFileUpload = (file: File) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name; // generate unique file name
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress));
      },
      (error: any) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setValue("avatar", downloadURL, { shouldDirty: true })
        );
      }
    );
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        {...rest}
        ref={(e) => {
          registerRef(e);
          hiddenInputRef.current = e;
        }}
        onChange={handleUploadedFile}
      />
      <img
        className="self-center object-cover w-24 h-24 rounded-full cursor-pointer"
        onClick={() => hiddenInputRef.current && hiddenInputRef.current.click()}
        src={preview || currentUser?.avatar}
      />
    </>
  );
};

export default ProfileAvatar;
