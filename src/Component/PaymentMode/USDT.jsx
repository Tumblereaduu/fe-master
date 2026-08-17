import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { BACKEND_API_URL } from "../../api/config";
import AdminLayout from "../Admin/AdminLayout";

const USDT = () => {
    const [qrFile, setQrFile] = useState(null);
    const [qrPreview, setQrPreview] = useState(null);
    const [depositStatus, setDepositStatus] = useState("inactive");
    const [withdrawalStatus, setWithdrawalStatus] = useState("inactive");
    const [address, setAddress] = useState("");
    const fileInputRef = useRef(null);
    const trcFileInputRef = useRef(null);
    const ercFileInputRef = useRef(null);

    // USDT TRC 20

    const [trcQrFile,setTrcQrFile] = useState(null);
    const [trcQrPreview,setTrcQrPreview] = useState(null);
    const [trcAddress,setTrcAddress] = useState("");
    const [trcDepositStatus,setTrcDepositStatus] = useState("inactive");
    const [trcWithdrawStatus,setTrcWithdrawStatus] = useState("inactive");

    // USDT ERC 20 

    const [ercQrFile,setErcQrFile] = useState(null);
    const [ercQrPreview,setErcQrPreview] = useState(null);
    const [ercAddress,setErcAddress] = useState("");
    const [ercDepositStatus,setErcDepositStatus] = useState("inactive");
    const [ercWithdrawStatus,setErcWithdrawStatus] = useState("inactive");

    // ALL three OR code file here
    const handleQrFileChange = (e,type)=>{
        const file = e.target.files[0];
        if(!file) return;

        const preview = URL.createObjectURL(file);

        if(type === "bep20"){
            setQrFile(file);
            setQrPreview(preview);
            toast.success("USDT BEP 20 QR Uploaded successfully");
        }

        if(type === "trc20"){
            setTrcQrFile(file);
            setTrcQrPreview(preview);
            toast.success("USDT TRC 20 OR Uploaded successfully");
        }

        if (type === "erc20"){
            setErcQrFile(file);
            setErcQrPreview(preview);
            toast.success("USDT ERC 20 OR  Uploaded successfully");
        }
    }

    // USDT BEP 20
    const handleSave = async () => {
        if (!address) return toast.error("Please enter a USDT address.");

        try {
            const formData = new FormData();
            formData.append("payment_mode", "USDT");
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

    // USDT TRC 20 

    const handleUSDTTRC20 = async ()=>{
        if(!trcAddress){
           return toast.error("Please fill the address")
        }
        try {
            const formData = new FormData();
            formData.append("payment_mode", "usdttrc20");
            formData.append("address",trcAddress);
            formData.append("deposit_status",trcDepositStatus);
            formData.append("withdrawal_status",trcWithdrawStatus);
            formData.append("qr_code",trcQrFile);

            const response = await axios.post(`${BACKEND_API_URL}/payment/create`, formData,{
                headers : {"Content-Type" : "multipart/form-data"},
            });

            if (response.data.success){
                toast.success("Payment saved successfully");
            }else{
                toast.error(response.data.message || "Failed to save USDT_TRC_20");
            }
            
        } catch (error) {
            console.error("Error while saving USDT_TRC_20",error);
            toast.error("Server error while uploading usdt_trc_20");
        }
    }

    // USDT ERC 20 

    const handleUSDERC20 = async ()=>{
           if(!ercAddress){
            toast.error("Please upload the ERCAddress");
           }
        try {
                const formData = new FormData()
                formData.append("payment_mode", "usdterc20");
                formData.append("address",ercAddress);
                formData.append("deposit_staus",ercDepositStatus);
                formData.append("withdrawal_status",ercWithdrawStatus);
                formData.append("qr_code",ercQrFile);
        
                const response = await axios.post(`${BACKEND_API_URL}/payment/create`, formData,{
                    headers:{"Content-Type": "multipart/form-data"},
                });

                if(response.data.success){
                    toast.success("USDT ERC 20 Payment saved successfully");
                }else{
                    toast.error(response.data.message || "Failed to save USDT_ERC_20")
                }
        } catch (error) {
            console.error("Error while saveing USDT_ERC_20", error);
            toast.error("Server error while uploading USDT_ERC_20");
        }
    }

    // All three USDT get method used

    useEffect(()=>{
        const fetchValue = async (type,setters)=>{
            try {
                const response = await axios.get(`${BACKEND_API_URL}/payment/get`,{
                  params:{payment_mode: type}
            });
            
                if(response.data.success && response.data.data.length > 0){
                    const data = response.data.data[0];
                    setters.setAddress(data.address || "");
                    setters.setDeposit(data.deposit_status || "inactive");
                    setters.setWithdrawal(data.withdrawal_status || "inactive");
                    setters.setQR(data.qr_code || null);
                }
            } catch (error) {
                console.error(`Error while fetching ${type}`, error)
            }
        };
        
        fetchValue("USDT",{ setAddress, setDeposit:setDepositStatus, setWithdrawal:setWithdrawalStatus, setQR:setQrPreview });
        fetchValue("usdttrc20", {setAddress : setTrcAddress, setDeposit: setTrcDepositStatus, setWithdrawal:setTrcWithdrawStatus, setQR: setTrcQrPreview });
        fetchValue("usdterc20", {setAddress: setErcAddress, setDeposit: setErcDepositStatus, setWithdrawal: setErcWithdrawStatus, setQR: setErcQrPreview});
        
    },[])

    return (
        <AdminLayout>
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />

            {/* USDT BEP 20 */}

                <div className="max-w-4xl h-fit mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
                    <h2 className="text-2xl font-bold mb-6 text-white border-b pb-2">
                        USDT BEP 20 Payment Settings
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
                                onClick={()=> fileInputRef.current.click()}
                                className="px-4 py-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 hover:scale-105 transition-all duration-200"
                            >
                                Upload QR
                            </button>

                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={(e)=> handleQrFileChange((e),"bep20")}
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

                    {/* USDT Address */}
                    <div className="mb-6">
                        <label className="block text-white/80 font-semibold mb-2">
                            USDT Address:
                        </label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter USDT wallet address"
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
            
             {/* USDT TRC 20 */}

                <div className="max-w-4xl h-fit mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
                    <h2 className="text-2xl font-bold mb-6 text-white border-b pb-2">
                        USDT TRC 20 Payment Settings
                    </h2>

                    {/* QR Code Section */}
                    <div className="mb-6">
                        <label className="block text-white/80 font-semibold mb-2">
                            QR Code:
                        </label>
                        <div className="flex items-center gap-6">
                            <div className="w-40 h-40 bg-white/10 flex items-center justify-center rounded-lg border border-white/20 overflow-hidden">
                                {trcQrPreview ? (
                                    <img
                                        src={trcQrPreview}
                                        alt="QR Code Preview"
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <span className="text-white/50 text-sm">No QR uploaded</span>
                                )}
                            </div>

                            <button
                                onClick={()=> trcFileInputRef.current.click()}
                                className="px-4 py-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 hover:scale-105 transition-all duration-200"
                            >
                                Upload QR
                            </button>

                            <input
                                type="file"
                                accept="image/*"
                                ref={trcFileInputRef}
                                className="hidden"
                                onChange={(e)=> handleQrFileChange(e,'trc20')}
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
                                value={trcDepositStatus}
                                onChange={(e) => setTrcDepositStatus(e.target.value)}
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
                                value={trcWithdrawStatus}
                                onChange={(e) => setTrcWithdrawStatus(e.target.value)}
                                className="w-full border border-white/20 bg-white/10 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-400"
                            >
                                <option className="bg-gray-600" value="active">Active</option>
                                <option className="bg-gray-600" value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    {/* USDT Address */}
                    <div className="mb-6">
                        <label className="block text-white/80 font-semibold mb-2">
                            USDT Address:
                        </label>
                        <input
                            type="text"
                            value={trcAddress}
                            onChange={(e) => setTrcAddress(e.target.value)}
                            placeholder="Enter USDT wallet address"
                            className="w-full border border-white/20 bg-white/10 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-400 placeholder-white/50"
                        />
                    </div>

                    {/* Save Button */}
                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={handleUSDTTRC20}
                            className="px-6 py-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 text-white font-medium rounded-lg hover:opacity-90 hover:scale-105 transition-all duration-200"
                        >
                            Save USDT TRC 20 Changes
                        </button>
                    </div>
                </div>

              {/* USDT ERC 20 */}

                  <div className="max-w-4xl h-fit mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
                    <h2 className="text-2xl font-bold mb-6 text-white border-b pb-2">
                        USDT ERC 20 Payment Settings
                    </h2>

                    {/* QR Code Section */}
                    <div className="mb-6">
                        <label className="block text-white/80 font-semibold mb-2">
                            QR Code:
                        </label>
                        <div className="flex items-center gap-6">
                            <div className="w-40 h-40 bg-white/10 flex items-center justify-center rounded-lg border border-white/20 overflow-hidden">
                                {ercQrPreview ? (
                                    <img
                                        src={ercQrPreview}
                                        alt="QR Code Preview"
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <span className="text-white/50 text-sm">No QR uploaded</span>
                                )}
                            </div>

                            <button
                                onClick={()=> ercFileInputRef.current.click()}
                                className="px-4 py-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 hover:scale-105 transition-all duration-200"
                            >
                                Upload QR
                            </button>

                            <input
                                type="file"
                                accept="image/*"
                                ref={ercFileInputRef}
                                className="hidden"
                                onChange={(e)=> handleQrFileChange(e,"erc20")}
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
                                value={ercDepositStatus}
                                onChange={(e) => setErcDepositStatus(e.target.value)}
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
                                value={ercWithdrawStatus}
                                onChange={(e) => setErcWithdrawStatus(e.target.value)}
                                className="w-full border border-white/20 bg-white/10 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-400"
                            >
                                <option className="bg-gray-600" value="active">Active</option>
                                <option className="bg-gray-600" value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    {/* USDT Address */}
                    <div className="mb-6">
                        <label className="block text-white/80 font-semibold mb-2">
                            USDT ERC 20 Address:
                        </label>
                        <input
                            type="text"
                            value={ercAddress}
                            onChange={(e) => setErcAddress(e.target.value)}
                            placeholder="Enter USDT wallet address"
                            className="w-full border border-white/20 bg-white/10 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-400 placeholder-white/50"
                        />
                    </div>

                    {/* Save Button */}
                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={handleUSDERC20}
                            className="px-6 py-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 text-white font-medium rounded-lg hover:opacity-90 hover:scale-105 transition-all duration-200"
                        >
                            Save USDT ERC 20 Changes
                        </button>
                    </div>
                </div>

            </AdminLayout>
    );
};

export default USDT;
