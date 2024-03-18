import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { useCookies } from "react-cookie";

interface User {
  auth: boolean;
  name: string;
}

interface UserContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

export const UserContext = createContext<UserContextType | null>(null);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState({
    auth: false,
    name: "",
  });

  const [cookies] = useCookies(["access_token"]);

  useEffect(() => {
    const refreshCurrentUser = async () => {
      if (!user.auth && user.name === "") {
        try {
          const response = await axios.get(
            "http://localhost:5000/api/users/current",
            {
              headers: {
                Authorization: `Bearer ${cookies.access_token}`,
              },
            }
          );
          setUser({
            auth: true,
            name: response.data.username,
          });
        } catch (err) {
          console.log(err);
        }
      }
    };
    refreshCurrentUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
