import React, { useState } from "react";
import NavbarForAccount from "../NavbarForAccount";
import { BACKEND_API_URL } from "../../api/config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AccountDelete = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    contactNumber: "",
    password: "",
    reason: "",
  });

  const [error, setError] = useState("");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleContactChange = (e) => {
    const value = e.target.value.replace(/[^\d+\s-]/g, "");

    setFormData((prev) => ({
      ...prev,
      contactNumber: value,
    }));

    setError("");
  };

  const validateForm = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const contactDigits = formData.contactNumber.replace(/\D/g, "");

    if (
      !formData.email.trim() ||
      !formData.name.trim() ||
      !formData.contactNumber.trim() ||
      !formData.password.trim() ||
      !formData.reason.trim()
    ) {
      toast.error("Please fill all the required fields.");
      return false;
    }

    if (!emailPattern.test(formData.email.trim())) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    if (contactDigits.length < 7 || contactDigits.length > 15) {
      toast.error("Please enter a valid contact number.");
      return false;
    }

    if (formData.reason.trim().length < 10) {
      toast.error(
        "Please provide a clear reason with at least 10 characters."
      );
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setError("");
    setShowConfirmPopup(true);
  };

  const handleConfirmDelete = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const deletePayload = {
        email: formData.email.trim(),
        name: formData.name.trim(),
        contact_number: formData.contactNumber.trim(),
        password: formData.password,
        reason: formData.reason.trim(),
      };

      const response = await fetch(
        `${BACKEND_API_URL}/accountdelete/account-delete-request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(deletePayload),
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        data = {
          success: false,
          message: "Invalid response received from the server.",
        };
      }

      if (!response.ok || !data.success) {
        setShowConfirmPopup(false);

        toast.error(
          data.message || "Unable to submit account deletion request.",
          {
            toastId: "account-delete-error",
          }
        );

        return;
      }

      setShowConfirmPopup(false);

      toast.success(
        data.message ||
          "Account deletion request submitted successfully.",
        {
          toastId: "account-delete-success",
        }
      );

      setFormData({
        email: "",
        name: "",
        contactNumber: "",
        password: "",
        reason: "",
      });
    } catch (error) {
      console.error("Account delete request error:", error);

      setShowConfirmPopup(false);

      toast.error(
        "Unable to connect to the server. Please try again.",
        {
          toastId: "account-delete-network-error",
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <NavbarForAccount />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
        draggable
        theme="colored"
        style={{
          zIndex: 999999,
        }}
      />

      <div className="flex items-center justify-center min-h-screen px-4 py-10 mt-10 bg-gray-100">
        <div className="w-full max-w-3xl p-6 bg-white border border-gray-200 shadow-lg rounded-2xl md:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Delete Account
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Submit your account details and explain why you want to delete
              your account. Once the account is deleted, this action cannot be
              undone.
            </p>
          </div>

          <div className="p-4 mb-6 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50">
            Please provide the correct details associated with your account.
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                User Email ID <span className="text-red-500">*</span>
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your registered email address"
                autoComplete="email"
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </div>

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Name <span className="text-red-500">*</span>
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </div>

            {/* Contact number */}
            <div>
              <label
                htmlFor="contactNumber"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Contact Number <span className="text-red-500">*</span>
              </label>

              <input
                id="contactNumber"
                name="contactNumber"
                type="tel"
                inputMode="tel"
                value={formData.contactNumber}
                onChange={handleContactChange}
                placeholder="Enter your contact number"
                autoComplete="tel"
                maxLength={20}
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Account Password <span className="text-red-500">*</span>
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your account password"
                autoComplete="current-password"
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </div>

            {/* Reason */}
            <div>
              <label
                htmlFor="reason"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Reason for Deleting Account{" "}
                <span className="text-red-500">*</span>
              </label>

              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Please explain why you want to delete your account"
                rows={5}
                maxLength={500}
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg outline-none resize-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />

              <div className="flex items-start justify-between gap-3 mt-1">
                <p className="text-xs text-gray-500">
                  Please provide a clear reason for deleting your account.
                </p>

                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {formData.reason.length}/500
                </span>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <p className="p-3 text-sm text-red-600 border border-red-200 rounded-lg bg-red-50">
                {error}
              </p>
            )}

            {/* Buttons */}
            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-5 py-3 text-sm font-semibold text-gray-700 transition border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-3 text-sm font-semibold text-white transition bg-red-600 rounded-lg hover:bg-red-700"
              >
                Submit Delete Request
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation popup */}
      {showConfirmPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-confirmation-title"
        >
          <div className="w-full max-w-md p-6 bg-white shadow-xl rounded-2xl">
            <div className="flex items-center justify-center mx-auto text-2xl font-bold text-red-600 bg-red-100 rounded-full w-14 h-14">
              !
            </div>

            <h3
              id="delete-confirmation-title"
              className="mt-4 text-xl font-bold text-center text-gray-900"
            >
              Confirm Account Deletion
            </h3>

            <p className="mt-3 text-sm leading-6 text-center text-gray-500">
              Are you sure you want to submit an account deletion request for{" "}
              <span className="font-semibold text-gray-800">
                {formData.email}
              </span>
              ?
            </p>

            <p className="mt-2 text-sm leading-6 text-center text-gray-500">
              This action may permanently remove your account and related data.
            </p>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setShowConfirmPopup(false)}
                className="flex-1 px-4 py-3 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
              >
                {isSubmitting ? "Submitting..." : "Yes, Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success popup */}
      {showSuccessPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-popup-title"
        >
          <div className="w-full max-w-sm p-6 text-center bg-white shadow-xl rounded-2xl">
            <div className="flex items-center justify-center mx-auto text-2xl text-green-600 bg-green-100 rounded-full w-14 h-14">
              ✓
            </div>

            <h3
              id="success-popup-title"
              className="mt-4 text-xl font-bold text-gray-900"
            >
              Request Submitted
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Your account deletion request has been submitted successfully.
            </p>

            <button
              type="button"
              onClick={() => setShowSuccessPopup(false)}
              className="w-full px-4 py-3 mt-6 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-black"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AccountDelete;
