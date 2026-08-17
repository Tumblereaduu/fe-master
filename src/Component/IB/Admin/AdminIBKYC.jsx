import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../Admin/AdminLayout";
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from "react-router-dom";
import { BACKEND_API_URL } from "../../../api/config";
import { adminRoutes } from "../../../App";

const AdminIBKYC = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        const fetchKycData = async () => {
            try {
                const response = await axios.get(`${BACKEND_API_URL}/ib/kyc/admin/ib/kyc`, {
                });

                if (response.data.status === "success") {
                    const rawData = response.data.data;
                    const usersArray = Array.isArray(rawData[0]) ? rawData[0] : rawData;
                    setUsers(usersArray);
                } else {
                    console.error("Unexpected response:", response.data);
                }
            } catch (error) {
                console.error("Error fetching KYC data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchKycData();
    }, [token]);

    if (loading) return <p className="text-center mt-6">Loading KYC data...</p>;

    // Filter by search     
    const filteredUsers = users.filter((u) => {
        const keyword = search.toLowerCase();
        return (
            u?.username?.toLowerCase().includes(keyword) ||
            u?.email?.toLowerCase().includes(keyword) ||
            String(u?.user_id).includes(keyword)
        );
    });

    // Pagination logic
    const totalPages = rowsPerPage === "All" ? 1 : Math.ceil(filteredUsers.length / rowsPerPage);
    const indexOfLastUser = rowsPerPage === "All" ? filteredUsers.length : currentPage * rowsPerPage;
    const indexOfFirstUser = rowsPerPage === "All" ? 0 : indexOfLastUser - rowsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1); // reset page when searching
    };

    return (
        <AdminLayout>
            <div className="flex-1 p-3 sm:p-4 md:p-5 w-full">
                {/*  show logged-in admin name */}
                <div className="text-center mb-5">
                    <h1 className="text-3xl font-extrabold text-white/90 border-b-2 border-cyan-400 inline-block pb-2 mt-12">
                        IB  KYC VERIFICATION
                    </h1>
                </div>

                {/* Search & Rows Per Page */}
                <div className="flex justify-between items-center mb-6">
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearchChange}
                        placeholder="Search..."
                        className="w-64 px-4 py-2 rounded-lg bg-black/40 border border-white/20 text-white placeholder-white/40 focus:outline-none"
                    />

                    <select
                        value={rowsPerPage}
                        onChange={(e) => { setRowsPerPage(e.target.value === "All" ? "All" : Number(e.target.value)); setCurrentPage(1); }}
                        className="px-4 py-2 rounded-lg bg-black/40 border border-white/20 text-white"
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value="All">All</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full border border-white/20 text-white">
                        <thead className="bg-white/10 backdrop-blur border border-white/20">
                            <tr>
                                <th className="px-4 py-2 border">User ID</th>
                                <th className="px-4 py-2 border">Photo 1</th>
                                <th className="px-4 py-2 border">Photo 2</th>
                                <th className="px-4 py-2 border">Photo 3</th>
                                <th className="px-4 py-2 border">Photo 4</th>
                                <th className="px-4 py-2 border">Photo 5</th>
                                <th className="px-4 py-2 border">Photo 6</th>
                                <th className="px-4 py-2 border">Photo Upload At</th>
                                <th className="px-4 py-2 border">Photo Verified At</th>
                                <th className="px-4 py-2 border">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {currentUsers.length > 0 ? (
                                currentUsers.map((userData, index) => (
                                    <tr key={userData.id ?? index} className="text-center hover:bg-white/10 transition">
                                        <td className="px-4 py-2 border">{userData.user_id ?? "—"}</td>

                                        <td className="px-4 py-2 border">
                                            {userData.ib_photo_id_1_status === "approved" ? (<span className="text-green-400 font-semibold">Verified</span>) :
                                                userData.ib_photo_id_1_status === "pending" ? (<span className="text-yellow-400 font-semibold">Pending</span>) :
                                                    userData.ib_photo_id_1_status === "rejected" ? (<span className="text-red-600 font-semibold">Rejected</span>) :
                                                        userData.ib_kyc_id_1 ? (
                                                            <a href={userData.ib_kyc_id_1} target="_blank" rel="noreferrer">
                                                                {/* <img
                                                        src={userData.photo_id_1}
                                                        alt="Photo 1"
                                                        className="w-16 h-16 object-cover mx-auto rounded"
                                                    /> */}
                                                                <span className="text-green-400"> File Attached </span>

                                                            </a>
                                                        ) : (
                                                            <span className="text-red-600">No File</span>
                                                        )}
                                        </td>

                                        <td className="px-4 py-2 border">
                                            {userData.ib_photo_id_2_status === "approved" ? (<span className="text-green-400 font-semibold">Verified</span>) :
                                                userData.ib_photo_id_2_status === "pending" ? (<span className="text-yellow-400 font-semibold">Pending</span>) :
                                                    userData.ib_photo_id_2_status === "rejected" ? (<span className="text-red-600 font-semibold">Rejected</span>) :
                                                        userData.ib_kyc_id_2 ? (
                                                            <a href={userData.ib_kyc_id_2} target="_blank" rel="noreferrer">
                                                                {/* <img
                                                        src={userData.photo_id_2}
                                                        alt="Photo 2"
                                                        className="w-16 h-16 object-cover mx-auto rounded"
                                                    /> */}
                                                                <span className="text-green-400"> File Attached </span>

                                                            </a>
                                                        ) : (
                                                            <span className="text-red-600">No File</span>
                                                        )}
                                        </td>

                                        <td className="px-4 py-2 border">
                                            {userData.ib_photo_id_3_status === "approved" ? (<span className="text-green-400 font-semibold">Verified</span>) :
                                                userData.ib_photo_id_3_status === "pending" ? (<span className="text-yellow-400 font-semibold">Pending</span>) :
                                                    userData.ib_photo_id_3_status === "rejected" ? (<span className="text-red-600 font-semibold">Rejected</span>) :
                                                        userData.ib_kyc_id_3 ? (
                                                            <a href={userData.ib_kyc_id_3} target="_blank" rel="noreferrer">
                                                                <span className="text-green-400"> File Attached </span>
                                                            </a>
                                                        ) : (
                                                            <span className="text-red-600">No File</span>
                                                        )}
                                        </td>

                                        <td className="px-4 py-2 border">
                                            {userData.ib_photo_id_4_status === "approved" ? (<span className="text-green-400 font-semibold">Verified</span>) :
                                                userData.ib_photo_id_4_status === "pending" ? (<span className="text-yellow-400 font-semibold">Pending</span>) :
                                                    userData.ib_photo_id_4_status === "rejected" ? (<span className="text-red-600 font-semibold">Rejected</span>) :
                                                        userData.ib_kyc_id_4 ? (
                                                            <a href={userData.ib_kyc_id_4} target="_blank" rel="noreferrer">
                                                                <span className="text-green-400"> File Attached </span>
                                                            </a>
                                                        ) : (
                                                            <span className="text-red-600">No File</span>
                                                        )}
                                        </td>

                                        <td className="px-4 py-2 border">
                                            {userData.ib_photo_id_5_status === "approved" ? (<span className="text-green-400 font-semibold">Verified</span>) :
                                                userData.ib_photo_id_5_status === "pending" ? (<span className="text-yellow-400 font-semibold">Pending</span>) :
                                                    userData.ib_photo_id_5_status === "rejected" ? (<span className="text-red-600 font-semibold">Rejected</span>) :
                                                        userData.ib_kyc_id_5 ? (
                                                            <a href={userData.ib_kyc_id_5} target="_blank" rel="noreferrer">
                                                                <span className="text-green-400"> File Attached </span>
                                                            </a>
                                                        ) : (
                                                            <span className="text-red-600">No File</span>
                                                        )}
                                        </td>

                                        <td className="px-4 py-2 border">
                                            {userData.ib_photo_id_6_status === "approved" ? (<span className="text-green-400 font-semibold">Verified</span>) :
                                                userData.ib_photo_id_6_status === "pending" ? (<span className="text-yellow-400 font-semibold">Pending</span>) :
                                                    userData.ib_photo_id_6_status === "rejected" ? (<span className="text-red-600 font-semibold">Rejected</span>) :
                                                        userData.ib_kyc_id_6 ? (
                                                            <a href={userData.ib_kyc_id_6} target="_blank" rel="noreferrer">
                                                                <span className="text-green-400"> File Attached </span>
                                                            </a>
                                                        ) : (
                                                            <span className="text-red-600">No File</span>
                                                        )}
                                        </td>

                                        <td className="px-4 py-2 border">{userData.ib_documents_uploaded_at ? new Date(userData.ib_documents_uploaded_at).toLocaleString() : "—"}</td>
                                        <td className="px-4 py-2 border">{userData.ib_documents_verified_at ? new Date(userData.ib_documents_verified_at).toLocaleString() : "—"}</td>
                                        <td className="px-4 py-2 border">
                                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded" onClick={() => navigate(`${adminRoutes}admin/ib/kyc/${userData.user_id}`)}>
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-4 text-white/60">
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-3 mt-6">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg disabled:opacity-50"
                        >
                            Prev
                        </button>

                        <span className="text-white/70">
                            Page {currentPage} of {totalPages}
                        </span>

                        <button
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminIBKYC;
