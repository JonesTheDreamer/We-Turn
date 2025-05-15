import React, { useEffect, useState } from "react";
import { useItem } from "../contexts/ItemContext";
import { useOrder } from "../contexts/OrderContext";
import AdminNavbar from "../components/AdminNavbar";

const AdminIndex = () => {
  const { getAllItems, updateItem, deleteItem } = useItem();
  const { getAllOrders } = useOrder();

  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [uploaded, setUploaded] = useState(null);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderFilter, setOrderFilter] = useState("All");

  useEffect(() => {
    loadItems();
    loadOrders();
  }, []);

  const loadItems = async () => {
    const res = await getAllItems();
    setItems(res);
    setSelectedItem(res[0]);
  };

  const loadOrders = async () => {
    const res = await getAllOrders();
    setOrders(res.orders);
  };

  const handleUpdate = async () => {
    const data = new FormData();
    for (const key in selectedItem) {
      if (selectedItem[key] !== null) {
        data.append(key, selectedItem[key]);
      }
    }

    if (uploaded !== null) {
      data.set("image", uploaded);
    } else {
      data.delete("image");
    }

    await updateItem(selectedItem.id, data);
    alert("Item Updated");
    // loadItems();
    window.location.reload();
  };

  const handleDelete = async () => {
    await deleteItem(selectedItem.id);
    loadItems();
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = orders.filter(
    (order) => orderFilter === "All" || order.date === orderFilter
  );

  const uniqueOrderDates = [
    "All",
    ...new Set(orders.map((order) => order.date)),
  ];

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-white p-6 text-black font-poppins px-[20vw]">
        {/* Orders Section */}
        <div>
          <h2 className="text-2xl font-bold text-green-600 mb-4">All Orders</h2>
          <select
            value={orderFilter}
            onChange={(e) => setOrderFilter(e.target.value)}
            className="mb-4 p-2 border rounded"
          >
            {uniqueOrderDates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-blue-50 p-4 rounded-lg shadow-md"
              >
                <h3 className="font-bold text-blue-600 text-lg mb-2">
                  Order Date: {order.date}
                </h3>
                <p className="text-sm text-gray-700 mb-1">
                  Customer: {order.user.name}
                </p>
                <p className="text-sm text-gray-500 mb-2">{order.user.email}</p>
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 mb-4 bg-white p-2 rounded"
                  >
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-24 w-24 object-cover"
                    />
                    <div>
                      <h4 className="font-[Poetsen_One] text-green-600">
                        {item.name}
                      </h4>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: ₱{item.price}</p>
                      <p>Total: ₱{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
                <p className="font-semibold text-right">
                  Total Order Price: ₱
                  {order.items.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminIndex;
