import React from "react";
import { Navigate } from "react-router-dom";

export const PublicRoute = ({ children }) => {
  const login = localStorage.getItem("login") === "true";
  return login ? <Navigate to="/post" /> : children;
};
