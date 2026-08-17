import React, { useEffect, useState } from 'react'
import T from '../../assets/img/transfer/T.svg'
import bank from '../../assets/img/transfer/bank.svg'
import BNB from '../../assets/img/transfer/BNB 2.svg'
import Payment from '../../assets/img/transfer/Payment method.svg'
import upi from '../../assets/img/transfer/UPI.svg'
import { CiSearch } from "react-icons/ci";
import cal from '../../assets/img/transfer/Calendar.svg'
import { useNavigate } from 'react-router-dom'
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import axios from 'axios'
import DashboardNavebar from '../DepositNavbar/DashboardNavebar'
import { useAuth } from '../context/AuthContext'
import { BACKEND_API_URL } from '../../api/config'


const Withdrawpage = () => {

    const navigate = useNavigate()
    const [balance, setBalance] = useState(0)
    const [withdraw, setWithdrawl] = useState([])
    const [search, setSearch] = useState("")
    const [rows, setRows] = useState(10)
    const [showCalendar, setShowCalendar] = useState(false);
    const [paymentModes, setPaymentModes] = useState([]);
    const [range, setRange] = useState([
        {
            startDate: new Date('2000-01-01'),
            endDate: new Date(),
            key: "selection",
        },
    ]);
    const [adminRate, setAdminRate] = useState({ minimum_withdrawal: 30, inr_value: 90, deposit_fee: 0, withdrawal_fee: 0 });
    const { user, token } = useAuth()

    // const token = localStorage.getItem("token")
    let userId = null

    if (token) {
        const payload = token.split('.')[1];
        if (payload) {
            const decodedPayload = JSON.parse(atob(payload))
            userId = decodedPayload.id
        }
    }

    console.log("User ID", userId)

    useEffect(() => {
        const fetchWithdrawl = async () => {
            if (!userId) {
                console.warn("User ID is null. Cannot fetch withdrawals.");
                return;
            }

            console.log("Fetching withdrawals for userId:", userId);

            try {
                const { data } = await axios.get(`${BACKEND_API_URL}/withdrawal/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("Response from API:", data);

                setWithdrawl(data.withdraw || []);
            } catch (error) {
                console.error("Failed to fetch withdrawal:", error.response || error);
            }
        }

        fetchWithdrawl();
    }, [userId, token]);


    const filterWithdrawl = withdraw.filter((wit) => {
        const trimmedSearch = search.trim().toLowerCase()
        const matchesSearch = wit.withdrawal_id?.toString().includes(trimmedSearch) ||
            wit.payment_method?.toLowerCase().includes(trimmedSearch) ||
            wit.withdrawal_status?.toLowerCase().includes(trimmedSearch) ||
            wit.requested_amount_usd?.toString().includes(trimmedSearch)

        const withdrawData = new Date(wit.withdrawal_request_at);
        const endOfDay = new Date(range[0].endDate)
        endOfDay.setHours(23, 59, 59, 999)

        const inDateRange = withdrawData >= range[0].startDate && withdrawData <= endOfDay
        return matchesSearch && inDateRange
    }).slice(0, rows || 10)


    const handleSelect = (item) => {
        const { startDate, endDate } = item.selection; // <-- fix
        setRange([item.selection]);

        // Close only when both dates are picked
        if (startDate && endDate && startDate.getTime() !== endDate.getTime()) {
            setShowCalendar(false);
        }
    };

    const formData = (dateString) => {
        const date = new Date(dateString)
        const day = String(date.getDate()).padStart(2, "0")
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const year = date.getFullYear()
        const hours = String(date.getHours()).padStart(2, "0")
        const minutes = String(date.getMinutes()).padStart(2, "0")
        return (`${day}-${month}-${year}-${hours}-${minutes}`)
    }

    const handleDeposit = (paymentType, nextPath) => {
        console.log("Clicked payment type:", paymentType); // optional, for debugging
        navigate(nextPath, { state: { payment_type: paymentType } });
    };

    // Active and InActive 

    useEffect(() => {
        const fetchPaymentModes = async () => {
            try {
                const { data } = await axios.get(`${BACKEND_API_URL}/payment/getactive?type=withdrawal`);
                if (data.success && data.data) {
                    // Flatten in case backend sends nested arrays
                    const flatData = Array.isArray(data.data[0]) ? data.data.flat() : data.data;
                    setPaymentModes(flatData);
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

    // Shwoing balance from wallet 
    useEffect(() => {
        const fetchWallet = async () => {
            if (!user?.user_id || !token) return;
            try {
                const { data } = await axios.get(`${BACKEND_API_URL}/wallet/${user.user_id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("Wallet API response:", data);
                if (data.status === "success") setBalance(data.wallet);
                else setBalance(0);
            } catch (error) {
                console.error("Failed to fetch wallet:", error);
                setBalance(0);
            }
        };

        fetchWallet();
    }, [user, token]);

    // Backend code 

    const handelWithdrawl = (paymentType, nextPath) => {
        console.log("clikced payment type:", paymentType);
        navigate(nextPath, { state: { payment_type: paymentType } })
    }

    // const totalWithdraw = withdraw.reduce((sum,dep)=>{
    //     return sum+Number()
    // })


    return (
        <div>
            <DashboardNavebar />
            <div className='bg-gradient-to-r from-[#66CCFF] to-[#0048FF] h-72 relative'>
                <h3 className='font-black text-4xl text-center py-10'>WITHDRAWAL</h3>

                <div className='bg-white shadow-xl  w-40 h-56 p-2 text-center flex flex-col justify-center gap-5 rounded-xl absolute md:top-50 left-60 md:w-96 md:h-44 md:gap-2'>
                    <h3 className='text-xl'>Available Balance</h3>
                    <h4 className='font-bold md:text-5xl'>$ {Number(balance || 0).toFixed(2)}</h4>
                    <h3 className='text-xl'>USD</h3>
                </div>

                <div className='bg-[#FFF7DE] shadow-xl w-40 h-56 p-5 flex flex-col gap-2 justify-center rounded-xl absolute md:top-50 right-50 md:w-96 md:h-44'>
                    <h4 className='text-[#A40000] font-bold md:text-xl'>Minimum Withdrawal Amount: ${adminRate.minimum_withdrawal}</h4>
                    <p className='font-medium'>Transaction will process within 24 hours for all working days.</p>
                </div>

            </div>

            {/* Withdraw */}

            <div className='mt-36 mx-10'>
                <h2 className='font-bold text-2xl md:mx-20'>Select Withdrawal Method:</h2>

                <div className=' grid grid-cols-1 gap-3 items-center mt-10 md:grid-cols-4 md:mx-18'>
                    {/* USDT */}

                    {paymentModes.some(m => m.payment_mode?.toLowerCase() === "usdt") && (
                        <div
                            className='bg-gradient-to-r from-[#0048FF] to-[#66CCFF] p-4 w-full h-40 rounded-xl flex justify-center items-center md:w-60 cursor-pointer'
                            onClick={() => navigate("/withdraw/usdt", { state: { payment_type: "USDT" } })}
                        >
                            <div className='relative flex gap-7 items-center bg-white w-50 p-4 justify-center rounded-xl'>
                                <img src={T} alt="" />
                                <img className='absolute top-10 left-14' src={BNB} alt="" />
                                <h3 className='text-[#5B595E] text-3xl'>USDT</h3>
                            </div>
                        </div>
                    )}

                    {/* UPI */}
                    {paymentModes.some(m => m.payment_mode?.toLowerCase() === "upi") && (
                        <div
                            className='bg-gradient-to-r from-[#0048FF] to-[#66CCFF] p-4 w-full h-40 rounded-xl flex justify-center items-center cursor-pointer md:w-60'
                            onClick={() => handleDeposit("UPI", "/withdraw/upi")}
                        >
                            <div className='flex gap-7 items-center p-4 justify-center rounded-xl'>
                                <img src={upi} alt="" className='w-72 h-30' />
                            </div>
                        </div>
                    )}

                    <div className='bg-gradient-to-r from-[#0048FF] to-[#66CCFF] p-4 w-full h-40 rounded-xl flex justify-center items-center md:w-60' >
                        <div className='flex flex-col gap-3 text-2xl items center  w-50 p-4 justify-center items-center rounded-xl'>
                            <img src={Payment} alt="" />
                            <h3 className='text-white'>Cash On Hand</h3>
                        </div>
                    </div>

                    {/* Bank Transfer */}
                    {paymentModes.some(m => m.payment_mode?.toLowerCase() === "bank_transfer") && (
                        <div
                            className='bg-gradient-to-r from-[#0048FF] to-[#66CCFF] p-4 w-full h-40 rounded-xl flex justify-center items-center cursor-pointer md:w-60'
                            onClick={() => handleDeposit("Bank Transfer", "/withdraw/bank")}
                        >
                            <div className='flex gap-7 items-center p-4 justify-center rounded-xl'>
                                <img className='rounded-xl' src={bank} alt="" />
                            </div>
                        </div>
                    )}

                </div>

            </div>

            {/* Withdraw History */}

            <div className='mt-10 mx-2 md:mx-20'>
                <div className='flex justify-between md:mx-10'>
                    <h2 className='font-bold text-xl md:text-3xl'>Withdraw History</h2>
                    <div className='flex items-center gap-2'>
                        <h3>Search</h3>
                        <div className='flex gap-2 items-center border border-black w-40 px-2 rounded-md bg-[#D5D5D5]'>
                            <input type="text" className='outline-none w-full' value={search} onChange={(e) => setSearch(e.target.value)} />
                            <CiSearch size={30} />
                        </div>

                    </div>
                </div>

                <div className="border border-[#ACACAC] mt-10 p-2 rounded-xl md:mx-10">

                    {/* Top Controls */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:mx-10">
                        {/* Show Dropdown */}
                        <div className="flex items-center gap-2 border border-[#ACACAC] bg-white rounded-md w-fit px-3 py-2">
                            <h3 className="text-sm md:text-xl font-light">Show</h3>
                            <select className="border border-gray-300 rounded-md px-2 py-1 text-sm md:text-base" value={rows} onChange={(e) => setRows(Number(e.target.value))}>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={30}>30</option>
                            </select>
                        </div>

                        {/* Date Range */}
                        <div className="border border-[#ACACAC] rounded-md w-full md:w-auto">
                            <div className="flex justify-between items-center gap-2 px-3 py-2 bg-white text-sm md:text-base">
                                <p className="truncate">
                                    {format(range[0].startDate, "dd-MM-yyyy")} to{" "}
                                    {format(range[0].endDate, "dd-MM-yyyy")}
                                </p>
                                <img
                                    src={cal}
                                    alt="calendar"
                                    className="w-5 h-5 cursor-pointer"
                                    onClick={() => setShowCalendar(!showCalendar)}
                                />
                            </div>

                            {showCalendar && (
                                <div className="absolute top-[900px] z-50 bg-white shadow-lg rounded-md">
                                    <DateRange
                                        editableDateInputs={true}
                                        onChange={handleSelect}
                                        moveRangeOnFirstSelection={false}
                                        ranges={range}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="border border-[#ACACAC] mt-3 md:mx-10"></div>

                    {/* Table */}
                    {filterWithdrawl.length === 0 ? (
                        <div className="flex flex-col gap-4 items-center justify-center mt-10 mb-10 px-4">
                            <p className="font-bold text-center text-lg md:text-2xl">
                                There is no Withdraw history
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto mt-5">
                            <table className="w-full text-left border-collapse">
                                {/* Desktop Header */}
                                <thead className="hidden sm:table-header-group bg-gray-100 text-gray-800">
                                    <tr className="text-center text-xs md:text-base">
                                        <th className="px-4 py-3">Withdrawal ID</th>
                                        <th className="px-4 py-3">Amount</th>
                                        <th className="px-4 py-3">Date & Time</th>
                                        <th className="px-4 py-3">Method</th>
                                        <th className="px-4 py-3">Status</th>
                                    </tr>
                                </thead>

                                {/* Table Body */}
                                <tbody>
                                    {filterWithdrawl.map((dep, index) => (
                                        <tr
                                            key={dep.withdrawal_id || index}
                                            className="block sm:table-row border sm:border-none rounded-lg sm:rounded-none mb-4 sm:mb-0 bg-white shadow-sm sm:shadow-none"
                                        >
                                            {/* Withdrawal ID */}
                                            <td className="block sm:table-cell px-4 py-2">
                                                <div className="flex justify-between sm:justify-center items-center w-full">
                                                    <span className="font-bold sm:hidden">Withdrawal ID:</span>
                                                    <span>{dep.withdrawal_id}</span>
                                                </div>
                                            </td>

                                            {/* Amount */}
                                            <td className="block sm:table-cell px-4 py-2">
                                                <div className="flex justify-between sm:justify-center items-center w-full">
                                                    <span className="font-bold sm:hidden">Amount:</span>
                                                    <span>${parseFloat(dep.requested_amount_usd || 0).toFixed(2)}</span>
                                                </div>
                                            </td>

                                            {/* Date */}
                                            <td className="block sm:table-cell px-4 py-2">
                                                <div className="flex justify-between sm:justify-center items-center w-full">
                                                    <span className="font-bold sm:hidden">Date:</span>
                                                    <span>{formData(dep.withdrawal_request_at)}</span>
                                                </div>
                                            </td>

                                            {/* Method */}
                                            <td className="block sm:table-cell px-4 py-2">
                                                <div className="flex justify-between sm:justify-center items-center w-full">
                                                    <span className="font-bold sm:hidden">Method:</span>
                                                    <span>{dep.payment_method}</span>
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="block sm:table-cell px-4 py-2">
                                                <div className="flex justify-between sm:justify-center items-center w-full">
                                                    <span className="font-bold sm:hidden">Status:</span>
                                                    <button
                                                        className={`px-3 py-1 rounded-md sm:w-auto text-white text-sm ${dep.withdrawal_status?.toLowerCase() === "completed"
                                                        ? "bg-[#20C997]"
                                                        : dep.withdrawal_status?.toLowerCase() === "cancelled"
                                                            ? "bg-[#DC3545]"
                                                            : "bg-[#717171]"
                                                        }`}
                                                >
                                                    {dep.withdrawal_status || "Pending"}
                                                </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>

        </div>
    )
}

export default Withdrawpage
