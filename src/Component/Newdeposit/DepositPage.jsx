import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import UPIICON from '../../assets/img/newdeposit/upi.svg';
import USDTBEPICON from '../../assets/img/newdeposit/usdt_bep.svg';
import USDTTRCICON from '../../assets/img/newdeposit/usdt_trc.svg';
import USDTERCICON from '../../assets/img/newdeposit/usdt_erc.svg';
import BTC from '../../assets/img/newdeposit/bitcoin.svg';
import BANKTRANSFERICON from '../../assets/img/newdeposit/Bank.svg';
import DepositBalance from '../History/DepositBalance';
import DashboardNavebar from '../DepositNavbar/DashboardNavebar';
import axios from '../../services/api';
import { BACKEND_API_URL } from '../../api/config';
import { useTheme } from '../../context/ThemeContext';

const DepositPage = () => {

    const navigate = useNavigate();
    const { isDark } = useTheme();
    const [paymentModes, setPaymentModes] = useState([]);

    useEffect(() => {
        const fetchPaymentModes = async () => {
            try {
                const { data } = await axios.get(
                    `${BACKEND_API_URL}/payment/getactive?type=deposit`
                );

                if (data.success && data.data) {
                    let modes = data.data;

                    if (Array.isArray(modes) && Array.isArray(modes[0])) {
                        modes = modes[0];
                    }

                    modes = modes.map(m => ({
                        ...m,
                        payment_mode: m.payment_mode?.trim().replace(/_/g, "").toLowerCase(),
                        deposit_status: m.deposit_status?.trim().toLowerCase()
                    }));

                    setPaymentModes(modes);
                } else {
                    setPaymentModes([]);
                }
            } catch (err) {
                console.error("Failed to fetch payment modes:", err);
                setPaymentModes([]);
            }
        };

        fetchPaymentModes();
    }, []);

    const methods = [
        {
            key: "usdt",
            normKey: "usdt",
            icon: <img src={USDTBEPICON} alt="bep20" />,
            network: "USDT (BEP20)",
            processing: "Within 24 hours",
            fees: "0%",
            limit: "10 – 200,000 USD",
            path: "/deposit/usdt"
        },
        {
            key: "UPI",
            normKey: "upi",
            icon: <img src={UPIICON} alt="upi" />,
            network: "UPI",
            processing: "Within 24 hours",
            fees: "0%",
            limit: "₹900 – ₹200,000",
            path: "/deposit/upi"
        },
        {
            key: "bit_coin",
            normKey: "bitcoin",
            icon: <img src={BTC} alt="btc" />,
            network: "BITCOIN",
            processing: "Within 24 hours",
            fees: "0%",
            limit: "0.00011 BTC – UNLIMITIED",
            path: "/deposit/bitcoin"
        },
        {
            key: "usdt_trc_20",
            normKey: "usdttrc20",
            icon: <img src={USDTTRCICON} alt="trc20" />,
            network: "USDT (TRC20)",
            processing: "Within 24 hours",
            fees: "0%",
            limit: "10 – 200,000 USD",
            path: "/deposit/usdt/trc20"
        },
        {
            key: "usdt_erc_20",
            normKey: "usdterc20",
            icon: <img src={USDTERCICON} alt="erc20" />,
            network: "USDT (ERC20)",
            processing: "Within 24 hours",
            fees: "0%",
            limit: "10 – 200,000 USD",
            path: "/deposit/usdt/erc20"
        },
        {
            key: "bank_transfer",
            normKey: "banktransfer",
            icon: <img src={BANKTRANSFERICON} alt="erc20" />,
            network: "Bank Transfer",
            processing: "Within 24 hours",
            fees: "0%",
            limit: "100 - 100,000 USD",
        },
    ];

    return (
        <>
            <DashboardNavebar />
            <div className={`mt-17 min-h-screen transition-colors duration-300 ${isDark ? "bg-[#141D22]" : ""}`}>
                <div className={`transition-colors duration-300 ${isDark ? "bg-[#141D22]" : ""}`}>
                    <DepositBalance />
                </div>
                <div className={`flex items-center justify-center py-10 px-4 transition-colors duration-300 ${isDark ? "bg-[#141D22]" : "bg-white"}`}>
                    <div className="max-w-[1800px] w-full">
                        <h1 className={`text-2xl lg:text-3xl font-semibold mb-6 transition-colors duration-300 ${isDark ? "text-white" : "text-gray-900"}`}>
                            Select Deposit Type
                        </h1>
                        <div className="p-5 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 lg:gap-15">
                            {methods.filter(method =>
                                paymentModes.some(
                                    pm =>
                                        pm.payment_mode === method.normKey &&
                                        pm.deposit_status === "active"
                                )
                            )
                                .map((m, i) => (
                                    <div
                                        key={i}
                                        onClick={() => { localStorage.setItem("deposit_type", m.normKey); navigate(m.path) }}
                                        className={`p-6 flex gap-5 rounded-xl shadow hover:shadow-xl cursor-pointer transition-all ease-in-out duration-200 ${
                                            isDark
                                                ? "bg-[#1A242B] border border-[#2A3640] hover:border-[#1A242B]/40"
                                                : "bg-white border border-gray-300 hover:border-blue-300"
                                        }`}
                                    >
                                        <div className={`w-25 h-25 rounded-lg flex items-center justify-center transition-colors duration-300`}>
                                            <span>{m.icon}</span>
                                        </div>

                                        <div>
                                            <h2 className={`text-xl lg:text-2xl font-semibold transition-colors duration-300 ${isDark ? "text-white" : "text-gray-800"}`}>
                                                {m.network}
                                            </h2>
                                            <div className={`text-xs lg:text-sm space-y-1 transition-colors duration-300 ${isDark ? "text-[#8899A6]" : "text-gray-700"}`}>
                                                <p><span className={`font-medium transition-colors duration-300 ${isDark ? "text-[#E8EDF0]" : ""}`}>Processing Time:</span> {m.processing}</p>
                                                <p><span className={`font-medium transition-colors duration-300 ${isDark ? "text-[#E8EDF0]" : ""}`}>Fees:</span> {m.fees}</p>
                                                <p><span className={`font-medium transition-colors duration-300 ${isDark ? "text-[#E8EDF0]" : ""}`}>Limit:</span> {m.limit}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DepositPage;
