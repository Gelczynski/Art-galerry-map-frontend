import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(false);

  const setUserContext = (user) => {
    // Implement your login logic, set user to true
    setUser(user);
  };

  const logout = () => {
    // Implement your logout logic, set user to false
    setUser(false);
  };

  return (
    <AuthContext.Provider value={{ user, setUserContext, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
