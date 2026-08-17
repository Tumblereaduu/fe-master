import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { BACKEND_API_URL } from '../../api/config';
import toast from 'react-hot-toast';
import AdminLayout from "../Admin/AdminLayout";

const ViewBanner = () => {
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await axios.get(`${BACKEND_API_URL}/banner/view`);
                if (res.data.success) {
                    setBanners(res.data.banners);
                }
            } catch (error) {
                console.error("Error fetching banners:", error);
            }
        };

        fetchBanners();
    }, []);

    const handleToggleButton = (banner) => {
        const newStatus = banner.status === "active" ? "inactive" : "active";
        confirmAlert({
            title: "Confirm Status Change",
            message: `Are you sure you want to change status to "${newStatus}"?`,
            buttons: [
                {
                    label: "Yes",
                    onClick: async () => {
                        try {
                            const res = await axios.put(`${BACKEND_API_URL}/banner/toggle/${banner.id}`, { status: newStatus });
                            if (res.data.success) {
                                toast.success("Banner status updated!");
                                setBanners(prev =>
                                    prev.map(b => (b.id === banner.id ? { ...b, status: newStatus } : b))
                                );
                            } else {
                                toast.error(res.data.message || "Failed to update status");
                            }
                        } catch (err) {
                            console.error("Error updating status:", err);
                            toast.error("Server error while updating status.");
                        }
                    },
                },
                { label: "No", onClick: () => toast.info("Action cancelled") },
            ],
        });

    }

    const handleDelete = (id) => {
    confirmAlert({
        title: "Confirm Delete",
        message: "Are you sure you want to delete this banner?",
        buttons: [
            {
                label: "Yes",
                onClick: async () => {
                    try {
                        const res = await axios.delete(`${BACKEND_API_URL}/banner/delete/${id}`);
                        if (res.data.success) {
                            toast.success("Banner deleted successfully!");

                            // remove from UI
                            setBanners(prev => prev.filter(b => b.id !== id));
                        } else {
                            toast.error(res.data.message || "Failed to delete banner");
                        }
                    } catch (err) {
                        console.error("Error deleting:", err);
                        toast.error("Server error while deleting.");
                    }
                },
            },
            { label: "No" },
        ],
    });
};


    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold mb-6 text-white/90">View Banners</h1>

            <div className="overflow-x-auto max-w-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-4 border border-white/20">
                    <table className="min-w-full border border-white/20 text-white">
                        <thead className="bg-white/10">
                            <tr>
                                <th className="px-4 py-2 border border-white/20">ID</th>
                                <th className="px-4 py-2 border border-white/20">Photo</th>
                                <th className="px-4 py-2 border border-white/20">Location</th>
                                <th className="px-4 py-2 border border-white/20">Status</th>
                                <th className="px-4 py-2 border border-white/20">Created At</th>
                                <th className="px-4 py-2 border border-white/20">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {banners.length > 0 ? (
                                banners.map((banner) => (
                                    <tr key={banner.id} className="text-center border-t">
                                        <td className="px-4 py-2 border border-white/10">{banner.id}</td>
                                        <td className="px-4 py-2 border border-white/10">
                                            <img src={banner.image} alt="banner" className="w-32 h-16 object-cover mx-auto rounded" />
                                        </td>
                                        {/* Displaying Location for Clarity */}
                                        <td className="px-4 py-2 border border-white/10 capitalize font-semibold">
                                            {banner.location === 'ib_dashboard' ? 'IB Dashboard' : 'Main Dashboard'}
                                        </td>
                                        <td className="px-4 py-2 border border-white/10">
                                            <button
                                                className={`px-3 py-1 text-sm rounded-lg ${banner.status === "active"
                                                        ? "bg-green-600 text-white hover:bg-green-700"
                                                        : "bg-red-500 text-white hover:bg-red-600"
                                                    }`}
                                                onClick={() => handleToggleButton(banner)}
                                            >
                                                {banner.status}
                                            </button>
                                        </td>
                                        <td className="px-4 py-2 border border-white/10">{new Date(banner.created_at).toLocaleString()}</td>
                                        <td className="px-4 py-2 border border-white/10">
                                            <button className='bg-red-400 px-2 py-1 cursor-pointer rounded-xl' onClick={()=> handleDelete(banner.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-4 py-2 text-center text-gray-500">
                                        No banners found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
        </AdminLayout>
    );
};

export default ViewBanner;
