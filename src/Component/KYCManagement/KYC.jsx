import React, { useEffect, useState, useRef } from "react";
import tick from "../../assets/img/kyc/tickimg.png";
import btnlogo from "../../assets/img/kyc/btnlogo.png";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import img from "../../assets/img/kyc/cloud-upload.png";
import approve from "../../assets/img/kyc/complete.png";
import pending from "../../assets/img/kyc/pending.png";
import correct from "../../assets/img/kyc/verified.png";
import bankcomplete from "../../assets/img/kyc/bankcomplete.png";
import Sidebar from "../UnusedFiles/Sidebar";
import Navebar from "../UnusedFiles/Navbar";
import Popup from "./Popup";
import { useAuth } from "../context/AuthContext";
import axios from "../../services/api";
import "react-toastify/dist/ReactToastify.css";
import { Slide, ToastContainer, toast } from "react-toastify";
import { BACKEND_API_URL } from "../../api/config";
import { FaChevronDown } from "react-icons/fa";
import DoinDashboardSidebar from "../DoinDashboardSidebar";
import NavbarForAccount from "../NavbarForAccount";
import { useTheme } from "../../context/ThemeContext";

/* ─── Dark overrides for browser-native selects ─── */
const darkModeCSS = `
  .kyc-dark select option { background: #141D22; color: #E8EDF0; }
`;

const KYC = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { isDark } = useTheme();

  const dk = {
    pageBg: "bg-[#141D22]",
    heading: "text-white",
    label: "text-[#E8EDF0]",
    input: "bg-[#121A20] border-[#2A3640] text-[#E8EDF0]",
    uploadBox: "bg-[#121A20] border-[#2A3640]",
    imgContainer: "bg-[#1A242B]",
    chevron: "text-[#6B7B88]",
    muted: "text-[#6B7B88]",
    redText: "text-red-400",
  };

  const userId =
    user?.id ||
    user?.user_id ||
    JSON.parse(localStorage.getItem("user"))?.id ||
    JSON.parse(localStorage.getItem("user"))?.user_id;

  const [studentdetails, setStudentdetails] = useState("");
  const [department, setDepartment] = useState("");
  const [experience, setExperience] = useState("");
  const [income, setIncome] = useState("");
  const [wealth, setWealth] = useState("");
  const [loading, setLoading] = useState(false);
  const [isInitialSubmission, setIsInitialSubmission] = useState(true);
  const [photoVerificationStatus, setPhotoVerificationStatus] = useState(null);

  const [frontFile, setFrontFile] = useState();
  const [backFile, setBackFile] = useState();
  const [BankFile, setBankFile] = useState();

  const [docType1, setDocType1] = useState("");
  const [docType2, setDocType2] = useState("");

  const [frontStatus, setFrontStatus] = useState(null);
  const [backStatus, setBackStatus] = useState(null);
  const [bankStatus, setBankStatus] = useState(null);

  const [showPopup, setShowPopup] = useState(false);

  const frontInput = useRef(null);
  const backInput = useRef(null);
  const bankInput = useRef(null);

  const saveDropdownsToStorage = (type1, type2) => {
    localStorage.setItem("kyc_docType1", type1);
    localStorage.setItem("kyc_docType2", type2);
  };

  const saveFilesMetaToStorage = () => {
    localStorage.setItem("kyc_frontFileName", frontFile?.name || "");
    localStorage.setItem("kyc_backFileName", backFile?.name || "");
    localStorage.setItem("kyc_bankFileName", BankFile?.name || "");
  };

  const canUpload = (status) => {
    const s = status?.toLowerCase();
    return !s || s === "rejected";
  };

  const getDocLabel = (value) => {
    const labels = {
      drivers_license: "Driver's License",
      passport: "Passport",
      id_card: "National ID Card",
      voter_id: "Voter ID",
      resident_permit: "Resident Permit",
      bank_statement: "Bank Statement",
      bank_front: "Bank Passbook Front Page",
      any_identity_document: "Any Identity Document",
    };
    return labels[value] || "Select Document";
  };

  const identityDocsPendingOrApproved =
    (frontStatus?.toLowerCase() === "pending" || frontStatus?.toLowerCase() === "approved") ||
    (backStatus?.toLowerCase() === "pending" || backStatus?.toLowerCase() === "approved");

  const bankDocPendingOrApproved = bankStatus?.toLowerCase() === "pending" || bankStatus?.toLowerCase() === "approved";

  const allRejected =
    frontStatus?.toLowerCase() === "rejected" &&
    backStatus?.toLowerCase() === "rejected" &&
    bankStatus?.toLowerCase() === "rejected";

  const isDropdown1Disabled = () => {
    return identityDocsPendingOrApproved;
  };

  const isDropdown2Disabled = () => {
    return bankDocPendingOrApproved;
  };

  useEffect(() => {
    const checkPopupStatus = async () => {
      try {
        const popupDone = localStorage.getItem("kyc_popup_done");
        if (popupDone === "true") {
          setIsInitialSubmission(false);
          return;
        }

        const res = await fetch(`${BACKEND_API_URL}/kyc/status/${userId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();

        if (!res.ok) throw new Error("Invalid response");

        if (!data.length) {
          return;
        }

        const kyc = data[0];

        const hasPopupData = [
          kyc.employment_status,
          kyc.occupation,
          kyc.trading_experience,
          kyc.income_range,
          kyc.source_of_income,
        ].every((v) => v && v !== "");

        if (hasPopupData) {
          setIsInitialSubmission(false);
          localStorage.setItem("kyc_popup_done", "true");
        } else {
          setIsInitialSubmission(false);
        }
      } catch (err) {
        console.error("Error checking KYC popup status:", err);
        setIsInitialSubmission(false);
      }
    };

    if (userId && token) checkPopupStatus();
  }, [userId, token]);

  const fs = frontStatus?.toLowerCase();
  const bs = backStatus?.toLowerCase();
  const ks = bankStatus?.toLowerCase();

  const mustUploadFront = !fs || fs === "rejected";
  const mustUploadBack = !bs || bs === "rejected";
  const mustUploadBank = !ks || ks === "rejected";

  const handleNextClick = () => {
    const missingFiles = [
      (!frontFile && (isInitialSubmission || frontStatus === "rejected")),
      (!backFile && (isInitialSubmission || backStatus === "rejected")),
      (!BankFile && (isInitialSubmission || bankStatus === "rejected")),
    ];

    if (missingFiles.some(Boolean)) {
      toast.warning(
        isInitialSubmission
          ? "Please upload all three images before continuing."
          : "Please upload all rejected images before proceeding."
      );
      return;
    }

    handleFinalSubmit({});
  };

  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      saveFilesMetaToStorage();
    }
  };

  const handleFinalSubmit = async (popupValues = {}) => {
    const missingRequiredUploads = [
      (!frontFile && (isInitialSubmission || frontStatus === "rejected")),
      (!backFile && (isInitialSubmission || backStatus === "rejected")),
      (!BankFile && (isInitialSubmission || bankStatus === "rejected")),
    ];

    if (missingRequiredUploads.some(Boolean)) {
      toast.warning(
        isInitialSubmission
          ? "Please upload all three images before submitting."
          : "Please upload all rejected images before submitting."
      );
      return;
    }

    const formData = new FormData();

    if (frontFile) formData.append("photo_id_1", frontFile);
    if (backFile) formData.append("photo_id_2", backFile);
    if (BankFile) formData.append("photo_id_3", BankFile);
    formData.append("user_id", userId);
    if (docType1) {
      formData.append("photo_id_1_document_type", docType1);
      formData.append("photo_id_2_document_type", docType1);
    }
    if (docType2) {
      formData.append("photo_id_3_document_type", docType2);
    }

    console.log(" Checking required fields:");
    console.log({
      user_id: userId,
      employment_status: studentdetails,
      occupation: department,
      trading_experience: experience,
      income_range: income,
      source_of_income: wealth,
      photo_id_1_document_type: docType1,
      photo_id_2_document_type: docType1,
      photo_id_3_document_type: docType2,
    });

    if (isInitialSubmission) {
      const missingFields = [];
      if (!studentdetails) missingFields.push("employment_status");
      if (!department) missingFields.push("occupation");
      if (!experience) missingFields.push("trading_experience");
      if (!income) missingFields.push("income_range");
      if (!wealth) missingFields.push("source_of_income");

      if (missingFields.length > 0) {
        toast.warning(`Missing required fields: ${missingFields.join(", ")}`);
        return;
      }
    }

    try {
      setLoading(true);
      const res = await axios.post(`${BACKEND_API_URL}/kyc/submit`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data;
      setLoading(false);

      if (data.status === "success") {
        toast.success("KYC Uploaded successfully!", { autoClose: 3000, onClose: () => navigate("/kyc") });
        setShowPopup(false);

        localStorage.removeItem("kyc_frontFileName");
        localStorage.removeItem("kyc_backFileName");
        localStorage.removeItem("kyc_bankFileName");
      } else if (data.status === "error") {
        toast.warning(data.message);
      } else {
        toast.error("Failed to submit: " + data.message);
      }
    } catch (err) {
      console.error(err.response);
      setLoading(false);
      toast.warning(err.response?.data?.message || "Upload failed");
    }
  };

  useEffect(() => {
    const fetchKYCStatus = async () => {
      try {
        const res = await fetch(`${BACKEND_API_URL}/kyc/status/${userId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();

        if (res.ok && data && data.length > 0) {
          const kyc = data[0];
          setFrontStatus(kyc.photo_id_1_status || null);
          setBackStatus(kyc.photo_id_2_status || null);
          setBankStatus(kyc.photo_id_3_status || null);
          setPhotoVerificationStatus(kyc.photo_verification_status || null);

          if (kyc.employment_status) setStudentdetails(kyc.employment_status);
          if (kyc.occupation) setDepartment(kyc.occupation);
          if (kyc.trading_experience) setExperience(kyc.trading_experience);
          if (kyc.income_range) setIncome(kyc.income_range);
          if (kyc.source_of_income) setWealth(kyc.source_of_income);

          if (
            kyc.employment_status ||
            kyc.occupation ||
            kyc.trading_experience ||
            kyc.income_range ||
            kyc.source_of_income
          ) {
            setIsInitialSubmission(false);
            localStorage.setItem("kyc_popup_done", "true");
          }
        }
      } catch (err) {
        console.error("Error fetching KYC:", err);
      }
    };

    if (userId && token) fetchKYCStatus();
  }, [userId, token]);

  useEffect(() => {
    const savedDocType1 = localStorage.getItem("kyc_docType1");
    const savedDocType2 = localStorage.getItem("kyc_docType2");

    if (savedDocType1) setDocType1(savedDocType1);
    if (savedDocType2) setDocType2(savedDocType2);
  }, []);

  useEffect(() => {
    if (!docType1) {
      const saved = localStorage.getItem("kyc_docType1");
      if (saved && (frontStatus || backStatus)) {
        setDocType1(saved);
      }
    }
    if (!docType2) {
      const saved = localStorage.getItem("kyc_docType2");
      if (saved && bankStatus) {
        setDocType2(saved);
      }
    }
  }, [frontStatus, backStatus, bankStatus, docType1, docType2]);

  const handlePopupSubmit = async (popupValues) => {
    try {
      const res = await axios.post(
        `${BACKEND_API_URL}/kyc/save-popup`,
        {
          user_id: userId,
          employment_status: popupValues.studentdetails,
          occupation: popupValues.department,
          trading_experience: popupValues.experience,
          income_range: popupValues.income,
          source_of_income: popupValues.wealth,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.status === "success") {
        toast.success("Popup details saved successfully!");
      } else {
        toast.warning("Popup data saved but server did not return success");
      }

      setShowPopup(false);
      setIsInitialSubmission(false);
      localStorage.setItem("kyc_popup_done", "true");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save popup data");
    }
  };

  useEffect(() => {
    if (!showPopup) {
      const section = document.getElementById("kyc-upload-section");
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }
  }, [showPopup]);

  /* ─── Status badge helper ─── */
  const statusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === "approved")
      return "text-[#FFD900] text-sm font-medium px-2 py-1 bg-[#00165E] rounded flex items-center gap-1";
    if (s === "pending")
      return "text-[#000000] text-sm font-bold px-2 rounded-xl py-0.5 bg-[#FFD900]";
    if (s === "rejected")
      return "bg-[#96000E] text-sm font-medium px-2 py-1 text-white rounded";
    return "text-gray-500 text-sm";
  };

  /* ─── Select className helper ─── */
  const selectClass = (disabled) => {
    const base = "w-full p-3 pr-10 rounded-md appearance-none cursor-pointer transition-colors duration-200";
    const theme = isDark ? dk.input : "bg-[#FBFBFB] border-[#868686]";
    const dim = disabled ? "opacity-50 cursor-not-allowed" : "";
    return `${base} ${theme} ${dim}`;
  };

  /* ─── Upload box className helper ─── */
  const uploadBoxClass = (status) => {
    const base = "relative flex items-center gap-4 border border-dotted p-4 rounded-md lg:w-[400px] xl:w-[500px] transition-colors duration-200";
    const theme = isDark ? dk.uploadBox : "border-[#3D3D3D]";
    const cursor = canUpload(status) ? "cursor-pointer" : "cursor-default opacity-90";
    return `${base} ${theme} ${cursor}`;
  };

  return (
    <div className={`py-4 transition-colors duration-300 ${isDark ? `${dk.pageBg} min-h-screen kyc-dark` : ""}`}>
      {isDark && <style>{darkModeCSS}</style>}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} pauseOnFocusLoss draggable transition={Slide} style={{ zIndex: 99999, position: "fixed" }} />
      <NavbarForAccount />

      <div className="">
        <div className="md:w-64">
          <DoinDashboardSidebar />
        </div>

        <div className="mx-4 flex-1 flex flex-col gap-8 md:mx-10 md:ml-72 lg:ml-80 2xl:ml-60">
          <h2 className={`font-bold text-2xl text-center md:text-2xl mt-20 transition-colors duration-300 ${isDark ? dk.heading : ""}`}>
            Upload Your Documents
          </h2>
        </div>

        <div className="sm:ml-0 md:ml-64 lg:ml-68 xl:ml-80 2xl:ml-90">
          <div className="">
            <div className="grid grid-cols mt-3 md:grid-cols-1 gap-4">

              {/* IDENTITY DOCUMENT SECTION */}
              <div className="mx-10 flex gap-2 items-center mt-8 md:mx-0">
                <img className="w-6 h-6 md:block" src={tick} alt="" />
                <p className={`font-medium text-xl md:text-2xl transition-colors duration-300 ${isDark ? dk.label : ""}`}>
                  Provide identity document
                </p>
              </div>

              <div className="mt-5 mx-10 lg:mx-0">
                <h2 className={`text-xl font-bold transition-colors duration-300 ${isDark ? dk.label : ""}`}>
                  Document Type<span className="text-red-500">*</span>
                </h2>

                <div className="mt-2 flex flex-col lg:flex-row gap-8 md:mt-10">
                  {/* LEFT: Dropdown */}
                  <div className="flex-1">
                    <div className="relative lg:w-76 xl:w-96">
                      <select
                        className={selectClass(isDropdown1Disabled())}
                        value={docType1}
                        onChange={(e) => {
                          setDocType1(e.target.value);
                          saveDropdownsToStorage(e.target.value, docType2);
                        }}
                        disabled={isDropdown1Disabled()}
                      >
                        <option value="">Select document</option>
                        <option value="aadhaar card">Aadhaar Card</option>
                        <option value="driving license">Driver's License</option>
                        <option value="pan card">PAN Card</option>
                        <option value="voter id">Voter Card</option>
                        <option value="passport">Passport</option>
                        <option value="any identity document">Any Identity Document</option>
                      </select>
                      <FaChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${isDark ? dk.chevron : "text-gray-600"}`} />
                    </div>
                  </div>

                  {/* RIGHT: Upload boxes */}
                  {(docType1 || frontStatus || backStatus) && (
                    <div className="flex-1 flex flex-col gap-4 md:mt-10 lg:-mt-20">
                      <h2 className={`mt-5 text-xl font-bold md:mt-0 transition-colors duration-300 ${isDark ? dk.label : ""}`}>
                        Submit Your Documents<span className="text-red-500">*</span>
                      </h2>

                      {/* FRONT SIDE UPLOAD */}
                      <div
                        className={uploadBoxClass(frontStatus)}
                        onClick={() => canUpload(frontStatus) && frontInput.current.click()}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          ref={frontInput}
                          className="hidden"
                          onChange={(e) => handleFileChange(e, setFrontFile)}
                          disabled={!canUpload(frontStatus)}
                        />
                        <div className={`w-20 h-20 rounded-md flex items-center justify-center overflow-hidden flex-shrink-0 transition-colors duration-200 ${isDark ? dk.imgContainer : "bg-[#E8E8E8]"}`}>
                          <img
                            className="max-w-[70%] max-h-[70%] object-contain"
                            src={frontStatus?.toLowerCase() === "pending" ? pending : frontStatus?.toLowerCase() === "approved" ? approve : img}
                            alt="Front Side"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold text-lg transition-colors duration-200 ${isDark ? dk.label : ""}`}>
                            {frontFile ? `${frontFile.name.slice(0, 10)}...` : "Front Side"}
                          </h3>
                        </div>
                        {frontStatus && (
                          <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                            <span className={statusBadge(frontStatus)}>
                              {frontStatus.toLowerCase() === "approved"
                                ? "Verified"
                                : frontStatus.toLowerCase() === "pending"
                                  ? "Pending"
                                  : frontStatus}
                              {frontStatus.toLowerCase() === "approved" && (
                                <img src={correct} alt="verified" className="w-4 h-4" />
                              )}
                            </span>
                            {frontStatus.toLowerCase() === "rejected" && (
                              <span className={`text-xs px-2 transition-colors duration-200 ${isDark ? dk.redText : "text-red-500"}`}>(You can re-upload)</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* BACK SIDE UPLOAD */}
                      <div
                        className={uploadBoxClass(backStatus)}
                        onClick={() => canUpload(backStatus) && backInput.current.click()}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          ref={backInput}
                          className="hidden"
                          onChange={(e) => handleFileChange(e, setBackFile)}
                          disabled={!canUpload(backStatus)}
                        />
                        <div className={`w-20 h-20 rounded-md flex items-center justify-center overflow-hidden flex-shrink-0 transition-colors duration-200 ${isDark ? dk.imgContainer : "bg-[#E8E8E8]"}`}>
                          <img
                            className="max-w-[70%] max-h-[70%] object-contain"
                            src={backStatus?.toLowerCase() === "pending" ? pending : backStatus?.toLowerCase() === "approved" ? approve : img}
                            alt="Back Side"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold text-lg transition-colors duration-200 ${isDark ? dk.label : ""}`}>
                            {backFile ? `${backFile.name.slice(0, 10)}...` : "Back Side"}
                          </h3>
                        </div>
                        {backStatus && (
                          <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                            <span className={statusBadge(backStatus)}>
                              {backStatus.toLowerCase() === "approved"
                                ? "Verified"
                                : backStatus.toLowerCase() === "pending"
                                  ? "Pending"
                                  : backStatus}
                              {backStatus.toLowerCase() === "approved" && (
                                <img src={correct} alt="verified" className="w-4 h-4" />
                              )}
                            </span>
                            {backStatus.toLowerCase() === "rejected" && (
                              <span className={`text-xs px-2 transition-colors duration-200 ${isDark ? dk.redText : "text-red-500"}`}>(You can re-upload)</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* BANK DOCUMENT SECTION */}
            <div className="mx-10 flex gap-2 items-center mt-12 md:mx-0">
              <img className="w-6 h-6 md:block" src={tick} alt="" />
              <p className={`font-medium text-xl md:text-2xl transition-colors duration-300 ${isDark ? dk.label : ""}`}>
                Provide bank document
              </p>
            </div>

            <div className="mt-5 mx-10 lg:mx-0">
              <h2 className={`text-xl font-bold transition-colors duration-300 ${isDark ? dk.label : ""}`}>
                Document Type<span className="text-red-500">*</span>
              </h2>

              <div className="md:flex flex-col lg:flex-row gap-8 mt-10">
                {/* LEFT: Dropdown */}
                <div className="flex-1">
                  <div className="relative lg:w-76 xl:w-96">
                    <select
                      className={selectClass(isDropdown2Disabled())}
                      value={docType2}
                      onChange={(e) => {
                        setDocType2(e.target.value);
                        saveDropdownsToStorage(docType1, e.target.value);
                      }}
                      disabled={isDropdown2Disabled()}
                    >
                      <option value="">Select Document</option>
                      <option value="bank statement">Bank Statement</option>
                      <option value="bank front">Bank Passbook Front Page</option>
                    </select>
                    <FaChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${isDark ? dk.chevron : "text-gray-600"}`} />
                  </div>
                </div>

                {/* RIGHT: Upload box */}
                {(docType2 || bankStatus) && (
                  <div className="mt-10 flex-1 flex flex-col mb-20 md:mt-20 lg:-mt-20">
                    <h2 className={`text-xl font-bold transition-colors duration-300 ${isDark ? dk.label : ""}`}>
                      Submit Your Documents<span className="text-red-500">*</span>
                    </h2>

                    <div
                      className={`${uploadBoxClass(bankStatus)} mt-4`}
                      onClick={() => canUpload(bankStatus) && bankInput.current.click()}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        ref={bankInput}
                        className="hidden"
                        onChange={(e) => handleFileChange(e, setBankFile)}
                        disabled={!canUpload(bankStatus)}
                      />
                      <div className={`w-20 h-20 rounded-md flex items-center justify-center overflow-hidden flex-shrink-0 transition-colors duration-200 ${isDark ? dk.imgContainer : "bg-[#E8E8E8]"}`}>
                        <img
                          className="max-w-[70%] max-h-[70%] object-contain"
                          src={
                            bankStatus?.toLowerCase() === "pending"
                              ? pending
                              : bankStatus?.toLowerCase() === "approved"
                                ? bankcomplete || approve
                                : img
                          }
                          alt="Bank Proof"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold text-sm transition-colors duration-200 ${isDark ? dk.label : ""}`}>
                          {BankFile ? `${BankFile.name.slice(0, 10)}...` : "Bank Proof"}
                        </h3>
                      </div>
                      {bankStatus && (
                        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                          <span className={statusBadge(bankStatus)}>
                            {bankStatus.toLowerCase() === "approved"
                              ? "Verified"
                              : bankStatus.toLowerCase() === "pending"
                                ? "Pending"
                                : bankStatus}
                            {bankStatus.toLowerCase() === "approved" && (
                              <img src={correct} alt="verified" className="w-4 h-4" />
                            )}
                          </span>
                          {bankStatus.toLowerCase() === "rejected" && (
                            <span className={`text-xs px-2 transition-colors duration-200 ${isDark ? dk.redText : "text-red-500"}`}>(You can re-upload)</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ---------- NEXT BUTTON ---------- */}
          <div className="flex flex-col gap-3 items-center mx-10 md:items-center xl:ml-190 mb-2">

            {frontStatus === "approved" && backStatus === "approved" && bankStatus === "approved" ? (
              <button className="bg-[#70DA40] font-medium px-4 py-2 rounded-xl w-full md:w-68" disabled>
                Verified
              </button>
            ) : frontStatus === "pending" && backStatus === "pending" && bankStatus === "pending" ? (
              <button className="bg-[#E4A700] text-xl font-medium px-4 py-2 rounded-xl w-full md:w-68" disabled>
                Pending
              </button>
            ) : (
              ((isInitialSubmission && frontFile && backFile && BankFile) ||
                (!isInitialSubmission &&
                  (!mustUploadFront || frontFile) &&
                  (!mustUploadBack || backFile) &&
                  (!mustUploadBank || BankFile))) && (
                <button
                  className="bg-[#0159FF] text-white px-4 py-2 rounded-xl cursor-pointer w-full md:w-68 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={handleNextClick}
                  disabled={loading}
                >
                  {loading && <FaSpinner className="animate-spin text-white text-lg" />} <span> {loading ? "Uploading..." : "Next"} </span>
                </button>
              )
            )}

            {(
              (isInitialSubmission && frontFile && backFile && BankFile) ||
              (!isInitialSubmission &&
                (!mustUploadFront || frontFile) &&
                (!mustUploadBack || backFile) &&
                (!mustUploadBank || BankFile))
            ) && (
              <div className="flex gap-1 items-center mx-3">
                <img className="w-4 h-4" src={btnlogo} alt="" />
                <p className={`text-xs text-center transition-colors duration-200 ${isDark ? dk.muted : ""}`}>
                  All data is encrypted for security purpose
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYC;
