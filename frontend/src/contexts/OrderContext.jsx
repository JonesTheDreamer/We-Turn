import React, { createContext, useContext } from "react";
import axiosInstance from "../axiosInstance";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const getAllOrders = async () => {
    const res = await axiosInstance.get("/orders");
    return res.data;
  };

  const createOrder = async (data) => {
    const res = await axiosInstance.post("/orders", data);
    return res.data;
  };

  const showUserOrder = async () => {
    const res = await axiosInstance.get("/orders/user");
    console.log(res.data);

    return res.data;
  };

  return (
    <OrderContext.Provider value={{ getAllOrders, createOrder, showUserOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
