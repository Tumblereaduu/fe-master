// import React, { useRef, useState, useEffect, } from 'react'
// import { useNavigate } from 'react-router-dom'
// import DashboardNavebar from '../DepositNavbar/DashboardNavebar'
// import axios from "axios";
// import { useAuth } from '../context/AuthContext';
// import { Slide, ToastContainer, toast } from 'react-toastify';
// import { FaSpinner } from "react-icons/fa";
// import { BACKEND_API_URL } from '../../api/config';
// import upi from '../../assets/img/deposit/upi.png'
// import WitdrawaBalacne from '../History/WitdrawaBalacne';
// import { useTheme } from '../../context/ThemeContext';

// const Savebank = () => {
//     const navigate = useNavigate()
//     const [balance, setBalance] = useState(0);
//     const [amount, setAmount] = useState("")
//     const [accountHolder, setAccountHolder] = useState("");
//     const [accountNumber, setAccountNumber] = useState("");
//     const [ifscCode, setIfscCode] = useState("");
//     const [bankName, setBankName] = useState("");
//     const [branchName, setBranchName] = useState("");
//     const [country, setCountry] = useState("");
//     const [loading, setLoading] = useState(false);
//     const { user, token } = useAuth();
//     const [adminRate, setAdminRate] = useState({ minimum_withdrawal: 10 });
//     const { isDark } = useTheme();

//     const handleSaveBank = () => {
//         if (!accountHolder || !accountNumber || !ifscCode || !bankName || !branchName || !country) {
//             toast.warning("Please fill out all required fields before saving the bank.");
//             return; // stop execution
//         }

//         const bankDetails = { accountHolder, accountNumber, ifscCode, bankName, branchName, country };
//         localStorage.setItem("savedBank", JSON.stringify(bankDetails));
//         toast.success("Bank details saved successfully!");

//         setTimeout(() => {
//             navigate("/withdraw/addbank");
//         }, 2000); // optional delay to show toast
//     };


//     const handleWithdraw = async () => {
//         if (!accountHolder || !accountNumber || !ifscCode || !bankName || !branchName || !country) {
//             toast.warning("Please fill out all required fields before Withdrawal.")
//             return
//         }

//         if (parseFloat(amount) < 30) {
//             toast.error("The minimum deposit amount is 30 USD.")
//             return
//         }

//         const formData = new FormData();
//         formData.append("user_id", user.user_id);
//         formData.append("payment_method", "bank transfer");
//         formData.append("requested_amount_usd", amount);
//         formData.append("bank_account_holder_name", accountHolder);
//         formData.append("bank_account_number", accountNumber);
//         formData.append("bank_ifsc_code", ifscCode);
//         formData.append("bank_name", bankName);
//         formData.append("bank_branch_name", branchName);
//         formData.append("country", country);

//         try {
//             await axios.post(`${BACKEND_API_URL}`, formData, {
//                 headers: { "Content-Type": "multipart/form-data" }
//             })

//             // alert("withdrawal submitted successfully")

//             setTimeout(() => {
//                 navigate("/withdraw");
//             }, 2000)

//         } catch (error) {
//             alert(error.response?.data?.error || "Something went wrong");
//         }

//     }

//     useEffect(() => {
//         const fetchWallet = async () => {
//             if (!user?.user_id || !token) return;
//             try {
//                 const { data } = await axios.get(`${BACKEND_API_URL}/wallet/${user.user_id}`, {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });
//                 // console.log("Wallet API response:", data);
//                 if (data.status === "success") setBalance(data.wallet);
//                 else setBalance(0);
//             } catch (error) {
//                 console.error("Failed to fetch wallet:", error);
//                 setBalance(0);
//             }
//         };

//         fetchWallet();
//     }, [user, token]);

//     useEffect(() => {
//         const fetchAdmin = async () => {
//             try {
//                 const { data } = await axios.get(`${BACKEND_API_URL}/values/getdata`);
//                 if (data.success && data.data) {
//                     setAdminRate({
//                         minimum_withdrawal: parseFloat(data.data.minimum_withdrawal) || 10
//                     });
//                 }
//             } catch (error) {
//                 console.error("Failed to fetch admin rates:", error);
//             }
//         };

//         fetchAdmin();
//     }, []);

//   const trimStartOnly = (value) => value.replace(/^\s+/, "");

//     return (
//         <div>
//             <DashboardNavebar />

//             <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" transition={Slide} />
//         <div className='pt-[70px]' >
//             <WitdrawaBalacne />
//         </div>
//             <div className="mx-4 md:mx-24 flex flex-col md:flex-row gap-6 md:gap-12">
//                 {/* Left Section */}
//                  <div className='flex'>
//                 {/* <Allcomponent /> */}
//                 <div className="hidden md:block w-px h-[828px]  ml-12 mx-14 bg-[#C3C3C3]"></div>

// </div>
//                 {/* Divider (desktop only) */}

//                 {/* Right Section */}
//                 <div className="w-full mt-6  xl:w-[1200px] flex flex-col gap-2 md:mt-10  lg:-ml-24 xl:-ml-24">
//                     {/* Tabs */}
//                     <div className="flex flex-wrap gap-4 ml-16 md:gap-10 md:ml-0">
//                         <button
//                             className={`font-semibold text-xl md:text-2xl px-2 py-1 rounded-md transition-colors duration-300 ${isDark ? "bg-[#2A3640] text-white" : "bg-[#F5F5F5] text-gray-800"}`}
//                             onClick={() => navigate("/withdraw/addbank")}
//                         >
//                             Saved Bank
//                         </button>
//                         <button className={`font-semibold text-xl md:text-2xl px-2 py-1 rounded-md underline transition-colors duration-300 ${isDark ? "bg-[#2A3640] text-white" : "bg-[#F5F5F5] text-gray-800"}`}>
//                             Add Bank
//                         </button>
//                     </div>

//                     {/* Divider */}
//                     <div className={`hidden w md:block border md:-ml-2 transition-colors duration-300 ${isDark ? "border-[#2A3640]" : "border-[#C3C3C3]"}`}></div>

//                     <div className='mx-2 flex flex-col gap-5 2xl:ml-20'>
//                         {/* Title */}
//                         <div className="flex items-center gap-1 mt-6">
//                             <div className="relative w-12 h-12">
//                                 <img src={upi} alt="BNB" className="absolute -bottom-2 right-2 w-15 h-15" />
//                             </div>
//                             <h2 className={`font-extrabold text-2xl md:text-4xl transition-colors duration-300 ${isDark ? "text-white" : "text-gray-800"}`}>Bank Withdrawal </h2>
//                         </div>

//                         {/* Minimum Withdrawal */}
//                         <div className="w-full mt-4">
//                             <h3 className={`font-bold text-lg md:text-xl transition-colors duration-300 ${isDark ? "text-[#FF6B6B]" : "text-[#A40000]"}`}>
//                                 Minimum Withdrawal Amount: {Number(adminRate.minimum_withdrawal).toFixed(2)} USD
//                             </h3>

//                             {/* Form */}
//                             <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 mt-4">
//                                 {[
//                                     { label: "Account Holder Name", value: accountHolder, setter: setAccountHolder },
//                                     { label: "Account Number", value: accountNumber, setter: setAccountNumber },
//                                     { label: "Bank IFSC Code", value: ifscCode, setter: setIfscCode },
//                                     { label: "Bank Name", value: bankName, setter: setBankName },
//                                     { label: "Bank Branch Name", value: branchName, setter: setBranchName },
//                                     { label: "Country", value: country, setter: setCountry },
//                                 ].map((field, idx) => (
//                                     <div key={idx}>
//                                         <h3 className={`font-medium text-lg md:text-xl ${isDark ? "text-white" : "text-[#080808]"}`}>{field.label}</h3>
//                                         <div className={`flex gap-2 px-4 py-2 w-full border rounded-md items-center md:w-80 transition-colors duration-300 ${isDark ? "border-[#2A3640] bg-[#1A242B]" : "border-[#868686] bg-[#FBFBFB]"}`}>
//                                             <input
//                                                 type="text"
//                                                 className={`w-full outline-none text-sm md:text-base bg-transparent transition-colors duration-300 ${isDark ? "text-white" : "text-[#080808]"}`}
//                                                 value={field.value}
//                                                 onChange={(e) => field.setter(trimStartOnly(e.target.value))}
//                                             />
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>

//                             {/* Submit Button */}
//                              <div className="flex justify-center  2xl:ml-96">
//                                 <button
//                                     className=" mt-4 md:mt-6 w-90 rounded-lg bg-[#E27C00] px-4 py-2 font-medium text-white flex items-center justify-center gap-2 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
//                                     onClick={!loading ? handleSaveBank : undefined}
//                                     disabled={loading}
//                                 >
//                                     {loading && <FaSpinner className="animate-spin text-white text-xl md:text-2xl" />}
//                                     <span className="text-lg md:text-2xl">{loading ? "Processing..." : "Make as Save Bank"}</span>
//                                 </button>
//                             </div>
                           
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>

//     )
// }

// export default Savebank
















import React, { useRef, useState, useEffect, } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardNavebar from '../DepositNavbar/DashboardNavebar'
import axios from "axios";
import { useAuth } from '../context/AuthContext';
import { Slide, ToastContainer, toast } from 'react-toastify';
import { FaSpinner } from "react-icons/fa";
import { BACKEND_API_URL } from '../../api/config';
import upi from '../../assets/img/deposit/upi.png'
import WitdrawaBalacne from '../History/WitdrawaBalacne';
import { useTheme } from '../../context/ThemeContext';
import { getDepositSource } from '../../utils/depositSource';

const Savebank = () => {
    const navigate = useNavigate()
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState("")
    const [accountHolder, setAccountHolder] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [ifscCode, setIfscCode] = useState("");
    const [bankName, setBankName] = useState("");
    const [branchName, setBranchName] = useState("");
    const [country, setCountry] = useState("");
    const [loading, setLoading] = useState(false);
    const { user, token } = useAuth();
    const [adminRate, setAdminRate] = useState({ minimum_withdrawal: 10 });
    const { isDark } = useTheme();
    // Get withdrawal source (website or mobile_app)
    const withdrawalSource = getDepositSource();

    const handleSaveBank = () => {
        if (!accountHolder || !accountNumber || !ifscCode || !bankName || !branchName || !country) {
            toast.warning("Please fill out all required fields before saving the bank.");
            return; // stop execution
        }

        const bankDetails = { accountHolder, accountNumber, ifscCode, bankName, branchName, country };
        localStorage.setItem("savedBank", JSON.stringify(bankDetails));
        toast.success("Bank details saved successfully!");

        setTimeout(() => {
            navigate("/withdraw/addbank");
        }, 2000); // optional delay to show toast
    };


    const handleWithdraw = async () => {
        if (!accountHolder || !accountNumber || !ifscCode || !bankName || !branchName || !country) {
            toast.warning("Please fill out all required fields before Withdrawal.")
            return
        }

        if (parseFloat(amount) < 30) {
            toast.error("The minimum deposit amount is 30 USD.")
            return
        }

        const formData = new FormData();
        formData.append("user_id", user.user_id);
        formData.append("payment_method", "bank transfer");
        formData.append("requested_amount_usd", amount);
        formData.append("bank_account_holder_name", accountHolder);
        formData.append("bank_account_number", accountNumber);
        formData.append("bank_ifsc_code", ifscCode);
        formData.append("bank_name", bankName);
        formData.append("bank_branch_name", branchName);
        formData.append("country", country);
        // Append withdrawal source to track if from website or mobile app
        formData.append("withdrawal_source", withdrawalSource);

        try {
            await axios.post(`${BACKEND_API_URL}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })

            // alert("withdrawal submitted successfully")

            setTimeout(() => {
                navigate("/withdraw");
            }, 2000)

        } catch (error) {
            alert(error.response?.data?.error || "Something went wrong");
        }

    }

    useEffect(() => {
        const fetchWallet = async () => {
            if (!user?.user_id || !token) return;
            try {
                const { data } = await axios.get(`${BACKEND_API_URL}/wallet/${user.user_id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                // console.log("Wallet API response:", data);
                if (data.status === "success") setBalance(data.wallet);
                else setBalance(0);
            } catch (error) {
                console.error("Failed to fetch wallet:", error);
                setBalance(0);
            }
        };

        fetchWallet();
    }, [user, token]);

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const { data } = await axios.get(`${BACKEND_API_URL}/values/getdata`);
                if (data.success && data.data) {
                    setAdminRate({
                        minimum_withdrawal: parseFloat(data.data.minimum_withdrawal) || 10
                    });
                }
            } catch (error) {
                console.error("Failed to fetch admin rates:", error);
            }
        };

        fetchAdmin();
    }, []);

  const trimStartOnly = (value) => value.replace(/^\s+/, "");

    return (
        <div>
            <DashboardNavebar />

            <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" transition={Slide} />
        <div className='pt-[70px]' >
            <WitdrawaBalacne />
        </div>
            <div className="mx-4 md:mx-24 flex flex-col md:flex-row gap-6 md:gap-12">
                {/* Left Section */}
                 <div className='flex'>
                {/* <Allcomponent /> */}
                <div className="hidden md:block w-px h-[828px]  ml-12 mx-14 bg-[#C3C3C3]"></div>

</div>
                {/* Divider (desktop only) */}

                {/* Right Section */}
                <div className="w-full mt-6  xl:w-[1200px] flex flex-col gap-2 md:mt-10  lg:-ml-24 xl:-ml-24">
                    {/* Tabs */}
                    <div className="flex flex-wrap gap-4 ml-16 md:gap-10 md:ml-0">
                        <button
                            className={`font-semibold text-xl md:text-2xl px-2 py-1 rounded-md transition-colors duration-300 ${isDark ? "bg-[#2A3640] text-white" : "bg-[#F5F5F5] text-gray-800"}`}
                            onClick={() => navigate("/withdraw/addbank")}
                        >
                            Saved Bank
                        </button>
                        <button className={`font-semibold text-xl md:text-2xl px-2 py-1 rounded-md underline transition-colors duration-300 ${isDark ? "bg-[#2A3640] text-white" : "bg-[#F5F5F5] text-gray-800"}`}>
                            Add Bank
                        </button>
                    </div>

                    {/* Divider */}
                    <div className={`hidden w md:block border md:-ml-2 transition-colors duration-300 ${isDark ? "border-[#2A3640]" : "border-[#C3C3C3]"}`}></div>

                    <div className='mx-2 flex flex-col gap-5 2xl:ml-20'>
                        {/* Title */}
                        <div className="flex items-center gap-1 mt-6">
                            <div className="relative w-12 h-12">
                                <img src={upi} alt="BNB" className="absolute -bottom-2 right-2 w-15 h-15" />
                            </div>
                            <h2 className={`font-extrabold text-2xl md:text-4xl transition-colors duration-300 ${isDark ? "text-white" : "text-gray-800"}`}>Bank Withdrawal </h2>
                        </div>

                        {/* Minimum Withdrawal */}
                        <div className="w-full mt-4">
                            <h3 className={`font-bold text-lg md:text-xl transition-colors duration-300 ${isDark ? "text-[#FF6B6B]" : "text-[#A40000]"}`}>
                                Minimum Withdrawal Amount: {Number(adminRate.minimum_withdrawal).toFixed(2)} USD
                            </h3>

                            {/* Form */}
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 mt-4">
                                {[
                                    { label: "Account Holder Name", value: accountHolder, setter: setAccountHolder },
                                    { label: "Account Number", value: accountNumber, setter: setAccountNumber },
                                    { label: "Bank IFSC Code", value: ifscCode, setter: setIfscCode },
                                    { label: "Bank Name", value: bankName, setter: setBankName },
                                    { label: "Bank Branch Name", value: branchName, setter: setBranchName },
                                    { label: "Country", value: country, setter: setCountry },
                                ].map((field, idx) => (
                                    <div key={idx}>
                                        <h3 className={`font-medium text-lg md:text-xl ${isDark ? "text-white" : "text-[#080808]"}`}>{field.label}</h3>
                                        <div className={`flex gap-2 px-4 py-2 w-full border rounded-md items-center md:w-80 transition-colors duration-300 ${isDark ? "border-[#2A3640] bg-[#1A242B]" : "border-[#868686] bg-[#FBFBFB]"}`}>
                                            <input
                                                type="text"
                                                className={`w-full outline-none text-sm md:text-base bg-transparent transition-colors duration-300 ${isDark ? "text-white" : "text-[#080808]"}`}
                                                value={field.value}
                                                onChange={(e) => field.setter(trimStartOnly(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Submit Button */}
                             <div className="flex justify-center  2xl:ml-96">
                                <button
                                    className=" mt-4 md:mt-6 w-90 rounded-lg bg-[#E27C00] px-4 py-2 font-medium text-white flex items-center justify-center gap-2 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
                                    onClick={!loading ? handleSaveBank : undefined}
                                    disabled={loading}
                                >
                                    {loading && <FaSpinner className="animate-spin text-white text-xl md:text-2xl" />}
                                    <span className="text-lg md:text-2xl">{loading ? "Processing..." : "Make as Save Bank"}</span>
                                </button>
                            </div>
                           
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Savebank