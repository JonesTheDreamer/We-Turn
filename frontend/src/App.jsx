import { BrowserRouter, Route, Routes } from "react-router-dom";
import Wrap from "./contexts/Wrap";
import Login from "./pages/Login";
import CustomerIndex from "./pages/CustomerIndex";
import CustomerCart from "./pages/CustomerCart";
import CustomerOrder from "./pages/CustomerOrder";
import OrderItem from "./pages/OrderItem";
import AdminIndex from "./pages/AdminIndex";
import AdminEditItems from "./pages/AdminEditItems";
import AdminAddItem from "./pages/AdminAddItem";

function App() {
  return (
    <>
      <Wrap>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/customer" element={<CustomerIndex />} />
            <Route path="/customer/cart" element={<CustomerCart />} />
            <Route path="/customer/Checkout" element={<CustomerOrder />} />
            <Route path="/customer/item/:id" element={<OrderItem />} />
            <Route path="/admin" element={<AdminIndex />} />
            <Route path="/admin/items/edit" element={<AdminEditItems />} />
            <Route path="/admin/items/add" element={<AdminAddItem />} />
          </Routes>
        </BrowserRouter>
      </Wrap>
    </>
  );
}

export default App;
