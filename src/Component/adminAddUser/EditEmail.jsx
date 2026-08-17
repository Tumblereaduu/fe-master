import React, { useEffect, useState } from "react";
import AdminLayout from "../Admin/AdminLayout";
import "react-toastify/dist/ReactToastify.css"
import { ToastContainer, Slide, toast } from "react-toastify";
import axios from "axios";
import { BACKEND_API_URL } from "../../api/config";

const EditEmail = () => {
    const [description, setDescription] = useState("");
    const [email, setEmail] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BACKEND_API_URL}/contact`);
                if (response.data.data && response.data.data.length > 0) {
                    const details = response.data.data[0]
                    setDescription(details.description);
                    setEmail(details.email);
                    setWhatsapp(details.whatsapp_number);

                }
            } catch (error) {
                console.error("Fetch Error:", error);
                toast.error("Failed to load existing data");
            }
            finally {
                setLoading(false);
            }
        };
        fetchData()
    }, [])

    const handleSubmit = async () => {
        if (!description || !email || !whatsapp) {
            toast.error("All feilds are required");
            return
        }
        setLoading(true);
        try {
            const response = await axios.put(`${BACKEND_API_URL}/contact`, {
                description,
                whatsapp_number: whatsapp,
                email,
            }
            );
            toast.success(response.data.message || "Saved successfully");
        } catch (error) {
            console.error("Submit Error:", error);
            toast.error("Server Error. Try again!");
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <AdminLayout>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} pauseOnFocusLoss draggable transition={Slide} />

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-4 md:p-6 relative overflow-hidden">

                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-xl">
                    <h1 className="text-2xl font-bold text-center mb-6 text-white/90">
                        Edit Contact Details
                    </h1>

                    {/* Description */}
                    <div className="mb-4">
                        <label className="block text-white/70 font-semibold mb-2">
                            Description:
                        </label>
                        <input
                            type="text"
                            placeholder="Enter a Description"
                            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-white/70 font-semibold mb-2">
                            Email:
                        </label>
                        <input
                            type="text"
                            placeholder="Enter an Email"
                            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* WhatsApp */}
                    <div className="mb-6">
                        <label className="block text-gray-700 font-semibold mb-2">
                            WhatsApp:
                        </label>
                        <input
                            type="text"
                            placeholder="Enter a WhatsApp Number"
                            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-lime-400"
                            value={whatsapp}
                            onChange={(e) => setWhatsapp(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`w-full py-2 rounded-lg font-semibold text-white transition 
                            ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}
                        `}
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>

            </div>
        </AdminLayout>
    );
};

export default EditEmail;
