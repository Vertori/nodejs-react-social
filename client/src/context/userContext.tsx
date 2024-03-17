import { createContext, useState, useEffect } from "react";

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

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
