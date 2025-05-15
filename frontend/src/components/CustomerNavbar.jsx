import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext, useUser } from "../contexts/UserContext";

const CustomerNavbar = () => {
  const { logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img
            src="https://png.pngtree.com/png-clipart/20250125/original/pngtree-monopoly-character-clipart-illustration-png-image_20040958.png"
            alt="We Turn!"
            className="w-10 h-10"
          />
          <span className="text-xl font-bold text-green-600">We Turn!</span>
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-6 text-gray-700 font-medium">
          <Link
            to="/customer"
            className="hover:text-green-500 transition duration-150"
          >
            Home
          </Link>
          <Link
            to="/customer/cart"
            className="hover:text-green-500 transition duration-150"
          >
            Cart
          </Link>
          <Link
            to="/customer/checkout"
            className="hover:text-green-500 transition duration-150"
          >
            Checkouts
          </Link>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-700 transition duration-150"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default CustomerNavbar;
