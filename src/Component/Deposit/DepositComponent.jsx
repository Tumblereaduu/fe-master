import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import upi from '../../assets/img/deposit/upi.png'
import T from '../../assets/img/transfer/T.svg'
import bnb from '../../assets/img/transfer/BNB 2.svg'
import axios from 'axios';
import { BACKEND_API_URL } from '../../api/config';

const DepositComponent = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const { type } = useParams();

    // payment type can come from navigation state or URL param (e.g. /deposit/usdt)
    const paymentType = localStorage.getItem("deposit_type")
    const [selectedPayment, setSelectedPayment] = useState(paymentType || "");
    const [paymentModes, setPaymentModes] = useState([]);

    useEffect(() => {
        const fetchPaymentModes = async () => {
            try {
                const { data } = await axios.get(`${BACKEND_API_URL}/payment/getactive?type=deposit`);

                if (data.success && data.data) {
                    let modes = data.data;

                    // Ensure array
                    if (!Array.isArray(modes)) {
                        modes = Object.values(modes);
                    }

                    // Flatten arrays
                    modes = modes.flat(Infinity);

                    // Normalize values
                    modes = modes.map(m => ({
                        ...m,
                        payment_mode: m.payment_mode?.trim().replace(/_/g, "").toLowerCase() || "",
                        deposit_status: m.deposit_status?.trim().toLowerCase() || ""
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



    return (
        <div>
            <div className="flex-1 flex flex-col gap-10">

                {/* USDT CARD */}
                {/* {
                    paymentModes.some(m => m.payment_mode === "usdt" && m.deposit_status === "active") && (
                        <div
                            className={`relative flex gap-5 items-center shadow-xl p-4 justify-center rounded-sm border border-[#BDBDBD]
      ${paymentType?.toLowerCase() === "usdt" ? "bg-[#F7931A5E]" : "bg-white"}`}
                            onClick={() => navigate("/deposit/usdt", { state: { payment_type: "USDT" } })}
                        >
                            <div className="relative w-16 h-16">
                                <img src={T} alt="USDT" className="w-full h-full" />
                                <img src={bnb} alt="BNB" className="absolute -bottom-2 -right-0 w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold">USDT (BEP 20)</h3>
                                <p>Processing Time: Instant - 30minutes</p>
                                <p>Fees: 0%</p>
                                <p>Limit: 10 - 200,000 USD</p>
                            </div>
                        </div>
                    )
                } */}


                {/* UPI CARD */}
                {/* {
                    paymentModes.some(m => m.payment_mode === "upi" && m.deposit_status === "active") && (
                        <div
                            className={`relative flex gap-5 items-center shadow-xl p-4 justify-center rounded-sm border border-[#BDBDBD]
      ${paymentType?.toLowerCase() === "upi" ? "bg-[#F7931A5E]" : "bg-white"}`}
                            onClick={() => navigate("/deposit/upi", { state: { payment_type: "UPI" } })}
                        >
                            <img src={upi} alt="" className='w-15 h-15' />
                            <div>
                                <h3 className="font-semibold">UPI</h3>
                                <p>Processing Time: Instant - 30minutes</p>
                                <p>Fees: 0%</p>
                                <p>Limit: 960 INR - 1,00,000 INR</p>
                            </div>
                        </div>
                    )
                } */}


                {/*USDT Steps */}
                {
                    paymentType === "usdt" && (
                        <div className='border  rounded-2xl px-2 py-1 lg:w-[470px]'>
                            <h2 className='font-bold text-center text-lg md:text-xl'>Steps to Deposit</h2>
                            <p className='border border-[#CECECE]'></p>

                            <div className='flex flex-col gap-3 mt-3 md:gap-4 md:mt-4'>
                                {[
                                    "Enter the amount in USDT.",
                                    "Scan the QR Code or Use USDT BEP 20 Address to make your payment.",
                                    "Enter the TxId.",
                                    "Upload payment screenshot.",
                                    "Click 'Submit' and your amount will be reflected in your account shortly."
                                ].map((step, i) => (
                                    <div key={i} className='flex items-start gap-2'>
                                        <h4 className='rounded-full bg-[#F7931A] min-w-[1.5rem] h-6 text-sm font-bold text-white flex items-center justify-center px-1'>
                                            {i + 1}
                                        </h4>
                                        <p className='font-medium text-sm md:text-base break-words'>
                                            {i === 4 ? (
                                                <>
                                                    Click <span className='font-bold'>DEPOSIT</span> and your amount reflects in your account
                                                </>
                                            ) : (
                                                step
                                            )}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }


                {/*UPI Steps */}
                {
                    paymentType === "upi" && (
                        <div className='border  rounded-2xl px-2 py-1 lg:w-[470px]'>
                            <h2 className='font-bold text-center text-lg md:text-xl'>Steps to Deposit</h2>
                            <p className='border border-[#CECECE]'></p>

                            <div className='flex flex-col gap-3 mt-3 md:gap-4 md:mt-4'>
                                {[
                                    "Enter the amount in INR.",
                                    "Scan the QR Code or Use UPI ID to make your payment.",
                                    "Enter the UPI Transaction ID / UTR ID.",
                                    "Upload payment screenshot.",
                                    "Click 'Submit' and your amount will be reflected in your account shortly."
                                ].map((step, i) => (
                                    <div key={i} className='flex items-start gap-2'>
                                        <h4 className='rounded-full bg-[#F7931A] min-w-[1.5rem] h-6 text-sm font-bold text-white flex items-center justify-center px-1'>
                                            {i + 1}
                                        </h4>
                                        <p className='font-medium text-sm md:text-base break-words'>
                                            {i === 4 ? (
                                                <>
                                                    Click <span className='font-bold'>DEPOSIT</span> and your amount reflects in your account
                                                </>
                                            ) : (
                                                step
                                            )}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }

                {
                    paymentType === "bitcoin" && (
                        <div className='border  rounded-2xl px-2 py-1 lg:w-[470px]'>
                            <h2 className='font-bold text-center text-lg md:text-xl'>Steps to Deposit</h2>
                            <p className='border border-[#CECECE]'></p>

                            <div className='flex flex-col gap-3 mt-3 md:gap-4 md:mt-4'>
                                {[
                                    "Enter the amount in BTC.",
                                    "Scan the QR Code or Use BTC ID to make your payment.",
                                    "Enter the BTC Transaction ID / BTC ID.",
                                    "Upload payment screenshot.",
                                    "Click 'Submit' and your amount will be reflected in your account shortly."
                                ].map((step, i) => (
                                    <div key={i} className='flex items-start gap-2'>
                                        <h4 className='rounded-full bg-[#F7931A] min-w-[1.5rem] h-6 text-sm font-bold text-white flex items-center justify-center px-1'>
                                            {i + 1}
                                        </h4>
                                        <p className='font-medium text-sm md:text-base break-words'>
                                            {i === 4 ? (
                                                <>
                                                    Click <span className='font-bold'>DEPOSIT</span> and your amount reflects in your account
                                                </>
                                            ) : (
                                                step
                                            )}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }

                  {
                    paymentType === "usdttrc20" && (
                        <div className='border  rounded-2xl px-2 py-1 lg:w-[470px]'>
                            <h2 className='font-bold text-center text-lg md:text-xl'>Steps to Deposit</h2>
                            <p className='border border-[#CECECE]'></p>

                            <div className='flex flex-col gap-3 mt-3 md:gap-4 md:mt-4'>
                                {[
                                    "Enter the amount in USDT TRC 20.",
                                    "Scan the QR Code or Use USDT TRC 20 Address to make your payment.",
                                    "Enter the USDT TRC 20 TxID ID.",
                                    "Upload payment screenshot.",
                                    "Click 'Submit' and your amount will be reflected in your account shortly."
                                ].map((step, i) => (
                                    <div key={i} className='flex items-start gap-2'>
                                        <h4 className='rounded-full bg-[#F7931A] min-w-[1.5rem] h-6 text-sm font-bold text-white flex items-center justify-center px-1'>
                                            {i + 1}
                                        </h4>
                                        <p className='font-medium text-sm md:text-base break-words'>
                                            {i === 4 ? (
                                                <>
                                                    Click <span className='font-bold'>DEPOSIT</span> and your amount reflects in your account
                                                </>
                                            ) : (
                                                step
                                            )}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }

                  {
                    paymentType === "usdterc20" && (
                        <div className='border  rounded-2xl px-2 py-1 lg:w-[470px]'>
                            <h2 className='font-bold text-center text-lg md:text-xl'>Steps to Deposit</h2>
                            <p className='border border-[#CECECE]'></p>

                            <div className='flex flex-col gap-3 mt-3 md:gap-4 md:mt-4'>
                                {[
                                    "Enter the amount in USDT ERC 20.",
                                    "Scan the QR Code or Use USDT ERC 20 Address to make your payment.",
                                    "Enter the USDT ERC 20 TxID ID.",
                                    "Upload payment screenshot.",
                                    "Click 'Submit' and your amount will be reflected in your account shortly."
                                ].map((step, i) => (
                                    <div key={i} className='flex items-start gap-2'>
                                        <h4 className='rounded-full bg-[#F7931A] min-w-[1.5rem] h-6 text-sm font-bold text-white flex items-center justify-center px-1'>
                                            {i + 1}
                                        </h4>
                                        <p className='font-medium text-sm md:text-base break-words'>
                                            {i === 4 ? (
                                                <>
                                                    Click <span className='font-bold'>DEPOSIT</span> and your amount reflects in your account
                                                </>
                                            ) : (
                                                step
                                            )}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }


                <div className="bg-[#EBDDDD] flex items-start md:items-center gap-2 px-3 py-2 rounded-xl lg:w-[470px]">
                    <h2 className="text-[#AD0000] font-bold">Note:</h2>
                    <div className="hidden md:block w-px h-20 mx-2 bg-[#AD000054]"></div>
                    {
                        paymentType === "usdt" || "usdttrc20" || "usdterc20" ?
                         <>
                         <p className="text-[#AD0000] font-medium text-sm md:text-base">After transferring the amount, please enter the TxID and upload the payment screenshot (maximum file size: 2MB)</p>
                        </> 
                        : paymentType === "bitcoin" ? 
                        <>
                         <p className="text-[#AD0000] font-medium text-sm md:text-base">After transferring the amount, please enter the BTC ID and upload the payment screenshot (maximum file size: 2MB)</p>
                        </>
                        : <>
                           <p className="text-[#AD0000] font-medium text-sm md:text-base">After transferring the amount, please enter the UTR ID and upload the payment screenshot (maximum file size: 2MB)</p>
                         </>                   
                    }              
                </div>

            </div>
        </div>
    )
}

export default DepositComponent
