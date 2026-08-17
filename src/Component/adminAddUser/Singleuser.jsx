import React, { useEffect, useState } from "react";
import AdminLayout from "../Admin/AdminLayout";
import { useParams } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css"
import { Slide, ToastContainer,toast } from "react-toastify";
import { BACKEND_API_URL } from "../../api/config";
import { LogOut, Loader } from "lucide-react";

const Singleuser = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("");
    const [error, setError] = useState("");
    const [lpStatus, setLpStatus] = useState("");
    const [ibStatus, setIbStatus] = useState("");
    const [monitorStatus, setMonitorStatus] = useState("");
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    // Fetch data for single user

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${BACKEND_API_URL}/auth/user/${id}`);
                if (response.data.status === "success") {
                    const userData = response.data.data;

                    console.log("Single User API Response:", userData);

                    setUser(userData);

                    setStatus(userData.user_status || "");

                    setLpStatus(
                        Number(userData.is_lp_added) === 1 ? "active" : "inactive"
                    );

                    setIbStatus(userData.ib_status || "");

                    setMonitorStatus(
                        Number(userData.monitor_status) === 1 ? "active" : "inactive"
                    );
                } else {
                    setError(response.data.message || "User not found");
                }
            } catch (err) {
                console.error("Error fetching user:", err);
                setError("Failed to fetch user details");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);


    // change active and update in db

    const handleUpdate = async () => {
        try {
            const payload = {};

            if (status) {
                payload.user_status = status;
            }

            if (lpStatus) {
                payload.is_lp_added = lpStatus === "active" ? 1 : 0;
            }

            if (ibStatus) {
                payload.ib_status = ibStatus;
            }

            if (monitorStatus) {
                payload.monitor_status = monitorStatus === "active" ? 1 : 0;
            }

            const response = await axios.put(
                `${BACKEND_API_URL}/auth/user/status/${id}`,
                payload
            );

            if (response.data.status === "success") {
                toast.success("User status updated successfully!");

                setUser((prev) => ({
                    ...prev,
                    ...payload,
                }));
            } else {
                toast.error(response.data.message || "Failed to update");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            const msg =
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong while updating status";

            toast.error(msg);
        }
    };

    // Force logout user
    const handleForceLogout = async () => {
        try {
            setLoggingOut(true);
            const response = await axios.post(
                `${BACKEND_API_URL}/auth/manual-logout`,
                { user_id: id }
            );

            if (response.data.status === "success" || response.status === 200) {
                toast.success("User logged out successfully.");
                setShowLogoutModal(false);
            } else {
                toast.error(response.data.message || "Failed to logout user");
            }
        } catch (error) {
            console.error("Error logging out user:", error);
            const msg =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to logout user";
            toast.error(msg);
        } finally {
            setLoggingOut(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-screen text-lg text-gray-400">
                    Loading user details...
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-screen text-red-500 font-semibold">
                    {error}
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <ToastContainer position="top-right" autoClose={3000} transition={Slide} />

            {/* Main Content */}
            <div className="flex-1 ml-0 px-2 sm:px-4 md:px-10 py-10 w-full">
                <h3 className="text-3xl font-bold mb-8 text-center">
                    User Details
                </h3>

                <div className="bg-white/10 backdrop-blur-xl text-white rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 max-w-2xl mx-auto border border-white/20 w-full">
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-xs sm:text-sm text-white/70 mb-1 font-semibold">Username</h4>
                            <p className="bg-gray-700  px-4 py-2 rounded-lg shadow-sm border border-white/20 text-sm">
                                {user.username}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-xs sm:text-sm text-white/70 mb-1 font-semibold">Email</h4>
                            <p className="bg-gray-700  px-4 py-2 rounded-lg shadow-sm border border-white/20 text-sm">
                                {user.email}
                            </p>
                        </div>

                        {/* <div>
                            <h4 className="text-xs sm:text-sm text-white/70 mb-1 font-semibold">Mobile Number</h4>
                            <p className="bg-gray-700 px-4 py-2 rounded-lg shadow-sm border border-white/20">
                                {user.mobile_number}
                            </p>
                        </div> */}

                        <div>
                            <h4 className="text-xs sm:text-sm text-white/70 mb-1 font-semibold">WhatsApp Number</h4>
                            <p className="bg-gray-700  px-4 py-2 rounded-lg shadow-sm border border-white/20 text-sm">
                                {user.whatsapp_number}
                            </p>
                        </div>

                        {/* Status Dropdown */}
                        <div>
                            <h4 className="text-xs sm:text-sm text-white/70 mb-1 font-semibold">User Status</h4>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="bg-gray-700 px-4 py-2 rounded-lg shadow-sm border border-white/20 w-full text-sm"
                            >
                                <option value="">Select User Status</option> 
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        {/* LP Active */}
                        <div>
                            <h4 className="text-xs sm:text-sm text-white/70 mb-1 font-semibold">LP Status</h4>
                            <select
                                value={lpStatus}
                                onChange={(e) => setLpStatus(e.target.value)}
                                className="bg-gray-700 px-4 py-2 rounded-lg shadow-sm border border-white/20 w-full text-sm"
                            >
                                <option value="">Select LP Status</option> 
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                         {/* IB Active */}
                        <div>
                            <h4 className="text-xs sm:text-sm text-white/70 mb-1 font-semibold">IB Status</h4>
                            <select
                                value={ibStatus}
                                onChange={(e) => setIbStatus(e.target.value)}
                                className="bg-gray-700 px-4 py-2 rounded-lg shadow-sm border border-white/20 w-full text-sm"
                            >
                                <option value="">Select IB Status</option> 
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        {/* monitor status */}
                        <div>
                            <h4 className="text-xs sm:text-sm text-white/70 mb-1 font-semibold">Monitor Status</h4>
                            <select
                                value={monitorStatus}
                                onChange={(e) => setMonitorStatus(e.target.value)}
                                className="bg-gray-700 px-4 py-2 rounded-lg shadow-sm border border-white/20 w-full text-sm"
                            >
                                <option value="">Select Monitor Status</option> 
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        <div className="flex gap-3 pt-6 flex-col sm:flex-row">
                            <button 
                                onClick={handleUpdate} 
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 sm:px-6 py-2 rounded-lg shadow-md transition-all duration-200 flex-1 text-sm"
                            >
                                Submit
                            </button>
                            <button 
                                onClick={() => setShowLogoutModal(true)}
                                disabled={loggingOut}
                                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-4 sm:px-6 py-2 rounded-lg shadow-md transition-all duration-200 flex-1 text-sm flex items-center justify-center gap-2"
                            >
                                {loggingOut ? (
                                    <>
                                        <Loader size={16} className="animate-spin" />
                                        Logging out...
                                    </>
                                ) : (
                                    <>
                                        <LogOut size={16} />
                                        Logout User
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Force Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-slate-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-slate-700">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 mb-4 mx-auto">
                            <LogOut size={24} className="text-red-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white text-center mb-2">Force Logout User</h3>
                        <p className="text-slate-300 text-center text-sm mb-6">
                            Are you sure you want to force logout this user? If the user is currently logged in, their active session will be terminated and they will need to log in again.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                disabled={loggingOut}
                                className="flex-1 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-all duration-200 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleForceLogout}
                                disabled={loggingOut}
                                className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loggingOut ? (
                                    <>
                                        <Loader size={16} className="animate-spin" />
                                        Logging out...
                                    </>
                                ) : (
                                    <>
                                        <LogOut size={16} />
                                        Logout
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default Singleuser;
