import React, { useEffect, useState } from "react";
import CustomerNavbar from "../components/CustomerNavbar";
import { useOrder } from "../contexts/OrderContext";

export default function CustomerOrders() {
  const { showUserOrder } = useOrder();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState("All");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await showUserOrder();
      setOrders(res.orders);
      setFilteredOrders(res.orders);
    } catch (err) {
      console.error("Failed to load orders:", err);
    }
  };

  const handleFilterChange = (date) => {
    setSelectedDate(date);
    if (date === "All") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) => order.date === date);
      setFilteredOrders(filtered);
    }
  };

  const getTotalPrice = (items) =>
    items.reduce((total, item) => total + item.price * item.quantity, 0);

  const orderDates = ["All", ...new Set(orders.map((order) => order.date))];

  return (
    <div className="min-h-screen bg-white font-[Poppins]">
      <CustomerNavbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-[Poetsen One] text-blue-600 mb-6">
          Your Orders
        </h1>

        {/* Filter Dropdown */}
        <div className="mb-6">
          <label className="text-sm mr-2 text-gray-600">Filter by Date:</label>
          <select
            value={selectedDate}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            {orderDates.map((date, index) => (
              <option key={index} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="p-5 rounded-xl shadow-lg bg-blue-50 border-t-4 border-green-400 flex flex-col justify-between h-full"
              >
                <div className="mb-4">
                  <p className="text-sm text-gray-500">
                    Order ID: #{order.id} <br />
                    Date: {order.date}
                  </p>
                </div>

                {/* Items in the Order */}
                <div className="space-y-4 overflow-auto max-h-96 pr-2">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-4 rounded-lg border shadow-sm"
                    >
                      <div className="flex flex-col items-center">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-40 object-contain rounded-md mb-3"
                        />
                        <h2 className="text-lg font-[Poetsen One] text-green-600 text-center">
                          {item.name}
                        </h2>
                        <p className="text-sm text-gray-700 text-center">
                          {item.description}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          Price: ₱{item.price} × {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-gray-800">
                          Subtotal: ₱{item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="text-right mt-4">
                  <p className="font-bold text-blue-700 text-lg">
                    Total: ₱{getTotalPrice(order.items)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
