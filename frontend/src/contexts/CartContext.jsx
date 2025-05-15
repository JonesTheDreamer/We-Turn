import React, { createContext, useContext } from "react";
import axiosInstance from "../axiosInstance";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const getAllCarts = async () => {
    const res = await axiosInstance.get("/carts");
    return res.data;
  };

  const createCart = async (data) => {
    const res = await axiosInstance.post("/carts", data);
    return res.data;
  };

  const getACart = async (id) => {
    const res = await axiosInstance.get(`/carts/${id}`);
    return res.data;
  };

  const updateCart = async (id, data) => {
    const res = await axiosInstance.put(`/carts/${id}`, data);
    return res.data;
  };

  const deleteCart = async (id) => {
    const res = await axiosInstance.delete(`/carts/${id}`);
    return res.data;
  };

  return (
    <CartContext.Provider
      value={{ getAllCarts, createCart, getACart, updateCart, deleteCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
