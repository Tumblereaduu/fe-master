import React, { useRef, useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { BACKEND_API_URL } from "../../api/config";
import AdminLayout from "../Admin/AdminLayout";

const Crypto = () => {
    const [qrFile, setQrFile] = useState(null);
    const [qrPreview, setQrPreview] = useState(null);
    const [depositStatus, setDepositStatus] = useState("inactive");
    const [withdrawalStatus, setWithdrawalStatus] = useState("inactive");
    const [address, setAddress] = useState("");
    const fileInputRef = useRef(null);

    //  Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setQrFile(file);
            setQrPreview(URL.createObjectURL(file));
            toast.success("BITCOIN code uploaded successfully!");
        }
    };

    //  Handle upload button click
    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    //  Handle Save
    const handleSave = async () => {
        if (!address) return toast.error("Please enter a UPI address.");
        if (!qrFile) return toast.error("Please upload a QR code.");

        try {
            const formData = new FormData();
            formData.append("payment_mode", "bitcoin");
            formData.append("address", address);
            formData.append("deposit_status", depositStatus);
            formData.append("withdrawal_status", withdrawalStatus);
            formData.append("qr_code", qrFile);

            const response = await axios.post(`${BACKEND_API_URL}/payment/create`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.success) {
                toast.success("Payment saved successfully!");
                setAddress("");
                setQrFile(null);
                setQrPreview(null);
                setDepositStatus("inactive");
                setWithdrawalStatus("inactive");
            } else {
                toast.error(response.data.message || "Failed to save payment");
            }
        } catch (error) {
            console.error("Error saving payment mode:", error);
            toast.error("Server error while saving payment mode.");
        }
    };

    // Fetching the data from db for UPI
    useEffect(() => {
        const fetchUPI = async () => {
            try {
                const response = await axios.get(`${BACKEND_API_URL}/payment/get`, {
                    params: { payment_mode: "bitcoin" },
                });
                if (response.data.success) {
                    const data = response.data.data[0];
                    setAddress(data.address || "");
                    setDepositStatus(data.deposit_status || "inactive");
                    setWithdrawalStatus(data.withdrawal_status || "inactive");
                    setQrPreview(data.qr_code || null);
                } else {
                    toast.error(response.data.message || "Failed to load payment mode");
                }
            } catch (error) {
                console.error("Error fetching payment mode:", error);
                toast.error("Server error while fetching payment mode");
            }
        };
        fetchUPI();
    }, []);

    return (
        <AdminLayout>
            {/* Sidebar */}
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />
                <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
                    <h2 className="text-2xl font-bold mb-6 text-white border-b pb-2">
                        CRYPTO Payment Settings
                    </h2>

                    {/* QR Code Section */}
                    <div className="mb-6">
                        <label className="block text-white/80 font-semibold mb-2">
                            QR Code:
                        </label>
                        <div className="flex items-center gap-6">
                            <div className="w-40 h-40 bg-white/10 flex items-center justify-center rounded-lg border border-white/20 overflow-hidden">
                                {qrPreview ? (
                                    <img
                                        src={qrPreview}
                                        alt="QR Code Preview"
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <span className="text-white/50 text-sm">No QR uploaded</span>
                                )}
                            </div>

                            <button
                                onClick={handleUploadClick}
                                className="px-4 py-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 hover:scale-105 transition-all duration-200"
                            >
                                Upload QR
                            </button>

                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>

                    {/* Deposit & Withdrawal Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-white/80 font-semibold mb-2">
                                Deposit Status:
                            </label>
                            <select
                                value={depositStatus}
                                onChange={(e) => setDepositStatus(e.target.value)}
                                className="w-full border border-white/20 bg-white/10 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-400"
                            >
                                <option className="bg-gray-600" value="active">Active</option>
                                <option className="bg-gray-600" value="inactive">Inactive</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-white/80 font-semibold mb-2">
                                Withdrawal Status:
                            </label>
                            <select
                                value={withdrawalStatus}
                                onChange={(e) => setWithdrawalStatus(e.target.value)}
                                className="w-full border border-white/20 bg-white/10 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-400"
                            >
                                <option className="bg-gray-600" value="active">Active</option>
                                <option className="bg-gray-600" value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    {/* UPI Address */}
                    <div className="mb-6">
                        <label className="block text-white/80 font-semibold mb-2">
                            Crypto Address:
                        </label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter UPI ID or wallet address"
                            className="w-full border border-white/20 bg-white/10 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-400 placeholder-white/50"
                        />
                    </div>

                    {/* Save Button */}
                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 text-white font-medium rounded-lg hover:opacity-90 hover:scale-105 transition-all duration-200"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </AdminLayout>
    );
};

export default Crypto;
