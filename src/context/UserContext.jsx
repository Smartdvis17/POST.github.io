/* eslint-disable react-refresh/only-export-components */
//import { UserContext } from "./UserContext";
import { useState } from "react";
import { useEffect } from "react";

import { createContext } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    localStorage.getItem("login") === "true"
      ? setIsLogin(true)
      : setIsLogin(false);
  }, []);

  const value = {
    isLogin,
    setIsLogin,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
