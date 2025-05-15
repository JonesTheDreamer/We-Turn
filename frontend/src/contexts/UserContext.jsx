import React, { createContext, useState, useContext } from "react";
import axiosInstance from "../axiosInstance";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const register = async (data) => {
    const res = await axiosInstance.post("/register", data);
    return res;
  };

  const login = async (data) => {
    const res = await axiosInstance.post("/login", data);
    return res;
  };

  const logout = async () => {
    await axiosInstance.post("/logout");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
  };

  return (
    <UserContext.Provider value={{ register, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
