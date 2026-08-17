import React, { useRef, useState } from "react";
import img from "../../assets/img/kyc/cloud-upload.png";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import { BACKEND_API_URL } from "../../api/config";
import AdminLayout from "../Admin/AdminLayout";

const AddKYC = () => {
  const [num, setNum] = useState("");
  const [loading, setLoading] = useState(false);
  const [frontFile, setFrontFile] = useState();
  const [backFile, setBackFile] = useState();
  const [bankFile, setBankFile] = useState();

  const frontInput = useRef(null);
  const backInput = useRef(null);
  const bankInput = useRef(null);

  const handleSubmit = async () => {
    if (!num || Number(num) <= 0) return toast.error("Please enter a user ID");
    if (!frontFile || !backFile || !bankFile)
      return toast.error("Please upload all files");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("user_id", num);
      formData.append("photo_id_1", frontFile);
      formData.append("photo_id_2", backFile);
      formData.append("photo_id_3", bankFile);

      const res = await axios.post(`${BACKEND_API_URL}/kyc/upload`, formData);

      toast.success(res.data?.message || "KYC Uploaded");
    } catch (err) {
      const msg = err?.response?.data?.message || "Upload failed";
      toast.error(msg);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  };

  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    if (file) setter(file);
  };

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={2000} transition={Slide} />
      
      <div className="flex-1 p-2 sm:p-4 md:p-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-10 text-white mt-10">
          Add KYC
        </h1>

        {/* Card Wrapper */}
        <div className="max-w-3xl mx-auto space-y-4 sm:space-y-8 w-full px-2">
          {/* USER ID CARD */}
          <div className="bg-gray-900/60 border border-gray-700 rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-sm sm:text-base">Enter User ID</h3>

            <input
              type="number"
              placeholder="Enter User ID"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-blue-500 text-sm"
              value={num}
              onChange={(e) => setNum(e.target.value)}
            />
          </div>

          {/* UPLOAD CARD */}
          <div className="bg-gray-900/60 border border-gray-700 rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg space-y-4 sm:space-y-6">
            <UploadRow
              title="Front Proof"
              file={frontFile}
              inputRef={frontInput}
              onChange={(e) => handleFileChange(e, setFrontFile)}
              img={img}
            />
            <UploadRow
              title="Back Proof"
              file={backFile}
              inputRef={backInput}
              onChange={(e) => handleFileChange(e, setBackFile)}
              img={img}
            />
            <UploadRow
              title="Bank Proof"
              file={bankFile}
              inputRef={bankInput}
              onChange={(e) => handleFileChange(e, setBankFile)}
              img={img}
            />
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              onClick={handleSubmit}
              className="bg-[#0159FF] text-white px-4 py-2 rounded-xl cursor-pointer w-full md:w-68 flex items-center justify-center gap-2 text-sm"
              disabled={loading}
            >
              {loading && (
                <FaSpinner className="animate-spin text-white text-lg" />
              )}{" "}
              <span>{loading ? "Uploading" : "Submit KYC"}</span>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const UploadRow = ({ title, file, inputRef, onChange, img }) => (
  <div>
    <p className="font-medium mb-2 text-sm">{title}</p>

    <div
      className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-xl px-3 sm:px-5 py-3 cursor-pointer hover:border-blue-500 transition text-sm"
      onClick={() => inputRef.current.click()}
    >
      <input
        type="file"
        hidden
        ref={inputRef}
        accept="image/*"
        onChange={onChange}
      />

      <span className="opacity-80">{file?.name || "Click to upload file"}</span>

      <img src={img} alt="upload" className="w-9 bg-white rounded-lg p-1" />
    </div>
  </div>
);

export default AddKYC;
