import React, { useEffect, useState } from "react";
import { useItem } from "../contexts/ItemContext";
import { useOrder } from "../contexts/OrderContext";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminEditItems() {
  const { getAllItems, updateItem, deleteItem } = useItem();

  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [uploaded, setUploaded] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderFilter, setOrderFilter] = useState("All");

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const res = await getAllItems();
    setItems(res);
    setSelectedItem(res[0]);
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

  return (
    <>
      <AdminNavbar />
      <div className="max-h-screen bg-white p-6 text-black font-poppins px-[10vw]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          <div className="bg-blue-50 p-6 rounded-lg shadow-md">
            {selectedItem && (
              <>
                <h2 className="text-2xl font-bold text-blue-600 mb-4">
                  Edit Item
                </h2>
                <div className="space-y-4">
                  <img
                    src={
                      uploaded === null
                        ? selectedItem.image_url
                        : URL.createObjectURL(uploaded)
                    }
                    className="w-[10rem]"
                  />
                  <input
                    type="file"
                    onChange={(e) => {
                      setUploaded(e.target.files[0]);
                    }}
                    className="w-full"
                  />
                  <input
                    type="text"
                    value={selectedItem.name}
                    onChange={(e) =>
                      setSelectedItem({ ...selectedItem, name: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Name"
                  />
                  <textarea
                    value={selectedItem.description}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        description: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Description"
                  />
                  <input
                    type="number"
                    value={selectedItem.price}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        price: parseFloat(e.target.value),
                      })
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Price"
                  />
                  <input
                    type="number"
                    value={selectedItem.stock}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        stock: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Stock"
                  />
                </div>

                <div className="flex gap-4 mt-4">
                  <button
                    onClick={handleUpdate}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-blue-600 mb-4">All Items</h2>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <div className="grid grid-cols-2 gap-4 max-h-[600px] overflow-y-auto p-[1rem]">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedItem(item);
                  }}
                  className="cursor-pointer bg-white border shadow-lg rounded-lg overflow-hidden hover:scale-105 transition"
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-48 w-full object-contain"
                  />
                  <div className="p-4">
                    <h3 className="font-[Poetsen_One] text-lg text-blue-700">
                      {item.name}
                    </h3>
                    <p className="text-sm">{item.description}</p>
                    <p>₱{item.price}</p>
                    <p>Stock: {item.stock}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
