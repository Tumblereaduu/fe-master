import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_API_URL } from "../../api/config";
import AdminLayout from "../Admin/AdminLayout";

const SetValue = () => {
    const [formData, setFormData] = useState({
        minimum_deposit: "",
        minimum_withdrawal: "",
        inr_value: "",
        bit_coin_value: "",
        deposit_fee: "",
        withdrawal_fee: "",
    });


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BACKEND_API_URL}/values/getdata`);
                if (response.data.success && response.data.data) {
                    setFormData(response.data.data)
                }
            } catch (error) {
                console.error("Error fetching values:", error);
                toast.error("Failed to fetch current values");
            }
        }
        fetchData()
    },[])

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        const { minimum_deposit, minimum_withdrawal, inr_value, bit_coin_value, deposit_fee, withdrawal_fee } = formData;

        if (!minimum_deposit || !minimum_withdrawal || !inr_value || !bit_coin_value || !deposit_fee || !withdrawal_fee) {
            toast.warning("please fill out all feilds");
            return;
        }

        try {
            const res = await axios.post(`${BACKEND_API_URL}/values`, formData);

            if (res.data.success) {
                toast.success("Values saved successfully!");
                // setFormData({
                //     minimum_deposit: "",
                //     minimum_withdrawal: "",
                //     inr_value: "",
                //     deposit_fee: "",
                //     withdrawal_fee: "",
                // });
            } else {
                toast.error(res.data.message || "Failed to save values");
            }
        } catch (error) {
            console.error("Error saving values:", error);
            toast.error("Server error, please try again later.");
        }
    };

    return (
        <AdminLayout>
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />
            <div className="flex-1 flex flex-col justify-center items-center p-4 md:p-6 mt-6 md:mt-10 relative overflow-hidden">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-3xl animate-fade-in"
                >
                    <h1 className="text-3xl font-semibold text-center mb-5 tracking-wide text-white/90">
                        Payment Configuration
                    </h1>

                    <div className="space-y-5.5">
                        {/* Minimum Deposit */}
                        <div className="flex flex-col">
                            <label className="text-sm text-white/70 mb-2">
                                Minimum Deposit (USD)
                            </label>
                            <input
                                type="text"
                                name="minimum_deposit"
                                value={formData.minimum_deposit}
                                onChange={handleChange}
                                placeholder="Enter amount"
                                className="p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-200"
                            />
                        </div>

                        {/* Minimum Withdrawal */}
                        <div className="flex flex-col">
                            <label className="text-sm text-white/70 mb-2">
                                Minimum Withdrawal (USD)
                            </label>
                            <input
                                type="text"
                                name="minimum_withdrawal"
                                value={formData.minimum_withdrawal}
                                onChange={handleChange}
                                placeholder="Enter amount"
                                className="p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-200"
                            />
                        </div>


                        {/* INR Value */}
                        <div className="flex flex-col">
                            <label className="text-sm text-white/70 mb-2">
                                INR Conversion Rate
                            </label>
                            <input
                                type="text"
                                name="inr_value"
                                value={formData.inr_value}
                                onChange={handleChange}
                                placeholder="Enter INR value"
                                className="p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-200"
                            />
                        </div>

                    {/* BITCOIN Value */}
                        <div className="flex flex-col">
                            <label className="text-sm text-white/70 mb-2">
                                BIT COIN VALUE
                            </label>
                            <input
                                type="text"
                                name="bit_coin_value"
                                value={formData.bit_coin_value}
                                onChange={handleChange}
                                placeholder="Enter BITCOIN value"
                                className="p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-200"
                            />
                        </div>

                        {/* Deposit Fee */}
                        <div className="flex flex-col">
                            <label className="text-sm text-white/70 mb-2">
                                Deposit Fee (%)
                            </label>
                            <input
                                type="text"
                                name="deposit_fee"
                                value={formData.deposit_fee}
                                onChange={handleChange}
                                placeholder="Enter fee percentage"
                                className="p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all duration-200"
                            />
                        </div>

                        {/* Withdrawal Fee */}
                        <div className="flex flex-col">
                            <label className="text-sm text-white/70 mb-2">
                                Withdrawal Fee (%)
                            </label>
                            <input
                                type="text"
                                name="withdrawal_fee"
                                value={formData.withdrawal_fee}
                                onChange={handleChange}
                                placeholder="Enter fee percentage"
                                className="p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-rose-400 transition-all duration-200"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center mt-8">
                        <button
                            type="submit"
                            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:opacity-90 hover:scale-105 transition-all duration-200"
                        >
                            Save
                        </button>
                    </div>
                </form>

                {/* Background gradient orbs */}
                {/* <div className="absolute top-20 right-40 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-40 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div> */}
            </div>
        </AdminLayout>
    );
};

export default SetValue;
