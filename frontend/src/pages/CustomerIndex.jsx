import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerNavbar from "../components/CustomerNavbar";
import { useItem } from "../contexts/ItemContext";
import { useUser } from "../contexts/UserContext";

export default function CustomerIndex() {
  const { getAllItems } = useItem();
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // useEffect(() => {
  //   // if (!sessionStorage.getItem("token") || user.role === "customer") {
  //   //   navigate("/");
  //   // }
  //   console.log(user);
  // }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getAllItems();
        setItems(response);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      }
    };
    fetchItems();
    console.log(sessionStorage.getItem("token"));
  }, []);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen font-[Poppins]">
      {/* Navbar */}
      <CustomerNavbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-green-600 mb-6 font-[Poetsen One]">
          Welcome to We Turn!
        </h1>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search for a game..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/customer/item/${item.id}`)}
              className="relative h-64 rounded-xl cursor-pointer overflow-hidden shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
              style={{
                backgroundImage: `url(${item.image_url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black/30 backdrop-invert backdrop-opacity-10 flex flex-col justify-end p-4 text-white">
                <h2 className="text-lg font-semibold font-[Poetsen One]">
                  {item.name}
                </h2>
                <p className="text-sm mb-1">{item.description}</p>
                <p className="text-sm text-blue-200">Stock: {item.stock}</p>
              </div>
              <p className="absolute text-sm right-[1rem] top-[1rem] text-green-300 font-bold text-[2rem]">
                P {item.price}
              </p>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <p className="text-gray-500 mt-8 text-center">
            No items match your search.
          </p>
        )}
      </div>
    </div>
  );
}
