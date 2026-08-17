import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BACKEND_API_URL } from '../../api/config';
import AdminLayout from "../Admin/AdminLayout";

const CreateBanner = () => {
    const [image, setImage] = useState(null);
    // Added selectedFile state to reliably track the actual file object
    const [selectedFile, setSelectedFile] = useState(null);
    const [status, setStatus] = useState("active");
    // New state for location to ensure strict separation
    const [location, setLocation] = useState("dashboard");

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Store the actual file object for form submission
            setSelectedFile(file);
            // Create preview URL
            setImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        // Check using selectedFile instead of image string for reliability
        if (!selectedFile) {
            toast.warning("please slect an image!");
            return;
        }

        const formData = new FormData(); 
        // Use selectedFile directly instead of document.getElementById
        formData.append("image", selectedFile);
        formData.append("status", status);
        // Appending location to separate banners for different pages
        formData.append("location", location);

        try {
            const res = await axios.post(`${BACKEND_API_URL}/banner`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (res.data.success) {
                toast.success("Image create successfully!");
                // Clear all states after success
                setImage(null);
                setSelectedFile(null);
                setStatus("active");
                setLocation("dashboard"); // Reset location
                // Also reset the file input element
                document.getElementById("bannerUpload").value = "";
            }
        } catch (error) {
            console.error(error);
            toast.error("Error uploading banner")
        }
    }

    return (
        <AdminLayout>
            {/* Main Content */}
            <div className="flex-1 p-4 md:p-5 lg:p-6 mt-12 md:mt-14">
                <h1 className="text-xl md:text-2xl flex justify-center font-bold mb-6 text-white/90">Create Banner</h1>

                <div className="bg-white/10 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl max-w-lg mx-auto border border-white/20">
                    <div className="flex flex-col items-center gap-4">
                        {/* Image Preview */}
                        {image ? (
                            <img src={image} alt="Banner Preview" className="w-full h-48 md:h-64 object-cover rounded-lg" />
                        ) : (
                            <div className="w-full h-48 md:h-64 bg-white/10 border border-white/20 flex items-center justify-center rounded-xl text-white/50 text-sm">
                                No Image Selected
                            </div>
                        )}

                        {/* Upload Button */}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="bannerUpload"
                        />
                        <label
                            htmlFor="bannerUpload"
                            className="cursor-pointer bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 hover:opacity-90 text-white px-6 py-2 rounded-2xl font-semibold transition text-sm md:text-base"
                        >
                            Upload Image
                        </label>

                        {/* Location Selector - Added for Strict Separation */}
                        <div className="w-full flex items-center justify-between mt-4 flex-wrap gap-2">
                            <label className="font-medium text-white text-sm md:text-base">Page Location:</label>
                            <select
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="bg-white/10 border border-white/20 rounded-xl px-3 py-1 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm"
                            >
                                <option className="bg-gray-600" value="dashboard">Main Dashboard</option>
                                <option className="bg-gray-600" value="ib_dashboard">IB Dashboard</option>
                            </select>
                        </div>

                        {/* Status Selector */}
                        <div className="w-full flex items-center justify-between mt-4 flex-wrap gap-2">
                            <label className="font-medium text-white text-sm md:text-base">Status:</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="bg-white/10 border border-white/20 rounded-xl px-3 py-1 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm"
                            >
                                <option className="bg-gray-600"  value="active">Active</option>
                                <option className="bg-gray-600"  value="inactive">Inactive</option>
                            </select>
                        </div>

                        {/* Submit Button */}
                        <button className="mt-6 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg text-sm md:text-base" onClick={handleSubmit}>
                            Save Banner
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default CreateBanner;
