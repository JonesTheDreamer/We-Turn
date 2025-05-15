import React from "react";
import { UserProvider } from "./UserContext";
import { CartProvider } from "./CartContext";
import { ItemProvider } from "./ItemContext";
import { OrderProvider } from "./OrderContext";

const Wrap = ({ children }) => {
  return (
    <UserProvider>
      <CartProvider>
        <ItemProvider>
          <OrderProvider>{children}</OrderProvider>
        </ItemProvider>
      </CartProvider>
    </UserProvider>
  );
};

export default Wrap;
