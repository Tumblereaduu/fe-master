import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import upi from '../../assets/img/deposit/upi.png'
import T from '../../assets/img/transfer/T.svg'
import bnb from '../../assets/img/transfer/BNB 2.svg'
import bank from '../../assets/img/deposit/Bank.svg'
import axios from 'axios';
import { BACKEND_API_URL } from '../../api/config';

const Allcomponent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { type } = useParams();
    const [paymentModes, setPaymentModes] = useState([]);
    const [adminRate, setAdminRate] = useState({
        minimum_withdrawal: 30,
        inr_value: 90,
        deposit_fee: 0,
        withdrawal_fee: 0,
    });

    const paymentType = (location.state?.payment_type || type || "").toString().toLowerCase();
    const [selectedPayment, setSelectedPayment] = useState(paymentType || "");
    const [bankSelected, setBankSelected] = useState(false);


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

    useEffect(() => {
        const fetchPaymentModes = async () => {
            try {
                const { data } = await axios.get(`${BACKEND_API_URL}/payment/getactive?type=withdraw`);
                if (data.success && data.data) {
                    const flat = Array.isArray(data.data[0]) ? data.data.flat() : data.data;
                    setPaymentModes(flat);
                } else {
                    setPaymentModes([]);
                }
            } catch (err) {
                console.error("Failed to fetch payment modes:", err);
            }
        };

        fetchPaymentModes();
    }, []);


    useEffect(() => {
        const paymentType = (location.state?.payment_type || type || "").toLowerCase();
        setSelectedPayment(paymentType);
    }, [location.state, type]);



    return (
        <div className='xl:h-[820px] overflow-y-auto pr-2 scroll-area'>
            <div className='md:py-5 flex flex-col gap-5 w-full md:w-96'>
                <div className="py-10 md:py-5 flex flex-col gap-5 w-full md:w-auto">
                    <div className="flex-1 flex flex-col gap-10">

                        {/* USDT CARD */}
                        {paymentModes
                            .filter(m => m.payment_mode?.toLowerCase() === "usdt" && m.withdrawal_status === "active")
                            .length > 0 && (
                                <div
                                    className={`relative flex gap-5 items-center shadow-xl p-4 rounded-lg border border-[#BDBDBD] cursor-pointer transition
            ${selectedPayment === "usdt" ? "bg-[#F7931A5E]" : "bg-white"}`}
                                    onClick={() => {
                                        setSelectedPayment("usdt");
                                        navigate("/withdraw/usdt", { state: { payment_type: "usdt" } });
                                    }}
                                >
                                    <div className="relative w-16 h-16">
                                        <img src={T} alt="USDT" className="w-full h-full" />
                                        <img src={bnb} alt="BNB" className="absolute -bottom-1 -right-1 w-6 h-6" />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold">USDT (BEP 20)</h3>
                                        <p>Processing Time: Within - 24hours</p>
                                        <p>Fees: 0%</p>
                                        <p>Limit: 10 - 200,000 USD</p>
                                    </div>
                                </div>
                            )
                        }

                        {/* UPI CARD */}
                        {paymentModes
                            .filter(m => m.payment_mode?.toLowerCase() === "upi" && m.withdrawal_status === "active")
                            .length > 0 && (
                                <div
                                    className={`relative flex gap-5 items-center shadow-xl p-4 rounded-lg border border-[#BDBDBD] cursor-pointer transition
        ${selectedPayment === "upi" ? "bg-[#F7931A5E]" : "bg-white"}`}
                                    onClick={() => {
                                        setSelectedPayment("upi");
                                        navigate("/withdraw/upi", { state: { payment_type: "upi" } });
                                    }}
                                >
                                    <div className="relative w-16 h-16">
                                        <img src={upi} alt="UPI" className="w-full h-full object-contain" />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold">UPI</h3>
                                        <p>Processing Time: Within - 24hours</p>
                                        <p>Fees: 0%</p>
                                        <p>Limit: 10 - 1000 USD</p>
                                    </div>
                                </div>
                            )}


                        {/* Bank Transfer*/}
                        {paymentModes
                            .filter(m => m.payment_mode?.toLowerCase() === "bank_transfer" && m.withdrawal_status === "active")
                            .length > 0 && (
                                <div
                                    className={`relative flex gap-5 items-center shadow-xl p-4 rounded-lg border border-[#BDBDBD] cursor-pointer transition
        ${selectedPayment === "bank" ? "bg-[#F7931A5E]" : "bg-white"}`}
                                    onClick={() => {
                                        setSelectedPayment("bank");
                                        navigate("/withdraw/bank", { state: { payment_type: "bank" } });
                                    }}
                                >
                                    <div className="relative w-16 h-16">
                                        <img src={bank} alt="Bank Transfer" className="w-full h-full object-contain" />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold">Bank Transfer</h3>
                                        <p>Processing Time: Within - 24hours</p>
                                        <p>Fees: 0%</p>
                                        <p>Limit: 10 - 1000 USD</p>
                                    </div>
                                </div>
                            )}


                    </div>
                </div>

            </div>
        </div>
    )
}

export default Allcomponent
