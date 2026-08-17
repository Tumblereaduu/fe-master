import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import img from "../../assets/img/kyc/cloud-upload.png";
import deposit from "../../assets/img/ticket/deposit.png";
import withdraw from "../../assets/img/ticket/withdrawal.png";
import kyc from "../../assets/img/ticket/kyc.png";
import referral from "../../assets/img/ticket/referrals.png";
import trade from "../../assets/img/ticket/trades.png";
import others from "../../assets/img/ticket/others.png";
import btnlogo from "../../assets/img/kyc/btnlogo.png";
import tick from "../../assets/img/kyc/tickimg.png";
import { useAuth } from '../context/AuthContext';
import { Slide, toast, ToastContainer } from "react-toastify";
import { BACKEND_API_URL } from "../../api/config";
import DoinDashboardSidebar from "../DoinDashboardSidebar";
import NavbarForAccount from "../NavbarForAccount";
import { FaSpinner } from "react-icons/fa";
import { getDepositSource } from '../../utils/depositSource';

const Support = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const subject = state?.subject || "";
  // Get ticket source (website or mobile_app)
  const ticketSource = getDepositSource();

  const [frontFile, setFrontFile] = useState(null);
  const [description, setDescription] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(subject);
  const frontInput = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) setFrontFile(file);
  };

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate description

    if (!selectedTopic) {
      toast.error("Please select a ticket type");
      return;
    }

    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }
    setLoading(true);
    setShowAlert(false);
    // Create FormData
    const formData = new FormData();
    formData.append("user_id", user.user_id);
    formData.append("username", user.username);
    formData.append("email", user.email);
    formData.append("subject", selectedTopic);
    formData.append("message", description);
    formData.append("message_img", frontFile);
    // Append ticket source to track if from website or mobile app
    formData.append("ticket_source", ticketSource);

    try {
      const res = await fetch(`${BACKEND_API_URL}/support`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      console.log("Ticket submitted:", data);

      // Optionally clear form or navigate
      setDescription("");

      setFrontFile(null);

      toast.success(data.message || "Submitted successfully");

      setTimeout(() => {
        navigate("/help");
      }, 2000);
    } catch (error) {
      console.error("Error submitting ticket:", error);
      toast.error(error.response?.data?.message || "Something went wrong, Kindly contact support");
    }
    finally {
      setTimeout(()=>{
      setLoading(false);
      },3000)
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <NavbarForAccount />
      <div className="flex flex-col md:flex-row">
        <div className="md:w-64">
          <DoinDashboardSidebar />
        </div>

        <ToastContainer position='top-right' autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable
          pauseOnHover theme='light' transition={Slide} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-3 mt-10 px-4">
          <h3 className="text-center font-bold mt-10 text-xl md:text-3xl">
            Help Center
          </h3>

          <div>
            <div className="flex items-center lg:w-full  gap-3 mt-5 md:mt-20 lg:px-6 py-2 2xl:px-20">
              <img src={tick} alt="" className="w-5 h-5" />
              <p className="font-light text-sm md:text-xl xl:text-2xl">
                Kindly select the topic of your inquiry so we can assist you better.
              </p>
            </div>
          </div>


        <h3 className="font-bold text-xl mt-10 lg:text-2xl xl:ml-10 2xl:ml-20">Ticket Type <span className="text-red-500">*</span></h3>
        <div className="flex flex-col items-center  xl:flex-row  gap-10 -mt-5 xl:gap-40 xl:ml-10 2xl:ml-20">

            <div className="flex flex-col gap-5 mt-10 ">
              <label className=" p-5 rounded-md bg-[] md:p-3 py-5 h-13 w-full md:w-90 cursor-pointer border border-[#BFBFBF] flex items-center justify-between gap-5">
                <div className="flex items-center gap-5 ">
                  <img className="w-10 h-10" src={deposit} alt="Deposit" />
                  <h3 className="font-medium text-xl">Deposit </h3>
                </div>
                <input type="radio" name="topic" value="Deposit" className="w-5 h-5" onChange={() => handleTopicClick('Deposit')} />
              </label>

            <label className="p-5 rounded-md bg-[] md:p-3 h-13 w-full md:w-90 cursor-pointer border border-[#BFBFBF] flex items-center justify-between gap-5">
                <div className="flex items-center gap-5 ">
                  <img className="w-10 h-10" src={withdraw} alt="Deposit" />
                  <h3 className="font-medium text-xl">Withdrawal</h3>
                </div>
                <input type="radio" name="topic" value="Withdrawal" className="w-5 h-5" onChange={() => handleTopicClick('Withdrawal')} />
              </label>

            <label className="p-5 rounded-md bg-[] md:p-3 h-13 w-full md:w-90 cursor-pointer border border-[#BFBFBF] flex items-center justify-between gap-5">
                <div className="flex items-center gap-5">
                  <img className="w-10 h-10" src={kyc} alt="Deposit" />
                  <h3 className="font-medium text-xl">KYC</h3>
                </div>
                <input type="radio" name="topic" value="KYC" className="w-5 h-5" onChange={() => handleTopicClick('KYC')} />
              </label>

            <label className="p-5 rounded-md bg-[] md:p-3 h-13 w-full md:w-90 cursor-pointer border border-[#BFBFBF] flex items-center justify-between gap-5">
                <div className="flex items-center gap-5">
                  <img className="w-10 h-10" src={referral} alt="Deposit" />
                  <h3 className="font-medium text-xl">Refferal</h3>
                </div>
                <input type="radio" name="topic" value="Refferal" className="w-5 h-5" onChange={() => handleTopicClick('Refferal')} />
              </label>

            <label className="p-5 rounded-md bg-[] md:p-3 h-13 w-full md:w-90 cursor-pointer border border-[#BFBFBF] flex items-center justify-between gap-5">
                <div className="flex items-center gap-5">
                  <img className="w-10 h-10" src={trade} alt="Deposit" />
                  <h3 className="font-medium text-xl">Trade</h3>
                </div>
                <input type="radio" name="topic" value="Trades" className="w-5 h-5" onChange={() => handleTopicClick('Trades')} />
              </label>

            <label className="p-5 rounded-md bg-[] md:p-3 h-13 w-full md:w-90 cursor-pointer border border-[#BFBFBF] flex items-center justify-between gap-5">
                <div className="flex items-center gap-5">
                  <img className="w-10 h-10" src={others} alt="Deposit" />
                  <h3 className="font-medium text-xl">Others</h3>
                </div>
                <input type="radio" name="topic" value="Others" className="w-5 h-5" onChange={() => handleTopicClick('Others')} />
              </label>
            </div>

            {/* Description */}
            <div className="mt-7 lg:mt-0">
              <h3 className="font-bold text-xl md:text-2xl lg:-ml-28 xl:ml-0">Description <span className="text-red-500">*</span></h3>
                <div className="w-full md:w-[500px]">
                  <textarea
                    className="w-full h-40 md:h-48 border p-2 rounded-md mt-2"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={5000}
                    placeholder="Kindly provide more information on your request."
                  />
                  <p className="text-right text-sm md:text-base">{description.length}/5000</p>
                </div>

              {/* File Upload */}
              <div className="w-full flex flex-col gap-2 md:w-[500px] mt-2 ">
                <h3 className="font-bold text-xl mt-10 md:text-2xl lg:-ml-28 xl:ml-0">Submit Your Documents </h3>
                <div
                  className="border border-dashed border-[#4C8AFF] p-5 text-center w-full cursor-pointer"
                  onClick={() => frontInput.current.click()}
                >
                   <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="w-20 h-20 bg-[#E8E8E8] rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img
                        className="max-w-[70%] max-h-[70%] object-contain"
                        src={img}
                        alt="Front Side"
                      />
                    </div>
                    <div>
                      <p className="text-sm md:text-lg font-bold">Upload related documents</p>
                      <p> <span className="text-[#0033FF]"> Choose </span>  or drag and drop (maximum size 5 MB)</p>
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={frontInput}
                    style={{ display: "none" }}
                    onChange={handleImage}
                    accept=".pdf,.jpg,.png,.jpeg"
                  />
                  {frontFile && (
                    <p className="text-green-600 mt-2 text-sm md:text-base">
                      Selected: {frontFile.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className=" md:w-[500px] mt-6 flex flex-col md:justify-center items-center gap-3">
                <button
                  className="bg-[#F7931A] w-full md:w-60 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin text-white text-xl" />
                      Processing...
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>

                {/* Centered below text + image */}
                <div className="flex gap-2 items-center mt-3 md:mt-0 justify-center md:justify-start">
                  <img className="w-4 h-4" src={btnlogo} alt="" />
                  <p className="text-xs text-center md:text-left">
                    All data is encrypted for security purpose
                  </p>
                </div>
              </div>
            </div>
          </div>



          {/* Alert */}
          {showAlert && (
            <div className="text-red-600 mt-3">⚠️ Description is required!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Support;
