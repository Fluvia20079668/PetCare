//reates a React Authentication Context so the 
// rest of your app can know whether a user is logged in, 
// who the user is, and how to log in or out.
import { createContext, useState} from "react";
//create authcontext that can be used throughout to acess authentication data
export const AuthContext = createContext();
//wraps  the app to provide autentication state
export const AuthProvider = ({ children }) => {
  //check user exits in localstarage --// allows the user to stay logged
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
//make sure the user logged in across the app
  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
