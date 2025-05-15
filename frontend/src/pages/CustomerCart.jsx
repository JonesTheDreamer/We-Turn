import React, { useEffect, useState } from "react";
import CustomerNavbar from "../components/CustomerNavbar";
import { useCart } from "../contexts/CartContext";
import { useOrder } from "../contexts/OrderContext";

export default function CustomerCart() {
  const { getAllCarts, updateCart, deleteCart } = useCart();
  const { createOrder } = useOrder();

  const [carts, setCarts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCarts();
  }, []);

  const fetchCarts = async () => {
    setLoading(true);
    try {
      const res = await getAllCarts();
      setCarts(res.carts);
      setSelected(res.carts.map((c) => ({ id: c.id, checked: true })));
    } catch (err) {
      console.error("Error fetching carts", err);
    }
    setLoading(false);
  };

  const handleQuantityChange = async (cartId, delta, current, stock) => {
    const newQty = current + delta;
    if (newQty < 1 || newQty > stock) return;
    try {
      await updateCart(cartId, { quantity: newQty });
      setCarts((prev) =>
        prev.map((c) => (c.id === cartId ? { ...c, quantity: newQty } : c))
      );
    } catch (err) {
      console.error("Quantity update failed", err);
    }
  };

  const handleDelete = async (cartId) => {
    try {
      await deleteCart(cartId);
      setCarts((prev) => prev.filter((c) => c.id !== cartId));
      setSelected((prev) => prev.filter((s) => s.id !== cartId));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleCheckboxToggle = (cartId) => {
    setSelected((prev) =>
      prev.map((s) => (s.id === cartId ? { ...s, checked: !s.checked } : s))
    );
  };

  const handleOrder = async () => {
    const selectedIds = selected.filter((s) => s.checked).map((s) => s.id);
    if (selectedIds.length === 0) return alert("No items selected for order.");

    try {
      await createOrder({ cart_ids: selectedIds });
      fetchCarts(); // refresh
      alert("Order successful!");
    } catch (err) {
      console.error("Order failed", err);
      alert("Order failed.");
    }
  };

  const isSelected = (id) => selected.find((s) => s.id === id)?.checked;

  const total = carts.reduce((sum, c) => {
    const included = isSelected(c.id);
    return included ? sum + c.quantity * c.item.price : sum;
  }, 0);

  return (
    <div className="min-h-screen bg-white font-[Poppins] text-gray-800">
      <CustomerNavbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-[Poetsen One] text-blue-600 mb-6">
          Your Cart
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : carts.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-6">
              {carts.map((cart) => (
                <div
                  key={cart.id}
                  className="flex items-center gap-4 p-4 bg-blue-50 rounded shadow"
                >
                  <input
                    type="checkbox"
                    checked={isSelected(cart.id)}
                    onChange={() => handleCheckboxToggle(cart.id)}
                    className="w-5 h-5 text-green-500"
                  />
                  <img
                    src={cart.image_url}
                    alt={cart.item.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h2 className="text-lg font-[Poetsen One] text-green-600">
                      {cart.item.name}
                    </h2>
                    <p className="text-sm text-gray-700">
                      {cart.item.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      Price: ₱{cart.item.price} | Stock left: {cart.item.stock}
                    </p>
                    <div className="flex items-center mt-2 gap-2 justify-self-end">
                      <button
                        className="px-2 py-1 bg-green-300 hover:bg-green-400 rounded"
                        onClick={() =>
                          handleQuantityChange(
                            cart.id,
                            -1,
                            cart.quantity,
                            cart.item.stock
                          )
                        }
                      >
                        -
                      </button>
                      <p className="w-8 text-center font-semibold">
                        {cart.quantity}
                      </p>
                      <button
                        className="px-2 py-1 bg-green-300 hover:bg-green-400 rounded"
                        onClick={() =>
                          handleQuantityChange(
                            cart.id,
                            1,
                            cart.quantity,
                            cart.item.stock
                          )
                        }
                      >
                        +
                      </button>
                      <button
                        className="ml-4 px-3 py-1 bg-red-400 hover:bg-red-500 text-white rounded"
                        onClick={() => handleDelete(cart.id)}
                      >
                        Delete
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 mt-1 text-end">
                      Total: ₱{cart.quantity * cart.item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t pt-4 flex justify-between items-center">
              <h2 className="text-xl font-[Poetsen One] text-blue-600">
                Total: ₱{total}
              </h2>
              <button
                className="px-6 py-2 bg-green-400 hover:bg-green-500 text-white font-bold rounded"
                onClick={handleOrder}
              >
                Order
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
