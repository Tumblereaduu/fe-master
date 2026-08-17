import React, { useState, useRef, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { BACKEND_API_URL } from '../../api/config';
import { adminRoutes } from '../../App';
import AdminLayout from "../Admin/AdminLayout";

const AddBank = () => {
  const [bankList, setBankList] = useState([]);
  const navigate = useNavigate();

  // Fetch bank list from backend
  const fetchBanks = async () => {
    try {
      const res = await axios.get(`${BACKEND_API_URL}/payment/payments`);
      if (res.data.success) {
        const allBanks = res.data.data[0] || [];
        const bankTransfer = allBanks.filter(bank => bank.payment_mode === "bank_transfer");
        setBankList(bankTransfer);
      }
    } catch (err) {
      console.error("Error fetching banks:", err);
      toast.error("Failed to fetch banks");
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  // Toggle is_used status
 const handleStatusToggle = (bank) => {
  const newStatus = bank.is_used === "active" ? "inactive" : "active";

  confirmAlert({
    title: "Confirm Status Change",
    message: `Are you sure you want to change status to "${newStatus}"?`,
    buttons: [
      {
        label: "Yes",
        onClick: async () => {
          try {
            const response = await axios.put(
              `${BACKEND_API_URL}/payment/toggle-is-used/${bank.id}`,
              { is_used: newStatus }
            );

            if (response.data.success) {
              toast.success("Status updated successfully!");
              setBankList((prev) =>
                prev.map((b) =>
                  b.id === bank.id ? { ...b, is_used: newStatus } : b
                )
              );
            } else {
              toast.error(response.data.message || "Failed to update status");
            }
          } catch (err) {
            console.error("Error updating status:", err);
            toast.error("Server error while updating status.");
          }
        },
      },
      {
        label: "No",
        onClick: () => {
          toast.info("Action cancelled");
        },
      },
    ],
  });
};

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={3000} />
        <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/20">
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-white/90 border-b border-white/20 pb-2 flex justify-between flex-wrap gap-2">
            Bank Accounts
            <h2
              className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 px-3 py-1 rounded-xl cursor-pointer text-white text-sm md:text-base"
              onClick={() => navigate(`${adminRoutes}banktransfer`)}
            >
              Add Bank
            </h2>
          </h2>

          <div className="overflow-x-auto max-w-full">
            <table className="w-full border border-white/20 rounded-xl text-white text-sm">
              <thead className="bg-white/10">
                <tr className="text-center text-white/70">
                  <th className="py-2 md:py-3 px-2 md:px-4 border-b border-white/20">ID</th>
                  <th className="py-2 md:py-3 px-2 md:px-4 border-b border-white/20">Country</th>
                  <th className="py-2 md:py-3 px-2 md:px-4 border-b border-white/20">Account Number</th>
                  <th className="py-2 md:py-3 px-2 md:px-4 border-b border-white/20">IFSC Code</th>
                  <th className="py-2 md:py-3 px-2 md:px-4 border-b border-white/20">Account Name</th>
                  <th className="py-2 md:py-3 px-2 md:px-4 border-b border-white/20">Bank Name</th>
                  <th className="py-2 md:py-3 px-2 md:px-4 border-b border-white/20 text-center">Status</th>
                  <th className="py-2 md:py-3 px-2 md:px-4 border-b border-white/20 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {bankList.length > 0 ? (
                  bankList.map((bank, index) => (
                    <tr key={bank.id} className="text-center hover:bg-white/5 transition text-xs md:text-sm">
                      <td className="py-2 md:py-3 px-2 md:px-4 border-b border-white/10">{index + 1}</td>
                      <td className="py-2 md:py-3 px-2 md:px-4 border-b border-white/10">{bank.country}</td>
                      <td className="py-2 md:py-3 px-2 md:px-4 border-b border-white/10">{bank.bank_account_number}</td>
                      <td className="py-2 md:py-3 px-2 md:px-4 border-b border-white/10">{bank.bank_ifsc_code}</td>
                      <td className="py-2 md:py-3 px-2 md:px-4 border-b border-white/10">{bank.bank_account_name}</td>
                      <td className="py-2 md:py-3 px-2 md:px-4 border-b border-white/10">{bank.bank_name}</td>
                      <td className="py-2 md:py-3 px-2 md:px-4 border-b text-center border-white/10">
                        <button
                          className={`px-2 md:px-3 py-1 text-xs rounded-xl transition ${
                            bank.is_used === "active"
                              ? "bg-green-500/80 hover:bg-green-600"
                              : "bg-red-500/80 hover:bg-red-600"
                          }`}
                          onClick={() => handleStatusToggle(bank)}
                        >
                          {bank.is_used || "inactive"}
                        </button>
                      </td>
                      <td className="py-2 md:py-3 px-2 md:px-4 border-b border-white/10">
                        <button
                          className="px-2 md:px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          onClick={() => navigate(`${adminRoutes}banktransfer/${bank.id}`)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-6 text-gray-500">
                      No bank records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </AdminLayout>
    );
  };

  export default AddBank;
