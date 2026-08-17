import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardNavebar from '../DepositNavbar/DashboardNavebar';
import axios from "axios";
import { useAuth } from '../context/AuthContext';
import { Slide, ToastContainer, toast } from 'react-toastify';
import { FaSpinner } from "react-icons/fa";
import { BACKEND_API_URL } from '../../api/config';
import upi from '../../assets/img/deposit/upi.png'
import WitdrawaBalacne from '../History/WitdrawaBalacne'
import { useTheme } from '../../context/ThemeContext'


const BankTransfer = () => {
    const navigate = useNavigate();
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState("");
    const [accountHolder, setAccountHolder] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [ifscCode, setIfscCode] = useState("");
    const [bankName, setBankName] = useState("");
    const [branchName, setBranchName] = useState("");
    const [country, setCountry] = useState("");
    const { user, token } = useAuth()
    const [adminRate, setAdminRate] = useState({ minimum_withdrawal: 30, inr_value: 90, deposit_fee: 0, withdrawal_fee: 0 });
    const [loading, setLoading] = useState(false);
    const { isDark } = useTheme();

    const location = useLocation();
    const savedBankData = location.state || {};

    // Fixing Minimum Withdrawal,INR values and others 
    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const { data } = await axios.get(`${BACKEND_API_URL}/values/getdata`);

                if (data.success && data.data) {
                    setAdminRate({
                        minimum_withdrawal: parseFloat(data.data.minimum_withdrawal) || 30,
                        inr_value: parseFloat(data.data.inr_value) || 90,
                        deposit_fee: parseFloat(data.data.deposit_fee) || 0,
                        withdrawal_fee: parseFloat(data.data.withdrawal_fee) || 0,
                    })
                }
            } catch (error) {
                console.error("Failed to fetch admin rates:", error);
            }
        };
        fetchAdmin()
    }, [])

    // caluclation

    const numericAmount = parseFloat(amount) || 0;
    const feeAmount = numericAmount > 0 ? (numericAmount * (adminRate.withdrawal_fee / 100)) : 0;
    const receiveAmount = numericAmount > 0 ? (numericAmount - feeAmount) : 0;

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
        const savedBank = JSON.parse(localStorage.getItem("savedBank"));
        if (savedBank) {
            setAccountHolder(savedBank.accountHolder || "");
            setAccountNumber(savedBank.accountNumber || "");
            setIfscCode(savedBank.ifscCode || "");
            setBankName(savedBank.bankName || "");
            setBranchName(savedBank.branchName || "");
            setCountry(savedBank.country || "");
        }
    }, []);

    const handelWithdrawl = async () => {
        if (!accountHolder || !accountNumber || !ifscCode || !bankName || !branchName || !country || !amount) {
            toast.warning("Please fill out all required fields before Withdrawal.");
            return;
        }

        const numericAmount = parseFloat(amount);
        if (numericAmount < adminRate.minimum_withdrawal) {
            toast.error(`The minimum withdrawal amount is ${adminRate.minimum_withdrawal} USD.`);
            return;
        }

        // check balance 
        if (numericAmount > balance) {
            toast.error("Insufficient balance");
            return
        }

        const fee = parseFloat((numericAmount * (adminRate.withdrawal_fee / 100)).toFixed(2));
        const receivedAmount = parseFloat((numericAmount - fee).toFixed(2));

        try {
            setLoading(true);

            const startTime = Date.now(); // record start
            const username = user?.username && user.username !== "Null" ? user.username : "";

            const { data } = await axios.post(`${BACKEND_API_URL}/withdrawal`, {
                user_id: user.user_id,
                username,
                email:user.email,
                payment_method: "bank transfer",
                requested_amount_usd: numericAmount,
                transfer_amount_usd: receivedAmount,
                bank_account_holder_name: accountHolder.trim(),
                bank_account_number: accountNumber.trim(),
                bank_ifsc_code: ifscCode.trim(),
                bank_name: bankName.trim(),
                bank_branch_name: branchName.trim(),
                country: country.trim()
            });

            toast.success(data.message || "Withdrawal");
            setBalance("");
            setAmount("")

            const elapsed = Date.now() - startTime;
            const remaining = 1500 - elapsed;
            if (remaining > 0) await new Promise(r => setTimeout(r, remaining));

            navigate("/dashboard");

        } catch (error) {
            console.error("Withdrawal error:", error);
            toast.error(error.response?.data?.error || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // Check if form is valid
    const isFormValid = accountHolder && accountNumber && ifscCode && bankName && branchName && country && parseFloat(amount) >= 30;

    return (
        <div>
            <DashboardNavebar />

            <ToastContainer position='top-right' autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable
                pauseOnHover theme='dark' transition={Slide} />
          <div className='pt-[70px]' >
            <WitdrawaBalacne />
          </div>
            <div className='mx-4 md:mx-24 flex flex-col md:flex-row'>
                {/* Left Section */}
                <div className='h-auto md:h-[800px] overflow-y-auto scroll-area xl:w-[720px] 2xl:w-105'>
                    {/* <Allcomponent /> */}
                    <div className='mt-10 border h-64  rounded-2xl px-4 py-2 md:-mt-65 xl:mt-10 md:ml-0 md:w-[400px]'>
                        <h2 className='font-bold text-center text-lg md:text-xl'>Steps to Withdraw</h2>
                        <p className='border border-[#CECECE]'></p>
                        <div className='flex flex-col gap-3 mt-3 md:gap-4 md:mt-4 '>
                            {[
                                "Check your bank account details.",
                                "Must check all the filled fields are correct.",
                                "Enter the amount to withdrawal in USD.",
                                "Click 'Withdraw' and your fund wil get processed."
                            ].map((step, i) => (
                                <div key={i} className='flex items-start gap-2'>
                                    <h4 className='rounded-full bg-[#F7931A] w-6 h-6 text-sm font-bold text-white flex items-center justify-center'>{i + 1}</h4>
                                    <p className='font-medium text-sm md:text-base'>
                                        {i === 4 ? (
                                            <>
                                                Click <span className='font-bold'>Withdraw</span>  and your fund wil get processed.
                                            </>
                                        ) : (
                                            step
                                        )}
                                    </p>
                                </div>
                            ))}
                        </div>                     
                    </div>
                     <div className="bg-[#EBDDDD]  flex items-start mt-10 md:items-center gap-2 px-3 py-2 rounded-sm md:w-[400px]">
                            <h2 className="mt-2 text-[#AD0000] font-bold md:mt-0">Note:</h2>
                            <div className="hidden md:block w-px h-20 mx-2 bg-[#AD000054]"></div>
                            <p className="text-[#AD0000] font-medium text-sm md:text-base">
                                Incorrect details may lead to wrong processing. Please check carefully before submitting.
                            </p>
                        </div>
                </div>


                {/* Divider (desktop only) */}
                <div className="hidden md:block w-px h-[830px] ml-12 mx-14 xl:ml-2 bg-[#C3C3C3]"></div>

                {/* Right Section */}
                <div className='mt-10 mx-2  md:w-[1200px] -ml-20 md:mt-8 2xl:-ml-10'>


                    {/* Minimum Withdrawal */}
                    <div className='md:mx-10 mt-6 md:mt-8 w-full'>

                        <div className='ml-20 gap-10 flex -mt-5 md:ml-0'>
                            <button className={`font-semibold text-2xl px-2 py-1 cursor-pointer rounded-md underline transition-colors duration-300 ${isDark ? "bg-[#2A3640] text-white" : "bg-[#F5F5F5] text-gray-800"}`} onClick={() => navigate("/withdraw/addbank")}>Saved Bank</button>
                            <button className={`font-semibold text-2xl px-2 py-1 cursor-pointer rounded-md transition-colors duration-300 ${isDark ? "bg-[#2A3640] text-white" : "bg-[#F5F5F5] text-gray-800"}`} onClick={() => navigate("/withdraw/bank")}>Add Bank</button>
                        </div>
                        <div className={`hidden md:block border mt-0.5 -ml-4 2xl:-ml-14 transition-colors duration-300 ${isDark ? "border-[#2A3640]" : "border-[#C3C3C3]"}`}></div>
                        <div className="flex items-center  ml-20 gap-4 w-90 mt-10 md:ml-0 md:w-full">
                            {/* Main Token Image */}
                            <div className="relative w-12 h-12">
                                {/* Overlay BNB Image */}
                                <img  src={upi}  alt="BNB" className="absolute -bottom-2 -right-2 w-15 h-15" />
                            </div>
                            {/* Title next to image */}
                            <h2 className={`font-extrabold text-4xl transition-colors duration-300 ${isDark ? "text-white" : "text-gray-800"}`}>Bank Withdrawal </h2>
                        </div>

                        {/* Minimum Deposit */}
                        <div className='mt-8 w-90 ml-24 md:mt-10 md:ml-0 md:w-full'>
                            <h3 className={`font-bold md:text-xl transition-colors duration-300 ${isDark ? "text-[#FF6B6B]" : "text-[#A40000]"}`}>Minimum Withdrawal Amount: {adminRate.minimum_withdrawal} USD</h3>


                            <div className='grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-10 mt-6 md:mt-10'>
                                <div className=''>
                                    <h3 className={`font-medium text-xl transition-colors duration-300 ${isDark ? "text-white" : "text-[#080808]"}`}>Account Holder Name</h3>
                                    <div className={`flex gap-2 px-4 py-2 w-90 md:w-90 border rounded-md items-center transition-colors duration-300 ${isDark ? "border-[#2A3640] bg-[#1A242B]" : "border-[#868686] bg-[#FBFBFB]"}`}>
                                        <input type="text" className={`w-full outline-none bg-transparent transition-colors duration-300 ${isDark ? "text-white" : "text-[#080808]"}`} value={accountHolder} onChange={(e) => setAccountHolder(e.target.value.trimStart())} /></div>
                                </div>
                                <div>
                                    <h3 className={`font-medium text-xl transition-colors duration-300 ${isDark ? "text-white" : "text-[#080808]"}`}>Account Number</h3>
                                    <div className={`flex gap-2 px-4 py-2 w-full md:w-90 border rounded-md items-center transition-colors duration-300 ${isDark ? "border-[#2A3640] bg-[#1A242B]" : "border-[#868686] bg-[#FBFBFB]"}`}>
                                        <input type="text" className={`w-full outline-none bg-transparent transition-colors duration-300 ${isDark ? "text-white" : "text-[#080808]"}`} value={accountNumber} onChange={(e) => setAccountNumber(e.target.value.trimStart())} /></div>
                                </div>
                                <div>
                                    <h3 className={`font-medium text-xl transition-colors duration-300 ${isDark ? "text-white" : "text-[#080808]"}`}>Bank IFSC Code</h3>
                                    <div className={`flex gap-2 px-4 py-2 w-full md:w-90 border rounded-md items-center transition-colors duration-300 ${isDark ? "border-[#2A3640] bg-[#1A242B]" : "border-[#868686] bg-[#FBFBFB]"}`}>
                                        <input type="text" className={`w-full outline-none bg-transparent transition-colors duration-300 ${isDark ? "text-white" : "text-[#080808]"}`} value={ifscCode} onChange={(e) => setIfscCode(e.target.value.trimStart())} /></div>
                                </div>
                                <div>
                                    <h3 className={`font-medium text-xl transition-colors duration-300 ${isDark ? "text-white" : "text-[#080808]"}`}>Bank Name</h3>
                                    <div className={`flex gap-2 px-4 py-2 w-full md:w-90 border rounded-md items-center transition-colors duration-300 ${isDark ? "border-[#2A3640] bg-[#1A242B]" : "border-[#868686] bg-[#FBFBFB]"}`}>
                                        <input type="text" className={`w-full outline-none bg-transparent transition-colors duration-300 ${isDark ? "text-white" : "text-[#080808]"}`} value={bankName} onChange={(e) => setBankName(e.target.value.trimStart())} /></div>
                                </div>
                                <div>
                                    <h3 className={`font-medium text-xl transition-colors duration-300 ${isDark ? "text-white" : "text-[#080808]"}`}>Bank Branch Name</h3>
                                    <div className={`flex gap-2 px-4 py-2 w-full md:w-90 border rounded-md items-center transition-colors duration-300 ${isDark ? "border-[#2A3640] bg-[#1A242B]" : "border-[#868686] bg-[#FBFBFB]"}`}>
                                        <input type="text" className={`w-full outline-none bg-transparent transition-colors duration-300 ${isDark ? "text-white" : "text-[#080808]"}`} value={branchName} onChange={(e) => setBranchName(e.target.value.trimStart())} /></div>
                                </div>
                                <div>
                                    <h3 className={`font-medium text-xl transition-colors duration-300 ${isDark ? "text-white" : "text-[#080808]"}`}>Country</h3>
                                    <div className={`flex gap-2 px-4 py-2 w-full md:w-90 border rounded-md items-center transition-colors duration-300 ${isDark ? "border-[#2A3640] bg-[#1A242B]" : "border-[#868686] bg-[#FBFBFB]"}`}>
                                        <input type="text" className={`w-full outline-none bg-transparent transition-colors duration-300 ${isDark ? "text-white" : "text-[#080808]"}`} value={country} onChange={(e) => setCountry(e.target.value.trimStart())} /></div>
                                </div>

                                <div>
                                        <h3 className={`text-lg md:text-xl font-medium transition-colors duration-300 ${isDark ? "text-white" : "text-[#080808]"}`}>Enter Amount in USD</h3>
                                        <div className={`flex gap-2 px-4 py-2 w-full md:w-90 border rounded-md items-center transition-colors duration-300 ${isDark ? "border-[#2A3640] bg-[#1A242B]" : "border-[#868686] bg-white"}`}>
                                            <h3 className='rounded-full bg-[#E27C00] w-6 h-6 text-sm font-bold text-white flex items-center justify-center'>$</h3>
                                            <input
                                                type="number"
                                                min="30"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className={`flex-1 outline-none text-lg md:text-xl font-medium bg-transparent transition-colors duration-300 ${isDark ? "text-white" : "text-[#080808]"}`}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <button
                                            className="w-full mt-6 rounded-lg bg-[#E27C00] px-4 py-2 md:px-4 md:py-2 font-medium text-white transition  disabled:cursor-not-allowed flex items-center justify-center gap-2 md:w-90"
                                            onClick={!loading ? handelWithdrawl : undefined}
                                            disabled={loading}
                                        >
                                            {loading && <FaSpinner className="animate-spin text-white text-xl md:text-2xl" />}
                                            <span className='text-2xl'>
                                                {loading ? "Processing..." : "WITHDRAW"}
                                            </span>
                                        </button>
                                        <h3 className={`text-lg ml-40 mt-2 md:text-xl font-medium xl:ml-30 transition-colors duration-300 ${isDark ? "text-white" : "text-[#080808]"}`}>Withdrawal Fee : {numericAmount ? feeAmount.toFixed(2) : ""}</h3>
                                <div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default BankTransfer;