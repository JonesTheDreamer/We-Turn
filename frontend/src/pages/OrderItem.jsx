import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CustomerNavbar from "../components/CustomerNavbar";
import { useItem } from "../contexts/ItemContext";
import { useCart } from "../contexts/CartContext";

const OrderItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getItem } = useItem();
  const { createCart } = useCart();

  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await getItem(id);
        setItem(response);
      } catch (err) {
        setError("Failed to load item.");
      }
    };

    fetchItem();
  }, [id]);

  const handleAddToCart = async () => {
    if (!quantity || quantity < 1 || quantity > item.stock) {
      setError("Quantity must be between 1 and the available stock.");
      return;
    }

    try {
      await createCart({ item_id: item.id, quantity });
      navigate("/customer/cart");
    } catch (err) {
      setError("Failed to add item to cart.");
    }
  };

  if (!item) {
    return (
      <div className="bg-white min-h-screen font-[Poppins]">
        <CustomerNavbar />
        <div className="text-center pt-20 text-red-500 font-semibold">
          Loading item...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-[Poppins]">
      <CustomerNavbar />

      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-10 items-center">
        {/* Item Image */}
        <div className="w-full md:w-1/2">
          <img
            src={item.image_url}
            alt={item.name}
            className="rounded-lg shadow-lg w-full object-cover h-[400px]"
          />
        </div>

        {/* Item Details */}
        <div className="w-full md:w-1/2 space-y-4">
          <h1 className="text-3xl text-green-600 font-bold font-[Poetsen One]">
            {item.name}
          </h1>
          <p className="text-gray-700 text-sm">{item.description}</p>
          <p className="text-blue-600 font-semibold">₱{item.price}</p>
          <p className="text-green-700 font-medium">
            Available Stock: {item.stock}
          </p>

          <div className="flex items-center gap-4 mt-4">
            <label className="text-sm font-medium">Quantity:</label>
            <input
              type="number"
              min="1"
              max={item.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 px-2 py-1 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleAddToCart}
            className="mt-6 bg-green-400 hover:bg-green-500 text-white px-6 py-2 rounded-lg shadow-md transition-all font-semibold"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
