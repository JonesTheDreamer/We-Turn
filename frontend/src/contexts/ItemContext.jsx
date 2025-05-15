import React, { createContext, useContext } from "react";
import axiosInstance from "../axiosInstance";

export const ItemContext = createContext();

export const ItemProvider = ({ children }) => {
  const getAllItems = async () => {
    const res = await axiosInstance.get("/items");
    return res.data;
  };

  const getItem = async (id) => {
    const res = await axiosInstance.get(`/items/${id}`);
    return res.data;
  };

  const createItem = async (data) => {
    const res = await axiosInstance.post("/items", data);
    return res.data;
  };

  const updateItem = async (id, data) => {
    const res = await axiosInstance.post(`/items/${id}?_method=PUT`, data); // form data support
    return res.data;
  };

  const deleteItem = async (id) => {
    const res = await axiosInstance.delete(`/items/${id}`);
    return res.data;
  };

  return (
    <ItemContext.Provider
      value={{ getAllItems, createItem, getItem, updateItem, deleteItem }}
    >
      {children}
    </ItemContext.Provider>
  );
};

export const useItem = () => useContext(ItemContext);
