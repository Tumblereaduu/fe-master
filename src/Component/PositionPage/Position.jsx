import React, { useEffect, useState } from 'react'
import { IoSearch } from "react-icons/io5";
import dwnimg from "../../assets/img/dollar/download.svg"
import Logo from "../../assets/img/logo/Doin FX.svg";
import { Link, useNavigate } from "react-router-dom";
import { User, Menu, X ,ArrowLeft } from "lucide-react";
import axios from '../../services/api';
import { useAuth } from '../context/AuthContext';
import "jspdf-autotable";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BACKEND_API_URL } from '../../api/config';
import DoinDashboardSidebar from '../DoinDashboardSidebar';
import NavbarForAccount from '../NavbarForAccount';
import "react-toastify/dist/ReactToastify.css"
import { ToastContainer, Slide, toast } from "react-toastify";
import { formatUTC } from '../../api/trade/date';


const icons = import.meta.glob("../../assets/img/currencypairicon/*.svg", {
  eager: true,
});

const PairIcons = Object.fromEntries(
  Object.entries(icons).map(([path, mod]) => {
    const fileName = path.split("/").pop().replace(".svg", "").toUpperCase();
    return [fileName, mod.default];
  })
);

const PositionHistory = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const { user, token } = useAuth();
  const user_id = user?.user_id;
  const [accountType, setAccountType] = useState(()=> {return localStorage.getItem("accountType") || "LIVE"});
  
  // const [currentView, setCurrentView] = useState("orders");
  const [isMobileView] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const Position =({

  });
const [selectedTrade, setSelectedTrade] = useState(null);
const [showPopup, setShowPopup] = useState(false);

const openPopup = (trade) => {
  setSelectedTrade(trade);
  setShowPopup(true);
};

const closePopup = () => {
  setShowPopup(false);
  setSelectedTrade(null);
};

  const [position, setPosition] = useState([]);

  useEffect(() => {
    const fetchPositions = async () => {
      try {

      const baseUrl =
      accountType === "LIVE"
        ? `${BACKEND_API_URL}/order?user_id=${user_id}&status=completed_cancelled`
        : `${BACKEND_API_URL}/demo/order?user_id=${user_id}&status=completed_cancelled`;

        const res = await axios.get(
          `${baseUrl}`, {
          headers: {
            Authorization: `Bearer${token}`
          }
        }
        );

        // console.log(" API Response:", res.data);

      if (Array.isArray(res.data.data)) {
        setPosition(res.data.data);
      } else if (Array.isArray(res.data)) {
        setPosition(res.data);
      } else {
        console.warn("Unexpected API format:", res.data);
        setPosition([]);
      }

    } catch (err) {
      console.error("Failed to load closed trades:", err);
    }
  };

  fetchPositions();
}, []);
const [limit, setLimit] = useState(10); 

  // Utility to determine PNL color
  const getPnlColor = (pnl) => {
    if (!pnl || pnl === '-') return "#085f42";
    if (pnl.startsWith('-')) return "#EF4444";
    if (pnl.startsWith('+')) return "#10B981";
    return "#2fa078";
  };

const downloadPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Position History", 14, 22);

  const columns = ["Position ID","Symbol","Order","Lot","Type","Open Price","Close Price","Take Profit","Stop Loss","Open Time","Close Time","Swap","PNL"];

  const rows = position.map((trade) => [trade.trade_id,trade.symbol,trade.type,Number(trade.lot_size).toString(),trade.order_type === "advanced" ? "pending" : trade.order_type,trade.entry_price,trade.exit_price,trade.take_profit|| `${Number(trade.tp_pnl).toString()} USD` || "-",trade.stop_loss || `${Number(trade.sl_pnl).toString()} USD` || "-",
    formatUTC(trade.entry_time),formatUTC(trade.exit_time),trade.swap,trade.pnl,]);

  autoTable(doc, {head: [columns], body: rows,startY: 30, theme: "grid",headStyles: { fillColor: [41, 128, 185], textColor: 255 },styles: { fontSize: 8 },});

  doc.save(`${user_id}_PositionHistory.pdf`);
};

  return (
    <div className="min-h-screen bg-white">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} pauseOnFocusLoss draggable transition={Slide} theme="dark" />
      <DoinDashboardSidebar/>
      {/* Desktop Navbar - Hidden on mobile */}
      {/* <nav className="hidden md:flex w-full bg-white shadow items-center justify-between px-6 py-3.5 border-b-3 border-orange-300">
        <div className="flex items-center space-x-2">
          <Link to="/dashboard">
          <img src={Logo} alt="Logo" className="h-9" />
          </Link>
          <span
            className={`px-3 py-1 text-sm mt-1 font-semibold rounded-full 
              ${accountType === "LIVE" ? 
                "bg-green-100 text-green-700" : 
                "bg-red-100 text-red-700"}`}
          >
            {accountType}
          </span>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex space-x-6 font-medium text-gray-700">
            <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>
            <Link to="/trading" className="hover:text-blue-600">Trading</Link>
            <Link to="/position" className="hover:text-blue-600 text-blue-600 font-semibold">Positions</Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/profile"
              className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center cursor-pointer"
            >
              <User className="h-5 w-5 text-blue-600" />
            </Link>
          </div>
        </div>
      </nav> */}
      <NavbarForAccount />

      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b-2 border-orange-300 ">
        {/* Top Bar with Logo and Menu */}
        <div className="flex justify-between items-center px-4 py-3">
          <div className="flex items-center space-x-2">
            <img src={Logo} alt="Logo" className="h-8" />
            <span
              className={`px-3 py-1 text-sm mt-2 font-semibold rounded-full 
                ${accountType === "LIVE" ? 
                  "bg-green-100 text-green-700" : 
                  "bg-red-100 text-red-700"}`}
            >
              {accountType}
            </span>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md w-full absolute top-14 left-0 z-50 p-4 space-y-4">
          <Link
            to="/dashboard"
            className="block py-2 px-4 rounded hover:bg-blue-100"
            onClick={() => setMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/trading"
            className="block py-2 px-4 rounded hover:bg-blue-100"
            onClick={() => setMobileMenuOpen(false)}
          >
            Trading
          </Link>
          <Link
            to="/position"
            className="block py-2 px-4 rounded hover:bg-blue-100"
            onClick={() => setMobileMenuOpen(false)}
          >
            Position
          </Link>
          <div className="flex items-center space-x-4 mt-2">
            <Link
              to="/profile"
              className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center cursor-pointer"
            >
              <User className="h-5 w-5 text-blue-600" />
            </Link>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className='md:ml-60 lg:ml-64 md:mt-4 flex flex-col gap-5 pb-20'>
        {/* Header with Back Icon and Clickable Title */}
        <div className='flex justify-between items-center'>
          <div className=" flex items-center gap-3">
            {/* Back Icon - Only on Mobile */}
            {isMobileView && (
              <button
                onClick={() => navigate(-1)} // Go back to previous page
                className="text-gray-900 hover:text-gray-800"
              >
                <ArrowLeft className='mt-0.5' />
              </button>
            )}

            {/* Clickable Order History Title */}
            <h3
              className='text-2xl font-medium text-gray-800 cursor-pointer hover:text-gray-600 transition-colors p-5 md:mt-20'
              onClick={() => {
                if (isMobileView) {
                  navigate('/trading'); // Redirect to trading page on mobile
                }
              }}
            >
              Position History
            </h3>
          </div>

        </div>

        {/* Rest of your content remains the same */}
        <div className='flex flex-col md:flex-row md:justify-between gap-2 p-3'>
          <div className='flex gap-2 flex-col md:flex-row'>
            {/* Show select option only on desktop */}
            <div className='hidden md:flex border border-gray-300 gap-1 items-center px-3 py-2 text-sm rounded-lg'>
              <h3 className="text-gray-600">Show</h3>
              <select
                className='outline-none bg-transparent'
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="all">All</option>
              </select>
            </div>

            {/* Search Bar - Full width on mobile */}
            <div className='flex items-center border border-gray-300 px-3 py-2 gap-2 rounded-lg w-full'>
              <IoSearch className="text-gray-500" />
              <input
                type="text"
                className='outline-none w-full text-sm bg-transparent'
                placeholder='Search'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Download Button */}
            {accountType !== "DEMO" && (
            <button className='flex items-center justify-center gap-2 bg-gray-300 px-4 py-2 w-full md:w-max rounded-lg hover:bg-gray-3
            00 transition' onClick={downloadPDF}>
            <img src={dwnimg} alt="Download" className='w-5 h-5' />
            <p className='text-xs lg:text-sm font-bold '>Download CSV</p>
          </button>
          )}
        </div>
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-t border-b border-gray-400 text-gray-700">
                {/* <th className="px- py-3 text-center text-md font-bold">Position ID</th> */}
                <th className="px- py-3 text-center text-md font-bold">Symbol</th>
                <th className="px- py-3 text-center text-md font-bold">Order</th>
                <th className="px- py-3 text-center text-md font-bold">Lot</th>
                {/* <th className="px- py-3 text-center text-md font-bold">Type</th> */}
                <th className="px- py-3 text-center text-md font-bold">Open Price</th>
                <th className="px- py-3 text-center text-md font-bold">Close Price</th>
                {/* <th className="px- py-3 text-center text-sm font-bold">Take Profit</th>
                <th className="px- py-3 text-center text-sm font-bold">Stop Loss</th> */}
                <th className="px- py-3 text-center text-md font-bold">Open Time, UTC</th>
                <th className="px- py-3 text-center text-md font-bold">Close Time, UTC</th>
                <th className="px- py-3 text-center text-md font-bold">Commission</th>
                <th className="px- py-3 text-center text-md font-bold">Swap</th>
                <th className="px- py-3 text-center text-md font-bold">PNL</th>
                <th className="px-6 py-3 text-center text-md font-bold">Details</th>
              </tr>
            </thead>
            <tbody>
              {position
                .filter((trade) =>
                  search === "" ||
                  trade.symbol?.toLowerCase().includes(search.toLowerCase()) ||
                  trade.trade_id?.toString().includes(search) ||
                  trade.type?.toLowerCase().includes(search.toLowerCase()) ||
                  formatUTC(trade.entry_time).includes(search) ||
                  formatUTC(trade.exit_time).includes(search)
                )
                .slice(0, limit === "all" ? position.length : Number(limit))
                .map((trade) => {
                  const cleanSymbol = trade.symbol
                    ?.replace("OANDA:", "")
                    ?.replace("/", "")
                    ?.trim();

                  return (
                    <React.Fragment key={trade.trade_id}>
                      {/* main row */}
                      <tr className="border-b border-gray-200 hover:bg-gray-100 transition">
                        {/* <td className="px-4 py-3 text-center text-sm">{trade.trade_id}</td> */}
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <img src={PairIcons[cleanSymbol]} alt={trade.symbol} className="w-6 h-6" />
                            <span>{trade.symbol}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 ">
                          <div className="flex justify-center gap-2">
                            {trade.type === 'BUY' ? (
                              <span className="text-green-600 text-md">▲ BUY</span>
                            ) : (
                              <span className="text-red-600 text-md">▼ SELL</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center text-md">{Number(trade.lot_size).toString()}</td>
                        {/* <td className="px-4 py-3 text-center text-md">{trade.order_type}</td> */}
                        <td className="px-4 py-3 text-center text-md">
                          {trade.symbol?.includes("XAU/USD")
                            ? Number(trade.entry_price).toString()
                            : Number(trade.entry_price).toString()}
                        </td>
                        <td className="px-4 py-3 text-center text-md">
                          {trade.symbol?.includes("XAU/USD")
                            ? Number(trade.exit_price).toString()
                            : Number(trade.exit_price).toString()}
                        </td>
                        <td className='text-center'>{formatUTC(trade.entry_time)}</td>
                        <td className='text-center'>{formatUTC(trade.exit_time)}</td>
                        <td className="px-4 py-3 text-center text-md">{trade.commission}</td>
                        <td className="px-4 py-3 text-center text-md">{trade.swap}</td>
                        <td
                          className="px-4 py-3 text-center text-md font-semibold"
                          style={{ color: getPnlColor(trade.pnl) }}
                        >
                          {trade.pnl}
                        </td>
                        <td 
                          className="text-center cursor-pointer"
                          onClick={() => openPopup(trade)}
                        >
                          <p className='underline text-sm text-blue-400 hover:text-blue-300'>View</p>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
            </tbody>
          </table>
        </div>    

        {showPopup && selectedTrade && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            
            <div className="bg-white w-[500px] rounded-lg shadow-xl relative">

              {/* Close Button */}
              <button
                onClick={closePopup}
                className="absolute top-3 right-3 text-gray-600 hover:text-black text-lg"
              >
                ✕
              </button>

              {/* Header */}
              <h2 className="text-2xl font-semibold mb-4 mt-5 text-center ">
                Position Details
              </h2>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-md p-8 border-t-2 border-gray-300">

                <p className="font-semibold">Position ID:</p>
                <p>{selectedTrade.trade_id}</p>


                <p className="font-semibold">Symbol:</p>
                <p>{selectedTrade.symbol}</p>

                 <p className="font-semibold">Lot:</p>
                <p>{Number(selectedTrade.lot_size).toString()}</p>

                <p className="font-semibold">Order:</p>
                <p>{selectedTrade.type}</p>

                <p className="font-semibold">Type:</p>
                <p>{selectedTrade.order_type === "advanced" ? "pending" : selectedTrade.order_type}</p>

                <p className="font-semibold">Open Price:</p>
                <p>{selectedTrade.symbol?.includes("XAU/USD")
                ? Number(selectedTrade.entry_price).toString()
                : Number(selectedTrade.entry_price).toString()}</p>

                <p className="font-semibold">Close Price:</p>
                <p>{selectedTrade.symbol?.includes("XAU/USD")
                ? Number(selectedTrade.exit_price).toString()
                : Number(selectedTrade.exit_price).toString()}</p>
                <p className="font-semibold">Commission:</p>
                <p>{selectedTrade.commission || "_"}</p>
                <p className="font-semibold">Swap:</p>
                <p>{selectedTrade.swap}</p>

                <p className="font-semibold">Take Profit:</p>
                <p>{selectedTrade.take_profit ||`${Number(selectedTrade.tp_pnl).toString()} USD` || "_"}</p>

                <p className="font-semibold">Stop Loss:</p>
                <p>{selectedTrade.stop_loss || `${Number(selectedTrade.sl_pnl).toString()} USD` || "_"}</p>

                <p className="font-semibold">Open Time(UTC):</p>
                <p>{formatUTC(selectedTrade.entry_time)}</p>

                <p className="font-semibold">Close Time(UTC):</p>
                <p>{formatUTC(selectedTrade.exit_time)}</p>

                <p className="font-semibold">PNL:</p>
                <p className={selectedTrade.pnl >= 0 ? "text-green-600" : "text-red-600"}>
                  {selectedTrade.pnl}
                </p>

              </div>
            </div>
          </div>
        )}

        {/* Mobile Card View */}
        {/* Mobile Card View */}
        <div className="md:hidden flex flex-col gap-3 p-3">
          {position
          .filter((trade) =>
                  search === "" ||
                  trade.symbol?.toLowerCase().includes(search.toLowerCase()) ||
                  trade.trade_id?.toString().includes(search) ||
                  trade.type?.toLowerCase().includes(search.toLowerCase())||
                  formatUTC(trade.entry_time).includes(search)||
                  formatUTC(trade.exit_time).includes(search)
                )
          .map((trade) => (
            <div key={trade} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              {/* Clickable Card Header */}
              <button
                onClick={() =>
                  setExpandedIndex(expandedIndex === trade ? null : trade)
                }
                className="w-full flex justify-between items-center px-4 py-3"
              >
                {/* Left: Icon + Symbol */}
                <div className="flex items-center gap-3">
                  {/* <PairIcon symbol={row.symbol} /> */}
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 text-base">
                      {trade.symbol}
                    </span>
                    <span
                      className={`text-sm font-medium ${trade.type === "BUY"
                          ? "text-green-600"
                          : "text-red-600"
                        }`}
                    >
                      {trade.type === "BUY" ? "▲ BUY" : "▼ SELL"}{" "}
                      {Number(trade.lot_size).toString()}
                    </span>
                  </div>
                </div>

                {/* Right: PNL + Date */}
                <div className="flex flex-col items-end">
                  <span
                    className={`font-semibold text-base ${trade.pnl && trade.pnl !== "-"
                        ? trade.pnl.startsWith("-")
                          ? "text-red-600"
                          : "text-green-600"
                        : "text-gray-500"
                      }`}
                  >
                    {trade.pnl || "-"}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    {formatUTC(trade.exit_time)}
                  </span>
                </div>
              </button>

              {/* Expanded Details */}
              {expandedIndex === trade && (
                <div className="px-4 pb-3 border-t border-gray-100 animate-fadeIn">
                  <div className="text-xs text-gray-500 text-center mt-2 mb-1">
                    Order ID:{" "}
                    <span className="font-semibold text-gray-800">
                      {trade.trade_id}
                    </span>
                  </div>

                  <div className="mt-2 text-sm text-gray-700 flex flex-col gap-1">
                    <div className="flex justify-between">
                      <span>Open Time</span>
                      <span className="text-gray-900">{formatUTC(trade.entry_time)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Close Time</span>
                      <span className="text-gray-900">{formatUTC(trade.exit_time)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Swap</span>
                      <span>{trade.swap} USD</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Commission</span>
                      <span>{trade.commission}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Open Price</span>
                      <span>{Number(trade.entry_price).toString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Close Price</span>
                      <span>{Number(trade.exit_price).toString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Stop Loss</span>
                      <span>{trade.stop_loss|| `${Number(trade.sl_pnl).toString()} USD` ||'-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Take Profit</span>
                      <span>{trade.take_profit|| `${Number(trade.tp_pnl).toString()} USD`||"-"}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
      {/* Mobile Bottom Navigation */}
      {/* {isMobileView && (
        <div className='fixed bottom-0 left-0 right-0 z-50'>
          <MobileBottomNav 
            currentView={currentView} 
            setCurrentView={setCurrentView}
          />
        </div>
      )} */}
    </div>
  )
}

export default PositionHistory;
