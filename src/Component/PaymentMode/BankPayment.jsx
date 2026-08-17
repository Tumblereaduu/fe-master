import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BACKEND_API_URL } from "../../api/config";
import AdminLayout from "../Admin/AdminLayout";

const BankPayment = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [depositStatus, setDepositStatus] = useState("inactive");
  const [withdrawalStatus, setWithdrawalStatus] = useState("inactive");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [accountName, setAccountName] = useState("");
  const [bankName, setBankName] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [bankCity, setBankCity] = useState("");
  const [country, setCountry] = useState("");
  const [isUsed, setIsUsed] = useState("inactive");

  // Fetching the data from db for USDT

  useEffect(() => {
    if (!id) return;

    const fetchBankById = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_URL}/payment/${id}`);
        console.log("Fetched response:", response.data);

        if (response.data.success && response.data.data) {
          const record = Array.isArray(response.data.data)
            ? response.data.data[0]
            : response.data.data;

          setDepositStatus(record.deposit_status || "inactive");
          setWithdrawalStatus(record.withdrawal_status || "inactive");
          setAccountNumber(record.bank_account_number || "");
          setIfscCode(record.bank_ifsc_code || "");
          setAccountName(record.bank_account_name || "");
          setBankName(record.bank_name || "");
          setPostalCode(record.bank_postal_code || "");
          setBankCity(record.bank_city || "");
          setCountry(record.country || "");
          setIsUsed(record.is_used || "inactive");
        } else {
          toast.error(response.data.message || "Bank not found");
        }
      } catch (error) {
        console.error("Error fetching bank by ID:", error);
        toast.error("Server error while fetching bank details");
      }
    };

    fetchBankById();
  }, [id]);


  const handleSave = async () => {
    if (!accountNumber || !ifscCode || !accountName || !bankName) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("payment_mode", "bank_transfer");
      formData.append("deposit_status", depositStatus);
      formData.append("withdrawal_status", withdrawalStatus);
      formData.append("bank_account_number", accountNumber);
      formData.append("bank_ifsc_code", ifscCode);
      formData.append("bank_account_name", accountName);
      formData.append("bank_name", bankName);
      formData.append("bank_postal_code", postalCode);
      formData.append("bank_city", bankCity);
      formData.append("country", country);
      formData.append("is_used", isUsed);

      const response = await axios.post(
        `${BACKEND_API_URL}/payment/create`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Bank transfer saved successfully!");
        // Reset form
        setAccountNumber("");
        setIfscCode("");
        setAccountName("");
        setBankName("");
        setPostalCode("");
        setBankCity("");
        setCountry("");
        setDepositStatus("inactive");
        setWithdrawalStatus("inactive");
        setIsUsed("inactive");
      } else {
        toast.error(response.data.message || "Failed to save payment");
      }
    } catch (error) {
      console.error("Error saving bank transfer:", error);
      toast.error("Server error while saving bank transfer.");
    }
  };

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={3000} />
        <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/20">
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-white/90 border-b border-white/20 pb-2 flex justify-between flex-wrap gap-2">
            Bank Transfer Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
            {/* Deposit & Withdrawal */}
            <div>
              <label className="block text-white font-semibold mb-2 text-sm md:text-base">
                Deposit Status:
              </label>
              <select
                value={depositStatus}
                onChange={(e) => setDepositStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300"
              >
                <option className="bg-gray-600" value="active">Active</option>
                <option className="bg-gray-600" value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2 text-sm md:text-base">
                Withdrawal Status:
              </label>
              <select
                value={withdrawalStatus}
                onChange={(e) => setWithdrawalStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300"
              >
                <option className="bg-gray-600" value="active">Active</option>
                <option className="bg-gray-600" value="inactive">Inactive</option>
              </select>
            </div>

            {/* Bank fields */}
            <div>
              <label className="block text-white font-semibold mb-2 text-sm md:text-base">
                Bank Account Number:
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter bank account number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2 text-sm md:text-base">
                IFSC Code:
              </label>
              <input
                type="text"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value)}
                placeholder="Enter IFSC code"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2 text-sm md:text-base">
                Account Holder Name:
              </label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Enter account holder name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2 text-sm md:text-base">
                Bank Name:
              </label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Enter bank name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2 text-sm md:text-base">
                Postal Code:
              </label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="Enter postal code"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2 text-sm md:text-base">
                Bank City:
              </label>
              <input
                type="text"
                value={bankCity}
                onChange={(e) => setBankCity(e.target.value)}
                placeholder="Enter bank city"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2 text-sm md:text-base">
                Country:
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Enter country"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2 text-sm md:text-base">
                Is Used:
              </label>
              <select
                value={isUsed}
                onChange={(e) => setIsUsed(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300"
              >
                <option className="bg-gray-600" value="active">Active</option>
                <option className="bg-gray-600" value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-6 md:mt-8 flex justify-center md:justify-end">
            <button
              onClick={handleSave}
              className="px-4 md:px-6 py-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-2xl font-semibold hover:opacity-90 transition text-sm md:text-base"
            >
              Save Bank Account
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  };

  export default BankPayment;
