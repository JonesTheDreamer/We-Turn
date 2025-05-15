import React, { useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { useItem } from "../contexts/ItemContext";

export default function AdminAddItem() {
  const { createItem } = useItem();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.description.trim())
      newErrors.description = "Description is required.";

    const price = parseFloat(form.price);
    if (isNaN(price) || price <= 0)
      newErrors.price = "Enter valid price greater than 0.";

    const stock = parseInt(form.stock);
    if (isNaN(stock) || stock <= 0)
      newErrors.stock = "Stock must be greater than 0.";

    if (!form.image) newErrors.image = "Image is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });

    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      await createItem(formData);
      alert("Item added successfully!");
      setForm({ name: "", description: "", price: "", stock: "", image: null });
      setPreview(null);
      setErrors({});
    } catch (e) {
      alert("Failed to add item.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <AdminNavbar />
      <div className="max-w-6xl mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* LEFT: Product Info */}
        <div className="space-y-4 font-[Poppins]">
          <h2 className="text-2xl font-bold text-green-700 font-[Poetsen One]">
            Add New Product
          </h2>

          <div>
            <label className="block font-semibold mb-1">Product Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border rounded p-2"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block font-semibold mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full border rounded p-2"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1">Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full border rounded p-2"
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price}</p>
              )}
            </div>

            <div className="flex-1">
              <label className="block font-semibold mb-1">Stock</label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full border rounded p-2"
              />
              {errors.stock && (
                <p className="text-red-500 text-sm">{errors.stock}</p>
              )}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="mt-4 bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded font-semibold"
          >
            Submit Product
          </button>
        </div>

        <div className="flex flex-col items-center font-[Poppins]">
          <div className="w-full aspect-square border-dashed border-2 border-gray-400 flex items-center justify-center bg-gray-50 overflow-hidden rounded">
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="object-contain w-full h-full"
              />
            ) : (
              <span className="text-gray-400 text-lg font-[Poetsen One]">
                Upload Image
              </span>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-4"
          />
          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image}</p>
          )}
        </div>
      </div>
    </div>
  );
}
