import React, { useState } from "react";
import AdminLayout from "../Admin/AdminLayout";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_API_URL } from "../../api/config";

const AddUserFrontend = () => {
  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    password: "",
    confirm_password: "",
    // mobile: "",
    whatsapp: "",
  });

  // Separate states for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { user_name, email, password, confirm_password, whatsapp } = formData;

    if (!user_name || !email || !password || !confirm_password) {
      toast.error("All fields are required!");
      return;
    }

    if (password !== confirm_password) {
      toast.error("Passwords do not match!");
      return;
    }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!emailRegex.test(email)){
        toast.warning("Invalid email address!");
        return;
      }

    const phoneRegex = /^\d{10}$/;
    // if (!phoneRegex.test(mobile)) {
    //   toast.error("Mobile number should be 10 digits only");
    //   return;
    // }
    if (whatsapp && !phoneRegex.test(whatsapp)) {
      toast.error("WhatsApp number should be 10 digits only");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character!"
      );
      return;
    }

    try {
      const res = await axios.post(`${BACKEND_API_URL}/auth/admin/add`, formData);

      if (res.status === 201) {
        toast.success("User added successfully!");
        setFormData({
          user_name: "",
          email: "",
          password: "",
          confirm_password: "",
          // mobile: "",
          whatsapp: "",
          // gender: ""
        });
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Server error. Try again!";
      if (msg.toLowerCase().includes("email")) {
        toast.warning(msg);
      } else {
        toast.error(msg);
      }
    }
  };

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      <div className="flex-1 p-2 sm:p-4 md:p-8 relative z-10">
        <h3 className="text-3xl font-semibold mb-8 text-center text-white/90">Add Users</h3>

        <div className="max-w-lg mx-auto bg-white/10 backdrop-blur-xl border border-white/20 p-4 sm:p-6 md:p-8 rounded-3xl shadow-2xl space-y-4 animate-fade-in w-full">
          {[{ label: "Username", name: "user_name", type: "text" },
            { label: "Email", name: "email", type: "email" }].map((field) => (
            <div key={field.name} className="flex flex-col">
              <label className="mb-1 text-xs sm:text-sm text-white/70">{field.label}:</label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={`Enter ${field.label}`}
                className="border border-white/20 rounded-xl px-3 py-2 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-200 text-sm w-full"
              />
            </div>
          ))}

          {/* Password field with toggle */}
          <div className="flex flex-col relative">
            <label className="mb-1 text-xs sm:text-sm text-white/70">Password:</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Password"
              className="border border-white/20 rounded-xl px-3 py-2 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 pr-10 text-sm w-full"
            />
            <span
              className="absolute right-3 top-9 cursor-pointer text-white/70 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          {/* Confirm Password field with toggle */}
          <div className="flex flex-col relative">
            <label className="mb-1 text-xs sm:text-sm text-white/70">Confirm Password:</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="border border-white/20 rounded-xl px-3 py-2 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 pr-10 text-sm w-full"
            />
            <span
              className="absolute right-3 top-9 cursor-pointer text-white/70 hover:text-white"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          {[
            // { label: "Mobile Number", name: "mobile", type: "text" },
            { label: "WhatsApp Number", name: "whatsapp", type: "text" },
          ].map((field) => (
            <div key={field.name} className="flex flex-col">
              <label className="mb-1 text-xs sm:text-sm text-white/70">{field.label}:</label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={`Enter ${field.label}`}
                className="border border-white/20 rounded-xl px-3 py-2 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-200 text-sm w-full"
              />
            </div>
          ))}

          {/* <div className="flex flex-col"> */}
            {/* <label className="mb-1 text-sm text-white/70">Gender:</label>

            <div className="flex gap-6 mt-2"> */}

              {/* Male */}
              {/* <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="gender" value="Male" checked={formData.gender === "Male"} onChange={handleChange}
                  className="w-4 h-4 accent-cyan-400" />
                <span className="text-white/80">Male</span>
              </label> */}

              {/* Female */}
              {/* <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="gender" value="Female" checked={formData.gender === "Female"} onChange={handleChange}
                  className="w-4 h-4 accent-purple-400" />
                <span className="text-white/80">Female</span>
              </label> */}

              {/* Other */}
              {/* <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="gender" value="Other" checked={formData.gender === "Other"} onChange={handleChange}
                  className="w-4 h-4 accent-blue-400" />
                <span className="text-white/80">Other</span>
              </label> */}
            {/* </div> */}
          {/* </div> */}


          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white py-2 rounded-xl font-semibold hover:opacity-90 hover:scale-105 transition-all duration-200"
          >
            Add User
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddUserFrontend;
