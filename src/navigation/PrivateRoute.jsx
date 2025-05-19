import React from "react";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }) => {
  const login = localStorage.getItem("login") === "true";
  return login ? children : <Navigate to="/" />;
};
