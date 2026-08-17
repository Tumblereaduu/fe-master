import React, { useEffect, useState } from "react";
import AdminLayout from "../Admin/AdminLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_API_URL } from "../../api/config";
import toast from "react-hot-toast";
import { adminRoutes } from "../../App";
import { formatUTC } from "../../api/trade/date";

const InactiveUsers = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${BACKEND_API_URL}/auth/all-users`);
                const data = response.data;

                if (data.status === "success") {
                    // 🔥 Filter ONLY inactive users
                    const inactive = data.data.filter(
                        (user) => user.user_status !== "active"
                        // OR use: user.user_status === "inactive"
                    );
                    setUsers(inactive);
                }
            } catch (error) {
                console.error("Error fetching users", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // 🔍 Search
    const filteredUsers = users.filter(
        (user) =>
            user.id.toString().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 📄 Pagination
    const totalPages =
        itemsPerPage === "all"
            ? 1
            : Math.ceil(filteredUsers.length / itemsPerPage);

    const startIndex =
        itemsPerPage === "all" ? 0 : (currentPage - 1) * itemsPerPage;

    const paginatedUsers =
        itemsPerPage === "all"
            ? filteredUsers
            : filteredUsers.slice(startIndex, startIndex + itemsPerPage);

    if (loading)
        return <p className="text-center mt-10 text-gray-400">Loading users...</p>;

    return (
        <AdminLayout>
            <div className="flex-1 px-2 sm:px-4 md:px-5 py-10 ml-0">
                <h3 className="text-3xl font-bold text-center mb-6 mt-10">
                    Inactive Users
                </h3>

                {/* Top Controls */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center justify-between mb-4">
                    <select
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(
                                e.target.value === "all"
                                    ? "all"
                                    : Number(e.target.value)
                            );
                            setCurrentPage(1);
                        }}
                        className="px-3 py-2 bg-gray-800 border rounded text-sm w-full sm:w-auto"
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value="all">All</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 border border-white/20 rounded-md bg-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 outline-none w-full sm:w-64 transition-all duration-200 text-sm"
                    />
                </div>

                {/* Table */}
                <div className="overflow-x-auto max-w-full bg-white/10 rounded-xl p-2 sm:p-4">
                    <table className="min-w-full text-center text-sm">
                        <thead className="bg-white/10">
                            <tr>
                                <th className="px-4 py-3 text-center">S.No</th>
                                <th className="px-4 py-3 text-center">ID</th>
                                <th className="px-4 py-3 text-center">Email</th>
                                <th className="px-4 py-3 text-center">Status</th>
                                {/* <th className="px-4 py-3 text-center">Date</th> */}
                                <th className="px-4 py-3 text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedUsers.length > 0 ? (
                                paginatedUsers.map((user, index) => (
                                    <tr key={user.id} className="border-t">
                                        <td className="px-4 py-3">{index + 1}</td>

                                        <td
                                            className="text-cyan-400 cursor-pointer"
                                            onClick={() =>
                                                navigate(
                                                    `${adminRoutes}userdetails/${user.id}`
                                                )
                                            }
                                        >
                                            {user.id}
                                        </td>

                                        <td>{user.email}</td>

                                        <td className="text-red-500 font-semibold">
                                            {user.user_status}
                                        </td>

                                        {/* <td>
                                            {new Date(
                                                user.account_created_at
                                            ).toLocaleString()}
                                        </td> */}

                                        <td>
                                            <button
                                                className="bg-red-500 px-3 py-1 rounded"
                                                onClick={() =>
                                                    window.open(
                                                        `${adminRoutes}user/${user.id}`,
                                                        "_blank"
                                                    )
                                                }
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">No inactive users</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (simple version) */}
                {itemsPerPage !== "all" && totalPages > 1 && (
                    <div className="flex justify-center mt-4 space-x-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            Prev
                        </button>

                        <span>
                            {currentPage} / {totalPages}
                        </span>

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default InactiveUsers;