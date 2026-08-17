import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_API_URL } from "../../api/config";
import AdminLayout from "../Admin/AdminLayout";
import toast from "react-hot-toast";

const ALL_PERMISSIONS = [
  "deposits",
  "withdrawals",
  "users",
  "tickets",
  "paymentmode",
  "announcement",
  "addspread",
  "orderedit",
  "orderhistory",
  "demoOrderhistory",
  "admin",
  "kyc",
  "ib"
];

const EditAdmin = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [admin, setAdmin] = useState({
    admin_name: "",
    email_id: "",
    role: "",
    permission: [],
    status: "",
  });

useEffect(() => {
  const fetchAdmin = async () => {
    try {
      const response = await axios.get(`${BACKEND_API_URL}/admin/admin/${id}`);
      if (response.data.success) {
        const normalizePermission = (p) => {
          const map = {
            "orderhistroy": "orderhistory", 
            "withdrawals": "withdrawals"           
          };
          return map[p.trim().toLowerCase()] || p.trim().toLowerCase();
        };

        const permissions = (response.data.admin.permission || []).map(normalizePermission);

        setAdmin({
          ...response.data.admin,
          permission: permissions,
        });
      }
    } catch (error) {
      console.error("Error fetching admin:", error);
    }
  };
  fetchAdmin();
}, [id]);



  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handlePermissionChange = (perm) => {
    setAdmin((prev) => {
      const updatedPermissions = prev.permission.includes(perm)
        ? prev.permission.filter((p) => p !== perm)
        : [...prev.permission, perm];
      return { ...prev, permission: updatedPermissions };
    });
  };

const handleUpdate = async () => {
  try {
    // Make a copy of admin
    const updatedAdmin = { ...admin };

    // Convert permission array to comma-separated string
    updatedAdmin.permission = updatedAdmin.permission.join(",");

    const response = await axios.put(`${BACKEND_API_URL}/admin/admin/update/${id}`, updatedAdmin);

    if (response.data.success) {
      toast.success("Admin updated successfully!");
    }
  } catch (error) {
    console.error("Update failed:", error);
    toast.error("Failed to update admin");
  }
};


  return (
    <AdminLayout>
      <div className="flex-1 p-8 min-h-screen bg-transparent">
        <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold mb-6 text-white/90 border-b border-white/20 pb-3">Edit Admin</h2>

          <div className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-white font-medium mb-2">Admin Name</label>
              <input
                type="text"
                name="admin_name"
                value={admin.admin_name}
                onChange={handleChange}
                placeholder="Admin Name"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-white  font-medium mb-2">Email</label>
              <input
                type="email"
                name="email_id"
                value={admin.email_id}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-white  font-medium mb-2">Role</label>
              <input
                type="text"
                name="role"
                value={admin.role}
                onChange={handleChange}
                placeholder="Role"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-white font-medium mb-2">Status</label>
              <select
                name="status"
                value={admin.status}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option className="bg-gray-500" value="Active">Active</option>
                <option className="bg-gray-500" value="inactive">inactive</option>
              </select>
            </div>

            {/* Permissions */}
            <div>
              <label className="block text-white font-medium mb-2">Permissions</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ALL_PERMISSIONS.map((perm) => (
                  <label key={perm} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={admin.permission.includes(perm)}
                      onChange={() => handlePermissionChange(perm)}
                      className="w-4 h-4 accent-blue-500"
                    />
                    <span className="capitalize text-white">{perm}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Update Button */}
            <div className="pt-4">
              <button
                onClick={handleUpdate}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-300"
              >
                Update Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditAdmin;
