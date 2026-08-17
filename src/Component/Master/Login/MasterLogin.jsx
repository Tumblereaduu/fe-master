import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_API_URL } from "../../../api/config";
import { useAuth } from "../../context/AuthContext";
import Cookies from "js-cookie";

const MasterLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { handleLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.warning("Please enter both email and password fields!", {
        position: "top-right",
        autoClose: 2500,
      });
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${BACKEND_API_URL}/master/login`, {
        email: email,
        password: password,
      });

      if (res.status === 200 && res.data.status === "success") {
        const masterData = res.data.master;

        // Check if status is active
        if (masterData.status?.toLowerCase() !== "active") {
          toast.error("Your account is inactive. Please contact support.", {
            position: "top-right",
            autoClose: 3000,
          });
          setLoading(false);
          return;
        }

        // Store Master authentication
        const cookieExpiry = 12 / 24;

        Cookies.set("masterToken", res.data.token, { expires: cookieExpiry });
        Cookies.set("masterInfo", JSON.stringify(masterData), { expires: cookieExpiry });
        Cookies.set("master_token_exp", Date.now() + 12 * 60 * 60 * 1000, {
          expires: cookieExpiry,
        });

        // Update AuthContext
        handleLogin(res.data.token, "master", masterData);

        toast.success("Master login successful!", {
          position: "top-right",
          autoClose: 2500,
        });

        navigate("/master/dashboard");
      }
    } catch (error) {
      console.error("Master login error:", error);

      if (error.response && error.response.status === 401) {
        const errorMsg = error.response.data?.message || "Invalid email or password!";
        toast.error(errorMsg, { position: "top-right", autoClose: 2500 });
        setError(errorMsg);
      } else if (error.response) {
        const errorMsg = error.response.data?.message || "Server error occurred.";
        toast.error(errorMsg, { position: "top-right", autoClose: 2500 });
        setError(errorMsg);
      } else {
        toast.error("Cannot connect to server. Check backend.", {
          position: "top-right",
          autoClose: 2500,
        });
        setError("Connection error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-blue-200 to-blue-400 px-4">
      <ToastContainer />

      {/* Login Card */}
      <div className="relative bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Master Admin</h1>
          <p className="text-gray-600 text-sm">Platform Management Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <div className="flex items-center justify-between w-full px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 transition">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="outline-none w-full bg-transparent"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-gray-600 hover:text-blue-600 transition"
                disabled={loading}
              >
                {showPassword ? (
                  <IoEyeOffSharp size={20} />
                ) : (
                  <IoEyeSharp size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 py-3 rounded-md border border-red-200">
              {error}
            </p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:scale-95"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-xs mt-8">
          © 2025 OneBlueTrade Master Portal
        </p>
      </div>
    </div>
  );
};

export default MasterLogin;
