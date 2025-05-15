import React, { useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const LoginRegisterPage = () => {
  const { login, register } = useContext(UserContext);
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors("");
  };

  const validate = () => {
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email))
      return "Enter a valid email";
    if (!form.password || form.password.length < 6)
      return "Password must be at least 6 characters";
    if (!isLogin && !form.name.trim())
      return "Name is required for registration";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) return setErrors(validationError);

    try {
      if (isLogin) {
        const req = await login({ email: form.email, password: form.password });
        if (req.status === 200) {
          
          sessionStorage.setItem("token", req.data.token);
          sessionStorage.setItem("role", req.data.user.role);

          if (req.data.user.role === "customer") {
            navigate("/customer");
          } else {
            navigate("/admin");
          }
        }
      } else {
        const req = await register(form);
      }
    } catch (err) {
      setErrors(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg flex w-full max-w-4xl overflow-hidden">
        {/* Left Panel */}
        <div className="w-1/2 bg-gradient-to-br from-blue-100 to-green-100 text-gray-800 flex flex-col justify-center items-center p-8">
          <img
            src="https://png.pngtree.com/png-clipart/20250125/original/pngtree-monopoly-character-clipart-illustration-png-image_20040958.png"
            alt="Board Game"
            className="w-40 h-40 mb-4"
          />
          <h2 className="text-3xl font-bold mb-2">We Turn!</h2>
          <p className="text-sm text-center text-gray-700">
            The board & card games hub built for fun!
          </p>
        </div>

        {/* Right Panel - Form */}
        <div className="w-1/2 p-10">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">
            {isLogin ? "Login" : "Register"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm text-gray-600">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            )}
            <div>
              <label className="block text-sm text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-200"
              />
            </div>

            {errors && <p className="text-red-500 text-sm">{errors}</p>}

            <button
              type="submit"
              className="w-full bg-green-300 hover:bg-green-400 text-gray-900 font-semibold py-2 px-4 rounded-md transition duration-200"
            >
              {isLogin ? "Login" : "Register"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setForm({ name: "", email: "", password: "" });
                setErrors("");
              }}
              className="text-blue-500 underline hover:text-blue-700"
            >
              {isLogin ? "Register here" : "Login here"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginRegisterPage;
