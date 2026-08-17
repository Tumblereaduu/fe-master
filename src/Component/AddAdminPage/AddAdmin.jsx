import React, { useRef,useState } from "react";
import axios from "axios";
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5"
import "react-toastify/dist/ReactToastify.css"
import { ToastContainer, Slide, toast } from "react-toastify";
import { BACKEND_API_URL } from "../../api/config";
import AdminLayout from "../Admin/AdminLayout";

const AddAdmin = () => {
  const formRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = formRef.current;
    const formData = new FormData(form);

    const permissions = [];
    form
      .querySelectorAll("input[name='permission']:checked")
      .forEach((el) => permissions.push(el.value));

    if (
      !formData.get("admin_name") ||
      !formData.get("email_id") ||
      !formData.get("password") ||
      !formData.get("role") ||
      permissions.length === 0
    ) {
      toast.warning("Please fill all fields and select at least one permission!");
      return;
    }

    formData.set("permission", JSON.stringify(permissions));

    try {
      const data = {
        admin_name: formData.get("admin_name"),
        email_id: formData.get("email_id"),
        password: formData.get("password"),
        role: formData.get("role"),
        permission: permissions.join(","),
        status: formData.get("status"),
      };

      const res = await axios.post(`${BACKEND_API_URL}/admin`, data, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 200 || res.status === 201) {
        toast.success(res.data.message);
        form.reset();
        form.querySelectorAll("input[name='permission']").forEach((el) => (el.checked = false));
        const adminRole = form.querySelector("input[value='admin']");
        if (adminRole) adminRole.checked = true;
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 409) {
        toast.error("Email already exists! Please use a different one.")
      }
      else {
        toast.error(err.response?.data?.message || "Failed to insert admin!");
      }
    }

  };

  return (

    <AdminLayout>
      <ToastContainer position="top-right" autoClose={3000} transition={Slide} />

      <div className="px-2 mt-18 md:ml-0">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Add New Admin
        </h2>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"
        >
          {/* Basic Info */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              name="admin_name"
              placeholder="Enter username"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email_id"
              placeholder="Enter email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
          </div>
<div>
  <label className="block text-gray-700 font-medium mb-2">
    Password
  </label>

  <div className="flex items-center justify-between w-full border border-gray-300 px-4 py-2 rounded-lg focus-within:ring-2 focus-within:ring-purple-400 transition">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      placeholder="Enter password"
      className="w-full outline-none"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="ml-2 text-gray-600 hover:text-purple-600 transition"
    >
      {showPassword ? <IoEyeOffSharp size={20} /> : <IoEyeSharp size={20} />}
    </button>
  </div>
</div>


          <div>
            <label className="block text-gray-700 font-medium mb-2">Status</label>
            <select
              name="status"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Role */}
          <div className="md:col-span-2 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Select Role
            </h3>
            <div className="flex gap-6">
              {["admin", "subadmin", "staff"].map((role) => (
                <label
                  key={role}
                  className="flex items-center gap-2 cursor-pointer bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-100 transition shadow-sm"
                >
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    defaultChecked={role === "admin"}
                    className="w-4 h-4 accent-purple-600"
                  />
                  <span className="text-gray-700 capitalize">{role}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Permissions */}
          <div className="md:col-span-2 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Permissions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {["Tickets", "Deposits", "Withdrawals", "KYC","Admin","Balance","Users","PaymentMode","Announcement","AddSpread","OrderEdit","OrderHistroy","DemoOrderHistory"].map((perm) => (
                <label
                  key={perm}
                  className="flex items-center gap-2  px-3 py-2 rounded-lg hover:bg-green-100 cursor-pointer transition"
                >
                  <input
                    type="checkbox"
                    name="permission"
                    value={perm}
                    className="w-4 h-4 accent-green-600"
                  />
                  <span className="text-gray-700">{perm}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="md:col-span-2 flex justify-end mt-8">
            <button
              type="submit"
              className="bg-purple-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-purple-700 transition shadow-md"
            >
              Add Admin
            </button>
          </div>
        </form>

      </div>
    </AdminLayout>
  );
};

export default AddAdmin;
