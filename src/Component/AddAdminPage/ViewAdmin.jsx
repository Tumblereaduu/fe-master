import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_API_URL } from "../../api/config";
import { useNavigate } from "react-router-dom";
import { adminRoutes } from "../../App";
import AdminLayout from "../Admin/AdminLayout";


const ViewAdmin = () => {

    const [admins, setAdmins] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const response = await axios.get(`${BACKEND_API_URL}/admin/admins`);
                const data = response.data;

                // console.log("Admin Data:", data);

                if (data.success) {
                    setAdmins(data.admins);
                }
            } catch (error) {
                console.error("Error while fetching admins", error);
            }
        };

        fetchAdmins();
    }, []);


    return (
        <AdminLayout>
            <div className="flex justify-between items-center mt-15">
                <h1 className="text-2xl font-semibold text-white/90">Admin Users</h1>
                <button className="px-4 py-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white text-sm rounded-lg hover:opacity-90 transition" onClick={()=> navigate(`${adminRoutes}add`)}>
                    + Add Admin
                </button>
            </div>

            <div className="overflow-x-auto max-w-full bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden border border-white/20">
                <table className="w-full text-left border-collapse text-white">

                        <thead className="bg-white/10 text-white/70 font-semibold border-white/20">
                            <tr>
                                <th className="px-6 py-3 border-b border-white/20">ID</th>
                                <th className="px-6 py-3 border-b border-white/20">Admin Name</th>
                                <th className="px-6 py-3 border-b border-white/20">Email</th>
                                <th className="px-6 py-3 border-b border-white/20">Role</th>
                                <th className="px-6 py-3 border-b border-white/20">Status</th>
                                <th className="px-6 py-3 border-b border-white/20 text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {admins.length > 0 ? (
                                admins.map((admin,index) => (
                                    <tr key={admin.id} className="hover:bg-white/5 transition">
                                        <td className="px-6 py-3 border-b">{admin.id}</td>
                                        <td className="px-6 py-3 border-b">{admin.admin_name}</td>
                                        <td className="px-6 py-3 border-b">{admin.email_id}</td>
                                        <td className="px-6 py-3 border-b">{admin.role}</td>

                                        <td className="px-6 py-3 border-b">
                                            <span className={`px-2 py-1 rounded text-sm font-medium ${
                                                admin.status === "active"
                                                    ? "bg-green-200 text-green-700"
                                                    : admin.status === "inactive"
                                                        ? "bg-yellow-200 text-yellow-700"
                                                        : "bg-red-200 text-red-700"
                                            }`}>
                                                {admin.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-3 border-b text-center" onClick={()=> window.open(`${adminRoutes}admin/edit/${admin.id}`,'_blank')}>
                                            <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-6 text-gray-500">
                                        No admin users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
        </AdminLayout>
    );
};

export default ViewAdmin;
