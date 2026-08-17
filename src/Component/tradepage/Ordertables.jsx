import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import MobileBottomNav from "./MobileBottomNav";
import { IoSearch } from "react-icons/io5";
import { ArrowLeft, ChevronDown, User } from "lucide-react";
import { MdArrowRight } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import axios from "../../services/api";
import PopupTab from "./Popuptab";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_API_URL } from "../../api/config";
import { formatUTC } from "../../api/trade/date";
import { useLivePrice } from "../hooks/tradePage/useLivePriceContext";
import { symbol } from "framer-motion/client";
import { useTheme } from "../../context/ThemeContext";

const currencyIcons = import.meta.glob("../../assets/img/currencypairicon/*.svg", {
  eager: true
});

const PairIcons = Object.fromEntries(
  Object.entries(currencyIcons).map(([path, module]) => {
    const fileName = path.split("/").pop().replace(".svg", "");
    return [fileName.toUpperCase(), module.default];
  })
);
const OrderTables = ({
  tradeTab,
  setTradeTab,
  openTrades,
  pendingTrades,
  closedTrades,
  setSelectedTrade,
  setShowModify,
  handleCloseTrade,
  handleClosePendingOrder,
  handleCancelOrder,
  currentView,
  setCurrentView,
  isMobileView,
  balance,
  openMobileItem,
  // setOpenMobileItem,
  // handleSelectInstrument,
  setSelectedSymbol,
  // favorites,
}) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [priceValues, setPriceValues] = useState({ triggerPrice: 0, takeProfit: 0, stopLoss: 0, });
  const {livePrices, allPairs} = useLivePrice();
  const { isDark } = useTheme();

  // Dark token shortcuts (used by the moved account UI)
  const dk = {
    label: "text-[#8899A6]",
    sliderTrack: "from-red-700 via-yellow-500 to-green-600",
    sliderDot: "bg-white border-[#2A3640]",
  };

  // Initialize price values when order is selected
  useEffect(() => {
    if (selectedOrder) {
      setPriceValues({
        triggerPrice: parseFloat(selectedOrder.openPrice) || 0,
        takeProfit: parseFloat(selectedOrder.takeProfit) || 0,
        stopLoss: parseFloat(selectedOrder.stopLoss) || 0,
      });
    }
  }, [selectedOrder]);

     const handleSelectInstrument = (symbolCode) => {
    setSelectedSymbol(symbolCode);
    if (isMobileView) {
      setCurrentView("chart");
    }
  };

  // Mobile Order Detail View
  const OrderDetailView = ({ order, type }) => { const cleanSymbol = order.symbol ?.replace("OANDA:", "") ?.replace("/", "") ?.trim();
  const currentPrice = livePrices?.[cleanSymbol] ?? null;
  const isItemOpen = openMobileItem === order.symbol;
  const ALWAYS_OPEN = ["BTCUSDT","BTCUSD","ETHUSD"]
const GMC_PAIRS = ['XAGUSD', 'XPDUSD', 'XPTUSD', 'DXY', 'USOIL', 'UKOIL']
  const BinanceSymbol = order.symbol.split(":").pop().replace("/", "") ;
  let prefix = 'ONA';
    if(ALWAYS_OPEN.includes(BinanceSymbol)){
     prefix = 'CRYPTO'
    }
    else if(GMC_PAIRS.includes(BinanceSymbol)){
     prefix = 'GMC'
    }
   const symbolCode = `${prefix}:${cleanSymbol}`;
  
      return (
      <div className={`fixed inset-0 z-50 p-3 overflow-y-auto md:hidden mt-16 ${isDark ? "bg-[#141D22]" : "bg-white"}`}>
        {/* Header */}
        {/* <div className="bg-white ">
          <div className=" ">
            <div className="flex justify-between">
              <p className="font-bold text-black text-xl">${(freeMargin)}</p>
               <p className="text-sm text-black bg-green-200 p-1 rounded-xl w-15 text-center">
                Real
              </p> 
            </div>
          </div>
        </div> */}

        <div className="flex justify-between items-center mt-2">
          <button
            onClick={() => setSelectedOrder(null)}
            className={`flex text-xl font-bold ${isDark ? "text-white" : "text-black"}`}
          >
            <ArrowLeft className="mt-0.5" />Position Info
          </button>
        </div>

        {/* Order Info */}
        <div className={`rounded-lg p-3 mb-2 mt-6 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img
              src={PairIcons[cleanSymbol]}
              alt={order.symbol}
              className="w-8 h-8"
              />
              <span className={`font-semibold ${isDark ? "text-white" : "text-black"}`}>{order.symbol}</span>
            </div>
            <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              {type === "open" && (
                <div className="flex items-center gap-1">
                  <span>Current price</span>
                  <span>
                    <MdArrowRight className="text-base" />
                  </span>
                  <span className={`font-semibold ${isDark ? "text-white" : "text-black"}`}>
                    { currentPrice || "-"}
                  </span>
                </div>
              )}
              {type === "pending" && formatUTC(order.entry_time) && (
                <div className="flex items-center gap-1">
                  <span>Limit Price</span>
                  <span>
                    <MdArrowRight className="text-base" />
                  </span>
                  <span className={`font-semibold ${isDark ? "text-white" : "text-black"}`}>{order.entry_price}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Tab */}
        {!editMode && (
          <div className="space-y-4 p-3">
            {/* Table-like layout for order info */}
            <div className="rounded-lg overflow-hidden">
              {/* Info Rows */}
              <div className="p-1">
                {/* Open Trades Layout (1st screenshot) */}
                {type === "open" && (
                  <>

                   <div className="flex justify-between items-center py-1 ">
                      <div className={isDark ? "text-gray-300" : "text-black"}>Open price</div>
                      <div className={isDark ? "text-white" : "text-black"}>
                        {(Number(order.entry_price || 0).toFixed(order.symbol === "XAUUSD" ? 3 : 5))}
                      </div>
                    </div>

                    {/* Open Time */}
                    <div className="flex justify-between items-center py-1 ">
                      <div className={isDark ? "text-gray-300" : "text-black"}>Open time</div>
                      <div className={isDark ? "text-white" : "text-black"}>
                        {formatUTC(order.entry_time)}
                      </div>
                    </div>

                    {/* PNL */}
                    <div className="flex justify-between items-center py-1 ">
                      <div className={isDark ? "text-gray-300" : "text-black"}>PNL</div>
                      <div
                        className={`font-semibold ${
                              calculatePnL(order, livePrices) >= 0
                                ? "text-green-600"
                                : "text-red-600"
                        }`}
                      >
                            {calculatePnL(order, livePrices) >= 0
                              ? `+${calculatePnL(order, livePrices).toFixed(2)}`
                              : calculatePnL(order, livePrices).toFixed(2)}
                      </div>
                    </div>

                    {/* Order */}
                    <div className="flex justify-between items-center py-1 ">
                      <div className={isDark ? "text-gray-300" : "text-black"}>Order</div>
                      <div className={`${isDark ? "text-white" : "text-black"} flex items-center gap-1`}>
                        <span>{order.type}</span>
                      </div>
                    </div>

                    {/* Lot Size */}
                    <div className="flex justify-between items-center py-1 ">
                      <div className={isDark ? "text-gray-300" : "text-black"}>Lot Size</div>
                      <div className={isDark ? "text-white" : "text-black"}>{Number(order.lot_size).toString()}</div>
                    </div>

                    {/* Swap Fee */}
                    <div className="flex justify-between items-center py-1 0">
                      <div className={isDark ? "text-gray-300" : "text-black"}>Swap Fee</div>
                      <div className={isDark ? "text-white" : "text-black"}>
                        {order.swap || "0.00"} USD
                      </div>
                    </div>

                    {/* Position ID */}
                    <div className="flex justify-between items-center py-1">
                      <div className={isDark ? "text-gray-300" : "text-black"}>Position ID</div>
                      <div className={isDark ? "text-white" : "text-black"}>{order.trade_id}</div>
                    </div>
                    
                    {/* Take profit */}
                    <div className="flex justify-between items-center py-1">
                      <div className={isDark ? "text-gray-300" : "text-black"}>Take Profit</div>
                    <div
                      className={`cursor-pointer hover:opacity-80 ${isDark ? "bg-gray-700 text-white px-3 py-1 rounded" : "text-blue-600 underline"}`}
                      onClick={() => {
                        setSelectedTrade(order);  // store order details in state
                        setShowModify(true);      // open modify popup/modal
                      }}
                    >
                        {(order.take_profit === null || order.take_profit === 0) && 
                          (order.tp_pnl === null || order.tp_pnl === 0)
                            ? "Add"
                            : order.tp_pnl !== null && order.tp_pnl !== 0
                              ? `${Number(order.tp_pnl).toFixed(2)} USD`
                              : Number(order.take_profit).toFixed(cleanSymbol === "XAUUSD" ? 3 : 5)
                          }
                    </div>

                    </div>

                    {/* stop loss */}
                    <div className="flex justify-between items-center py-1">
                      <div className={isDark ? "text-gray-300" : "text-black"}>Stop Loss</div>
                      <div
                        className={`cursor-pointer hover:opacity-80 ${isDark ? "bg-gray-700 text-white px-3 py-1 rounded" : "text-blue-600 underline"}`}
                        onClick={() => {
                          setSelectedTrade(order);  // store order details in state
                          setShowModify(true);      // open modify popup/modal
                        }}
                      >
                          {(order.stop_loss === null || order.stop_loss === 0) && 
                            (order.sl_pnl === null || order.sl_pnl === 0)
                              ? "Add"
                              : order.sl_pnl !== null && order.sl_pnl !== 0
                                ? `${Number(order.sl_pnl).toFixed(2)} USD`
                                : Number(order.stop_loss).toFixed(cleanSymbol === "XAUUSD" ? 3 : 5)
                            }
                      </div>
                    </div>
                  </>
                )}

                {/* Pending Trades Layout (2nd screenshot) */}
                {type === "pending" && (
                  <>
                    {/* Created Time - Header style */}
                    <div className="flex justify-between items-center py-1 ">
                      <div className={isDark ? "text-gray-300" : "text-black"}>
                        Created Time
                      </div>
                      <div className={isDark ? "text-gray-400" : ""}>{formatUTC(order.entry_time)}</div>
                    </div>

                    {/* Position ID */}
                    <div className="flex justify-between items-center py-1 ">
                      <div className={isDark ? "text-gray-300" : "text-black"}>Position ID</div>
                      <div className={isDark ? "text-gray-400" : ""}>{order.trade_id}</div>
                    </div>

                    {/* Limit Price */}
                    <div className="flex justify-between items-center py-1 ">
                      <div className={isDark ? "text-gray-300" : "text-black"}>Limit Price</div>
                      <div className={isDark ? "text-gray-400" : ""}>{order.entry_price}</div>
                    </div>

                    {/* Order */}
                    <div className="flex justify-between items-center py-1 ">
                      <div className={isDark ? "text-gray-300" : "text-black"}>Order</div>
                      <div className={`flex items-center gap-1 ${isDark ? "text-white" : ""}`}>
                        <span>{order.type}</span>
                      </div>
                    </div>

                    {/* Lot Size */}
                    <div className="flex justify-between items-center py-1">
                      <div className={isDark ? "text-gray-300" : "text-black"}>Lot Size</div>
                      <div className={isDark ? "text-gray-400" : ""}>{Number(order.lot_size).toString()}</div>
                    </div>
                                        
                    {/* Take profit */}
                    <div className="flex justify-between items-center py-1">
                      <div className={isDark ? "text-gray-300" : "text-black"}>Take Profit</div>
                    <div
                      className={`cursor-pointer hover:opacity-80 ${isDark ? "bg-[#3a3a5c] text-white px-3 py-1 rounded" : "text-blue-600 underline"}`}
                      onClick={() => {
                        setSelectedTrade(order);
                        setShowModify(true);
                      }}
                    >
                      {(order.take_profit === null || order.take_profit === 0) && 
                        (order.tp_pnl === null || order.tp_pnl === 0)
                          ? "Add"
                          : order.tp_pnl !== null && order.tp_pnl !== 0
                            ? `${Number(order.tp_pnl).toFixed(2)} USD`
                            : Number(order.take_profit).toFixed(cleanSymbol === "XAUUSD" ? 3 : 5)
                        }
                    </div>

                    </div>

                    {/* stop loss */}
                    <div className="flex justify-between items-center py-1">
                      <div className={isDark ? "text-gray-300" : "text-black"}>Stop Loss</div>
                      <div
                        className={`cursor-pointer hover:opacity-80 ${isDark ? "bg-[#3a3a5c] text-white px-3 py-1 rounded" : "text-blue-600 underline"}`}
                        onClick={() => {
                          setSelectedTrade(order);  
                          setShowModify(true);      
                        }}
                      >
                          {(order.stop_loss === null || order.stop_loss === 0) && 
                           (order.sl_pnl === null || order.sl_pnl === 0)
                            ? "Add"
                            : order.sl_pnl !== null && order.sl_pnl !== 0
                              ? `${Number(order.sl_pnl).toFixed(2)} USD`
                              : Number(order.stop_loss).toFixed(cleanSymbol === "XAUUSD" ? 3 : 5)
                          }
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Close Order Button - Only for open trades */}
            {type === "open" && (
              <div className="mt-4 flex gap-3">
                <button 
                onClick={(e) =>{
                  e.stopPropagation();
                 handleSelectInstrument(symbolCode);
                }}
                className={`w-full py-3 rounded-lg font-semibold transition-colors duration-200 ${isDark ? "bg-gray-700 text-white hover:bg-[#4a4a6c]" : "bg-gray-300 hover:bg-gray-400 text-black"}`}
                >
                  View Chart
                </button>
                <button
                  onClick={(e) => {
                    setSelectedOrder(null);                
                    e.stopPropagation();
                    handleCloseTrade(order.trade_id, order.user_id);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  Close Position
                </button>
              </div>
            )}

            {type === "pending" && (
              <div className="mt-4">
                <button
                  onClick={() => {
                    handleClosePendingOrder(order.trade_id, order.user_id);
                    setSelectedOrder(null);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  Cancel Position
                </button>
              </div>
            )}
          </div>
        )}

        {/* Edit Tab */}
        {editMode &&  (
          <div className="space-y-6">
            {/* {type === "pending" && (
            </div> */}
          </div>
        )}
      </div>
    );
  };
  // const [balance, setBalance] = useState(0);
  const [equity, setEquity] = useState(0);
  const [usedMargin, setUsedMargin] = useState(0);
  const [freeMargin, setFreeMargin] = useState(0);
  const [marginLevel, setMarginLevel] = useState(0);
  const [totalPL, setTotalPL] = useState(0);
  // const setStoreFreeMargin = useMarginStore((s) => s.setFreeMargin);
   const [accountLevel, setAccountLevel] = useState(0);
  
  useEffect(() => {
  const summaryData = {  freeMargin };
  window.dispatchEvent(new CustomEvent("marginUpdate", { detail: summaryData }));
}, [freeMargin]);

  useEffect(() => {
    localStorage.setItem("FreeMargin", freeMargin );
    // console.log("FreeMargin stored:", freeMargin);
  }, [freeMargin])
  

 const AccountSummary = ({ openTrades = [] }) => {

  const { user, token } = useAuth();

useEffect(() => {
  let runningPL = 0;
  let marginUsed = 0;

  openTrades?.forEach((trade) => {
  const pnlValue = Number(calculatePnL(trade, livePrices) >= 0
    ? `+${calculatePnL(trade, livePrices).toFixed(2)}`
    : calculatePnL(trade, livePrices).toFixed(2)) || 0; // ensure numeric
  runningPL += pnlValue;     
    marginUsed += Number((trade.used_margin || "0").toString().replace(/[^0-9.-]/g, "")) || 0;
  });

  const equityCalc = (balance ?? 0) + runningPL;
  const freeMarginCalc = equityCalc - marginUsed;
  const marginLevelCalc = marginUsed > 0 ? (equityCalc / marginUsed) * 100 : 0;

    // ACCOUNT LEVEL BASED ON EQUITY & BALANCE
    const accountLevelCalc = balance > 0 ? (equityCalc / balance) * 100 : 0;

setTotalPL(Number(runningPL.toFixed(2)));
setEquity(Number(equityCalc.toFixed(2)));
setUsedMargin(Number(marginUsed.toFixed(2)));
setFreeMargin(Number(freeMarginCalc.toFixed(2)));
setMarginLevel(Number(marginLevelCalc.toFixed(2)));

    setAccountLevel(
    Number(Math.min(100, Math.max(0, accountLevelCalc)).toFixed(2))
    );

  // setStoreFreeMargin(freeMarginCalc);
}, [openTrades, livePrices]);
    return (
      <div className={`hidden md:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 ${isDark ? "bg-[#1a1a2e]" : "bg-white"}`}>
      </div>
    );
  };

const AccountDetailsDropdown = () => {
    //  Load initial state from localStorage
  const [open, setOpen] = useState(() => {
    return JSON.parse(localStorage.getItem("accountDropdownOpen")) ?? true;
  });

  //  Save state on change
  useEffect(() => {
    localStorage.setItem("accountDropdownOpen", JSON.stringify(open));
  }, [open]);

  return (
 <div className={`md:hidden w-full px-4 py-5 drop-shadow-lg rounded-xl ${isDark ? "bg-[#141D22] border-none" : "bg-white border-gray-300"} border`}>

      {/* CARD */}
      <div className={isDark ? "bg-[#141D22]" : "bg-white"}>

        {/* TOP SECTION */}
        <div className="flex items-center justify-between">

          <div className="grid grid-cols-3 gap-3 w-full text-sm">

            {/* Equity */}
            <div className="flex flex-col">
              <span className={isDark ? "text-gray-400 text-xs" : "text-gray-600 text-xs"}>Equity</span>
              <span className={`mt-1 font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>
                {(equity || 0).toFixed(2)} USD
              </span>
            </div>

            {/* Free Margin */}
            <div className="flex flex-col">
              <span className={isDark ? "text-gray-400 text-xs" : "text-gray-600 text-xs"}>Free Margin</span>
              <span className={`mt-1 font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>
                {(freeMargin || 0).toFixed(2)} USD
              </span>
            </div>

            {/* Account Level */}
            <div className="flex flex-col ml-2">
              <span className={isDark ? "text-gray-400 text-xs" : "text-gray-600 text-xs"}>Account level</span>
              <div className="relative  mt-2 h-2 w-20 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500">
                <div
                  className="absolute top-3.5 -translate-y-1/2 w-3 h-5.5 bg-black border-2 border-white rounded-full shadow-md"
                  style={{
                    left: `${accountLevel}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </div>
            </div>

          </div>

          {/* Dropdown Button */}
          <button
            onClick={() => setOpen(!open)}
            className="rounded-full hover:bg-gray-100 transition"
          >
            <ChevronDown
              size={18}
              className={`transition-transform duration-300 ${isDark ? "bg-gray-700" : "bg-gray-200"} rounded-2xl h-8 w-8 p-1.5 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* DROPDOWN */}
        <div
          className={`transition-all duration-300 ease-in-out origin-top ${
            open
              ? "max-h-40 opacity-100 scale-100 mt-3"
              : "max-h-0 opacity-0 scale-95"
          } overflow-hidden`}
        >
          <div className={`grid grid-cols-3 gap-3 text-sm pt-1 ${isDark ? "border-none" : "border-none"} border`}>

            {/* Used Margin */}
            <div className="flex flex-col">
              <span className={isDark ? "text-gray-400 text-xs" : "text-gray-600 text-xs"}>Used Margin</span>
              <span className={`mt-1 font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>
                {(usedMargin || 0).toFixed(2)} USD
              </span>
            </div>

            {/* Margin Level */}
            <div className="-ml-3 flex flex-col">
              <span className={isDark ? "text-gray-400 text-xs" : "text-gray-600 text-xs"}>Margin Level</span>
              <span
                className={`mt-1 font-semibold ${
                  marginLevel > 100 ? "text-green-600" : "text-red-500"
                }`}
              >
                {(marginLevel || 0).toFixed(2)}%
              </span>
            </div>

            {/* Balance */}
            <div className="-ml-3 flex flex-col ">
              <span className={isDark ? "text-gray-400 text-xs" : "text-gray-600 text-xs"}>Balance</span>
              <span className={`mt-1 font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>
                {(balance || 0).toFixed(2)} USD
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

  const [open, setOpen] = useState(false);
  const mobileDropdownRef = useRef(null);
  const desktopDropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const mobileTriggerRef = useRef(null);
  // Close dropdown if clicked outside
  useEffect(() => {
    const handleOutside = (e) => {
      // If clicking desktop trigger → don't close
      if (triggerRef.current?.contains(e.target)) return;

      // If clicking mobile trigger → don't close
      if (mobileTriggerRef.current?.contains(e.target)) return;

      // If clicking inside mobile dropdown → don't close
      if (mobileDropdownRef.current?.contains(e.target)) return;

      // If clicking inside desktop dropdown → don't close
      if (desktopDropdownRef.current?.contains(e.target)) return;

      // Otherwise close
      setOpen(false);
    };

    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, []);

  // const handleSelect = (action) => console.log(action);
  const [search, setSearch] = useState("");
  const [expandedTrade, setExpandedTrade] = useState(null);
  const [marketClosedPopup, setMarketClosedPopup] = useState(false);
  // Add this to your component to calculate total PNL
  const totalPnl = openTrades.reduce((total, trade) => total + trade.pnl, 0);


const { user, token } = useAuth();

  function isForexMarketOpen() {
    const now = new Date();
    const day = now.getUTCDay();
    const hour = now.getUTCHours();
    if (day === 6) return false; // Saturday closed
    if (day === 5 && hour >= 22) return false; // Friday after 22:00 UTC closed
    if (day === 0 && hour < 22) return false; // Sunday before 22:00 UTC closed
    return true;
  }

  const CRYPTO_PAIRS = ["BTC/USD", "BTC/USDT", "ETH/USD"];

  const isCryptoPair = (symbol) => {
    if (!symbol) return false;

    // remove broker prefix (ex: OANDA:BTCUSD, BINANCE:BTCUSDT)
    const cleanSymbol = symbol.split(":").pop().toUpperCase();

    return CRYPTO_PAIRS.includes(cleanSymbol);
  };

  // function getNextSundayDate(){
  //   const today = new Date();

  //   const ist = new Date (today.toLocaleString('en-US', {timeZone: 'Asia/Kolkata'}));
  //   const day = ist.getDay();
  //   const diff = day === 0  ? 0 : 7 - day;

  //   const nextSunday = new Date(ist)
  //   nextSunday.setDate(ist.getDate() + diff);
    
  //   return nextSunday.toLocaleDateString('en-GB');
  // }

// const handleSelect = async (action) => {
//   if (!user || !token) {
//     toast.error("You must be logged in.");
//     return;
//   }

//   try {
//     let endpoint = "";

//     const accountType = localStorage.getItem("accountType"); 

//     const baseUrl =
//       accountType === "LIVE"
//         ? `${BACKEND_API_URL}/order/`
//         : `${BACKEND_API_URL}/demo/order/`;

//     switch (action) {
//       case "close_all":
//         endpoint = `${baseUrl}close/all/positions`;
//         break;
//       case "close_profit":
//         endpoint = `${baseUrl}close/all/profit/positions`;
//         break;
//       case "close_loss":
//         endpoint = `${baseUrl}close/all/loss/positions`;
//         break;
//       case "close_buy":
//         endpoint = `${baseUrl}close/all/buy/positions`;
//         break;
//       case "close_sell":
//         endpoint = `${baseUrl}close/all/sell/positions`;
//         break;
//       default:
//         return;
//     }

//     const res = await axios.post(
//       endpoint,
//       { user_id: user.user_id },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     if (res.data.status === "success") {
//       toast.success(res.data.message || "Positions closed successfully!");
//     } else {
//       toast.warning(res.data.message || "Failed to close Positions");
//     }
//   } catch (err) {
//     console.error("Error closing trades:", err);
//     toast.dismiss();
//     toast.error(err?.response?.data?.message ||"No position available.");
//   }
// };

const handleSelect = async (action) => {
  if (!user || !token) {
    toast.error("You must be logged in.");
    return;
  }

  try {
    const accountType = localStorage.getItem("accountType"); 

    const baseUrl =
      accountType === "LIVE"
        ? `${BACKEND_API_URL}/order/`
        : `${BACKEND_API_URL}/demo/order/`;

    // Map frontend action key to backend close_type value
    const closeTypeMap = {
      close_all: "all",
      close_profit: "profitable",
      close_loss: "losing",
      close_buy: "buy",
      close_sell: "sell"
    };

    const closeType = closeTypeMap[action];
    if (!closeType) return;

    const res = await axios.post(
      `${baseUrl}close/all/positions`,
      { 
        user_id: user.user_id,
        close_source: "website",
        close_type: closeType
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data.status === "success") {
      toast.success(res.data.message || "Positions closed successfully!");
    } else {
      toast.warning(res.data.message || "Failed to close Positions");
    }
  } catch (err) {
    console.error("Error closing trades:", err);
    toast.dismiss();
    toast.error(err?.response?.data?.message ||"No position available.");
  }
};

const calculatePnL = (trade, livePrices) => {
  if (!trade || !livePrices) return 0;

  // Clean symbol
  const cleanSymbol = trade.symbol?.replace("OANDA:", "").replace("/", "").trim().toUpperCase();

  if (!cleanSymbol) return 0;

  // Live price
  const livePrice = livePrices?.[cleanSymbol];
  if (livePrice === undefined) return 0;

  // const livePrice = parseFloat(liveData.price);
  const entryPrice = parseFloat(trade.entry_price);
  const lot = parseFloat(trade.lot_size);
  const type = trade.type?.toUpperCase();

  const B_PAIR = ["US30USD", "BTCUSD","ETHUSD"];

  // Determine contract size
let contractSize = 100000;
    if (cleanSymbol === 'XAUUSD' || cleanSymbol === 'XPDUSD' || cleanSymbol ==='XPTUSD') contractSize = 100;
    if (cleanSymbol === 'XCUUSD') contractSize = 2300;
    if (cleanSymbol === 'XAGUSD') contractSize = 5000;
    if (cleanSymbol === 'DXY' || cleanSymbol ==='USOIL' || cleanSymbol ==='UKOIL') contractSize = 1000;
    if (B_PAIR.includes(cleanSymbol)) contractSize = 1;

  // Basic PnL in QUOTE currency
  const rawPnL =
    type === "BUY"
      ? (livePrice - entryPrice) * lot * contractSize
      : (entryPrice - livePrice) * lot * contractSize;

  // If quote currency is USD → already in USD
  const quote = cleanSymbol.slice(3);  // e.g., AUDCAD → "CAD"

  if (quote === "USD") return rawPnL; 
  const direct = livePrices?.[`${quote}USD`];
  const inverse = livePrices?.[`USD${quote}`];

  if(direct){
    return rawPnL * direct
  }
  if(inverse){
    return rawPnL/inverse;
  }
  return rawPnL 
};

const [selectedOption, setSelectedOption] = useState("close_all");

// ============================
// TRADE FILTERS
// ============================

const allTrades = openTrades || [];

const profitTrades = allTrades.filter((trade) => {
  return calculatePnL(trade, livePrices) > 0;
});

const lossTrades = allTrades.filter((trade) => {
  return calculatePnL(trade, livePrices) < 0;
});

const buyTrades = allTrades.filter((trade) => {
  return trade.type?.toUpperCase() === "BUY";
});

const sellTrades = allTrades.filter((trade) => {
  return trade.type?.toUpperCase() === "SELL";
});

// ============================
// PNL CALCULATOR
// ============================

const getTotalPnL = (trades) => {
  return trades.reduce((total, trade) => {
    return total + calculatePnL(trade, livePrices);
  }, 0);
};

// ============================
// COUNTS
// ============================

const allCount = allTrades.length;
const profitCount = profitTrades.length;
const lossCount = lossTrades.length;
const buyCount = buyTrades.length;
const sellCount = sellTrades.length;

// ============================
// TOTAL PNL
// ============================

const allPnL = getTotalPnL(allTrades);
const profitPnL = getTotalPnL(profitTrades);
const lossPnL = getTotalPnL(lossTrades);
const buyPnL = getTotalPnL(buyTrades);
const sellPnL = getTotalPnL(sellTrades);

// ============================
// POPUP OPTIONS
// ============================

const closeOptions = [
  {
    key: "close_all",
    label: "Close all",
    count: allCount,
    pnl: allPnL,
  },
  {
    key: "close_profit",
    label: "Close all profitable",
    count: profitCount,
    pnl: profitPnL,
  },
  {
    key: "close_loss",
    label: "Close all losing",
    count: lossCount,
    pnl: lossPnL,
  },
  {
    key: "close_buy",
    label: "Close all Buy",
    count: buyCount,
    pnl: buyPnL,
  },
  {
    key: "close_sell",
    label: "Close all Sell",
    count: sellCount,
    pnl: sellPnL,
  },
];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-full overflow-hidden relative">
      <AccountSummary openTrades={openTrades} />
      {/* Fixed Top Section: Tabs and Search */}
      <div className="flex-shrink-0 z-10">
        {/* Tab Navigation */}
        <div className={`flex text-sm font-semibold border-b pt-1 z-10 ${isDark ? "bg-[#141D22] text-gray-300 border-black" : "bg-white text-gray-600 border-gray-300"}`}>
          {/* Mobile View - Centered Tabs */}
          <div className="md:hidden flex justify-center px-4 py-2 w-full">
            <div className={`flex rounded-xl p-1 w-full gap-5 ${isDark ? "bg-gray-800" : "bg-[#EAF4FF]"}`}>

              {/* OPEN */}
              <button
                onClick={() => setTradeTab("open")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition ${
                  tradeTab === "open"
                    ? isDark
                      ? "bg-gray-700 text-white shadow"
                      : "bg-[#1877F2] text-white shadow"
                    : isDark
                      ? "text-gray-400"
                      : "text-gray-600"
                }`}
              >
                Open
                <span>
                  ({openTrades.length})
                </span>
              </button>

              {/* PENDING */}
              <button
                onClick={() => setTradeTab("pending")}
                className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-sm font-medium transition ${
                  tradeTab === "pending"
                    ? isDark
                      ? "bg-gray-700 text-white shadow"
                      : "bg-[#1877F2] text-white shadow"
                    : isDark
                      ? "text-gray-400"
                      : "text-gray-600"
                }`}
              >
                Pending
                <span>
                  ({pendingTrades.length})
                </span>
              </button>

              {/* CLOSED */}
              <button
                onClick={() => setTradeTab("closed")}
                className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-sm font-medium transition ${
                  tradeTab === "closed"
                    ? isDark
                      ? "bg-gray-700 text-white shadow"
                      : "bg-[#1877F2] text-white shadow"
                    : isDark
                      ? "text-gray-400"
                      : "text-gray-600"
                }`}
              >
                Closed
                <span>
                  ({closedTrades.length})
                </span>
              </button>

            </div>
          </div>

          {/* Desktop View - Left Aligned Tabs */}
      <div className="hidden md:flex">
          <button
            onClick={() => setTradeTab("open")}
            className={`px-4 py-2 flex items-center gap-1.5 text-xs ${isDark ? "text-white" : "text-black"} ${
              tradeTab === "open"
                ? isDark
                  ? "border-b-3 border-white"
                  : "border-b-2 border-blue-600 text-blue-600"
                : ""
            }`}
          >
            OPEN {" "}
            <span className={`text-[10px] font-bold px-1.5 rounded-sm  ${isDark ? "bg-gray-600" : "bg-blue-100 text-blue-500"}`}>
              {openTrades.length}
            </span>
          </button>

          <button
            onClick={() => setTradeTab("pending")}
            className={`px-4 py-2 flex items-center gap-1.5 text-xs ${isDark ? "text-white" : "text-black"} ${
              tradeTab === "pending"
                ? isDark
                  ? "border-b-3 border-white"
                  : "border-b-2 border-blue-600 text-blue-600"
                : ""
            }`}
          >
            PENDING{" "}
            <span className={`text-[10px] font-bold px-1.5 rounded-sm ${isDark ? "bg-gray-600" : "bg-blue-100 text-blue-500"}`}>
              {pendingTrades.length}
            </span>
          </button>

          <button
            onClick={() => setTradeTab("closed")}
            className={`px-4 py-2 flex items-center gap-1.5 text-xs ${isDark ? "text-white" : "text-black"} ${
              tradeTab === "closed"
                ? isDark
                  ? "border-b-3 border-white"
                  : "border-b-2 border-blue-600 text-blue-600"
                : ""
            }`}
          >
            CLOSED{" "}
            {/* <span className="text-[10px] font-bold bg-orange-100 text-orange-500 px-1.5 rounded-sm">
              {closedTrades.length}
            </span> */}
          </button>
        </div>


          {/* Desktop Only - Close Dropdown (Show only on Open or Pending tabs) */}
          {(tradeTab === "open" ) && (
            <>
            <div className="hidden md:flex ml-auto gap-2">
            <div className="hidden md:block md:flex gap-1 mt-2 px-2">
            <div className={`font-bold ${isDark ? "text-white" : "text-black"}`}>Total P/L, USD:</div>
            <div
              className={`font-bold ${
                totalPL >= 0 ? "text-green-800" : "text-red-600"
              }`}
            >
              {totalPL >= 0 ? "+" : ""}
              {totalPL.toFixed(2)}
            </div>
            </div>
            
            <div className="hidden md:block p-1.5">
              <button
                ref={triggerRef}
                onClick={() => setOpen((prev) => !prev)}
                className={`flex items-center gap-1 text-sm font-semibold px-3 py-0.5 rounded-md ${isDark ? "bg-[#3a3a5c] text-gray-300 hover:bg-[#4a4a6c]" : "bg-[#1877F2] text-white hover:bg-blue-500"}`}
              >
                Close
                <ChevronDown
                  size={16}
                  className={`transition-transform ${open ? "rotate-180" : ""}`}
                />
              </button>

              {marketClosedPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setMarketClosedPopup(false)}
              />
              <div className={`relative w-full max-w-md mx-4 rounded-lg shadow-lg p-6 ${isDark ? "bg-[#1a1a2e]" : "bg-white"}`}>
                <div className="flex items-start justify-between">
                  <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-black"}`}>Market Closed!</h3>
                  <button
                    onClick={() => setMarketClosedPopup(false)}
                    className={isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>
                <p className={`mt-3 text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  The Forex market is currently closed.
                </p>
                <div className="mt-5 flex justify-end">
                  <button
                    onClick={() => setMarketClosedPopup(false)}
                    className="px-4 py-2 bg-orange-400 text-white rounded-md hover:bg-orange-500"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
              )}

              {open && triggerRef.current && createPortal(
                <div
                  ref={desktopDropdownRef}
                  className={`fixed w-[290px] max-h-96 rounded-[10px] shadow-[0_10px_35px_rgba(0,0,0,0.25)] z-50 overflow-y-auto border ${
                    isDark
                      ? "bg-[#2b3139] border-[#3a4048]"
                      : "bg-white border-[#dfe3e8]"
                  }`}
                  style={{
                    top: triggerRef.current.getBoundingClientRect().bottom + 8 + 'px',
                    right: Math.max(16, window.innerWidth - triggerRef.current.getBoundingClientRect().right) + 'px',
                  }}
                >
                  {/* HEADER */}
                  <div className="px-3 pt-3 pb-1.5 sticky top-0 bg-inherit border-b">
                    <h2
                      className={`text-[15px] font-semibold leading-[20px] tracking-[-0.1px] ${
                        isDark ? "text-[#f1f1f1]" : "text-[#1877F2]"
                      }`}
                    >
                      Close positions at the market prices?
                    </h2>
                  </div>

                  {/* OPTIONS */}
                  <div className="px-4 py-2">
                    {closeOptions.map((item) => {
                      const isSelected = selectedOption === item.key;
                      const isDisabled = item.count === 0;

                      return (
                        <button
                          key={item.key}
                          onClick={() => !isDisabled && setSelectedOption(item.key)}
                          disabled={isDisabled}
                          className={`w-full flex items-center justify-between px-2.5 py-[9px] rounded-[8px] transition-all duration-150 ${
                            isDisabled
                              ? "opacity-45 cursor-not-allowed"
                              : isDark
                              ? "hover:bg-[#353c45]"
                              : "hover:bg-[#f3f4f6]"
                          }`}
                        >
                          {/* LEFT */}
                          <div className="flex items-center gap-2">
                            {/* RADIO */}
                            <div
                              className={`w-[17px] h-[17px] rounded-full border flex items-center justify-center transition-all ${
                                isDisabled
                                  ? isDark
                                    ? "border-[#4a5159] bg-[#40464d]"
                                    : "border-[#d1d5db] bg-[#e5e7eb]"
                                  : isSelected
                                  ? isDark
                                    ? "border-[#8d9aa7] bg-[#8d9aa7]"
                                    : "border-[#6b7280] bg-[#6b7280]"
                                  : isDark
                                  ? "border-[#616972] bg-transparent"
                                  : "border-[#9ca3af] bg-transparent"
                              }`}
                            >
                              {isSelected && !isDisabled && (
                                <div className="w-[6px] h-[6px] rounded-full bg-white"></div>
                              )}
                            </div>

                            {/* LABEL */}
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`text-[13.5px] font-medium tracking-[-0.1px] ${
                                  isDisabled
                                    ? isDark
                                      ? "text-[#7b828a]"
                                      : "text-[#1877F2]"
                                    : isDark
                                    ? "text-[#f3f4f6]"
                                    : "text-[#1877F2]"
                                }`}
                              >
                                {item.label}
                              </span>

                              <span
                                className={`min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-medium px-1 ${
                                  isDisabled
                                    ? isDark
                                      ? "bg-[#454c54] text-[#8b949e]"
                                      : "bg-[#e5e7eb] text-[#1877F2]"
                                    : isDark
                                    ? "bg-[#4b535c] text-[#d1d5db]"
                                    : "bg-[#EAF4FF] text-[#1877F2]"
                                }`}
                              >
                                {item.count}
                              </span>
                            </div>
                          </div>

                          {/* RIGHT */}
                          <span
                            className={`text-[13.5px] font-medium tracking-[-0.1px] ${
                              isDisabled
                                ? isDark
                                  ? "text-[#8b949e]"
                                  : "text-[#1877F2]"
                                : item.pnl >= 0
                                ? "text-[#22c55e]"
                                : "text-[#ff1111]"
                            }`}
                          >
                            {isDisabled
                              ? "--"
                              : `${item.pnl >= 0 ? "+" : ""}${item.pnl.toFixed(2)}`}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* FOOTER */}
                  <div className="flex gap-3 px-3 pt-1.5 pb-2 sticky bottom-0 bg-inherit border-t">
                    <button
                      onClick={() => setOpen(false)}
                      className={`flex-1 h-[40px] rounded-[6px] text-[14px] font-medium transition-colors ${
                        isDark
                          ? "bg-[#3b4651] text-[#e5e7eb] hover:bg-[#46515c]"
                          : "bg-[#1877F2] text-[#FFFFFF] hover:bg-blue-600"
                      }`}
                    >
                      Cancel 
                    </button>

                    <button
                      onClick={() => {
                        setOpen(false);
                        handleSelect(selectedOption);
                      }}
                      className="flex-1 h-[40px] rounded-[6px] bg-[#1877F2] text-[#FFFFFF] text-[14px] font-medium hover:bg-blue-600 transition-colors"
                    >
                      Confirm
                    </button>
                  </div>
                </div>,
                document.body
              )}
            </div>
            </div>
            </>
          )}
        </div>

        {/* Search Bar Container */}
        <div className={`p-2 md:px-4 z-10 ${isDark ? "bg-[#141D22]" : "bg-white"}`}>
          <div className={`flex items-center px-3 py-2 gap-2 rounded-lg w-full border ${isDark ? "border-gray-600 bg-[#141D22]" : "border-gray-300 bg-white"}`}>
            <IoSearch className={isDark ? "text-gray-400" : "text-gray-800"} />
            <input
              type="text"
              className={`outline-none w-full text-sm bg-transparent ${isDark ? "text-white" : "text-black"}`}
              placeholder="Search (e.g., Buy, Sell, BTC, XAUUSD)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Mobile Total P/L and Close Dropdown */}
        {tradeTab === "open" && (
          <div className="md:hidden flex items-center justify-between px-4 py-2 z-10">
            <div className="flex gap-1 items-center">
              <div className={`font-bold text-sm ${isDark ? "text-white" : "text-black"}`}>Total P/L, USD:</div>
              <div className={`font-bold text-sm ${totalPL >= 0 ? "text-green-800" : "text-red-600"}`}>
                {totalPL >= 0 ? "+" : ""}{totalPL.toFixed(2)}
              </div>
            </div>
            <div>
              <button
                ref={mobileTriggerRef}
                onClick={() => setOpen((prev) => !prev)}
                className={`flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-md ${isDark ? "bg-[#3a3a5c] text-gray-300 hover:bg-[#4a4a6c]" : "bg-orange-400 text-orange-100 hover:bg-orange-500"}`}
              >
                Close
                <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
              </button>
              {marketClosedPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/40" onClick={() => setMarketClosedPopup(false)} />
                  <div className={`relative w-full max-w-md mx-4 rounded-lg shadow-lg p-6 ${isDark ? "bg-[#1a1a2e]" : "bg-white"}`}>
                    <div className="flex items-start justify-between">
                      <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-black"}`}>Market Closed!</h3>
                      <button onClick={() => setMarketClosedPopup(false)} className={isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"} aria-label="Close">✕</button>
                    </div>
                    <p className={`mt-3 text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>The Forex market is currently closed.</p>
                    <div className="mt-5 flex justify-end">
                      <button onClick={() => setMarketClosedPopup(false)} className="px-4 py-2 bg-orange-400 text-white rounded-md hover:bg-orange-500">OK</button>
                    </div>
                  </div>
                </div>
              )}
              {open && mobileTriggerRef.current && createPortal(
                <div
                  ref={mobileDropdownRef}
                  className={`fixed w-[calc(100vw-2rem)] max-w-sm max-h-96 rounded-[10px] shadow-[0_10px_35px_rgba(0,0,0,0.25)] z-50 overflow-y-auto border ${isDark ? "bg-[#2b3139] border-[#3a4048]" : "bg-white border-[#dfe3e8]"}`}
                  style={{
                    top: mobileTriggerRef.current.getBoundingClientRect().bottom + 8 + 'px',
                    right: Math.max(8, window.innerWidth - mobileTriggerRef.current.getBoundingClientRect().right) + 'px',
                  }}
                >
                  {/* HEADER */}
                  <div className="px-3 pt-3 pb-1.5 sticky top-0 bg-inherit border-b">
                    <h2 className={`text-[15px] font-semibold leading-[20px] tracking-[-0.1px] ${isDark ? "text-[#f1f1f1]" : "text-[#1877F2]"}`}>Close positions at the market prices?</h2>
                  </div>
                  {/* OPTIONS */}
                  <div className="px-4 py-2">
                    {closeOptions.map((item) => {
                      const isSelected = selectedOption === item.key;
                      const isDisabled = item.count === 0;
                      return (
                        <button key={item.key} onClick={() => !isDisabled && setSelectedOption(item.key)} disabled={isDisabled} className={`w-full flex items-center justify-between px-2.5 py-[9px] rounded-[8px] transition-all duration-150 ${isDisabled ? "opacity-45 cursor-not-allowed" : isDark ? "hover:bg-[#353c45]" : "hover:bg-[#f3f4f6]"}`}>
                          {/* LEFT */}
                          <div className="flex items-center gap-2">
                            {/* RADIO */}
                            <div className={`w-[17px] h-[17px] rounded-full border flex items-center justify-center transition-all ${isDisabled ? isDark ? "border-[#4a5159] bg-[#40464d]" : "border-[#d1d5db] bg-[#e5e7eb]" : isSelected ? isDark ? "border-[#8d9aa7] bg-[#8d9aa7]" : "border-[#6b7280] bg-[#6b7280]" : isDark ? "border-[#616972] bg-transparent" : "border-[#9ca3af] bg-transparent"}`}>
                              {isSelected && !isDisabled && (<div className="w-[6px] h-[6px] rounded-full bg-white"></div>)}
                            </div>
                            {/* LABEL */}
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[13.5px] font-medium tracking-[-0.1px] ${isDisabled ? isDark ? "text-[#7b828a]" : "text-[#1877F2]" : isDark ? "text-[#f3f4f6]" : "text-[#1877F2]"}`}>{item.label}</span>
                              <span className={`min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-medium px-1 ${isDisabled ? isDark ? "bg-[#454c54] text-[#8b949e]" : "bg-[#e5e7eb] text-[#9ca3af]" : isDark ? "bg-[#4b535c] text-[#d1d5db]" : "bg-[#e5e7eb] text-[#4b5563]"}`}>{item.count}</span>
                            </div>
                          </div>
                          {/* RIGHT */}
                          <span className={`text-[13.5px] font-medium tracking-[-0.1px] ${isDisabled ? isDark ? "text-[#8b949e]" : "text-[#9ca3af]" : item.pnl >= 0 ? "text-[#22c55e]" : "text-[#ff1111]"}`}>
                            {isDisabled ? "--" : `${item.pnl >= 0 ? "+" : ""}${item.pnl.toFixed(2)}`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {/* FOOTER */}
                  <div className="flex gap-3 px-3 pt-1.5 pb-2 sticky bottom-0 bg-inherit border-t">
                    <button onClick={() => setOpen(false)} className={`flex-1 h-[40px] rounded-[6px] text-[14px] font-medium transition-colors ${isDark ? "bg-[#3b4651] text-[#e5e7eb] hover:bg-[#46515c]" : "bg-[#1877F2] text-[#FFFFFF] hover:bg-blue-300"}`}>Cancel</button>
                    <button onClick={() => { setOpen(false); handleSelect(selectedOption); }} className="flex-1 h-[40px] rounded-[6px] bg-[#1877F2] text-[#FFFFFF] text-[14px] font-medium hover:bg-[#facc15] transition-colors">Confirm</button>
                  </div>
                </div>,
                document.body
              )}
            </div>
          </div>
        )}
      </div>

      {/* Scrollable Middle Section */}
      <div className="flex-1 overflow-y-auto min-h-0 overscroll-contain">
        {/* Mobile View - Open Trades */}
        <div className={`md:hidden ${isDark ? "bg-[#141D22]" : "bg-white"}`}>
          {tradeTab === "open" && (
            <div className={isDark ? "bg-[#141D22]" : "bg-white"}>
              <div className="space-y-3 p-4">
                {/* Trades List */}
                <div>
                  {openTrades.length > 0 ? (                 
                      openTrades
                      .filter((trade) =>
                        search === "" ||
                        trade.symbol?.toLowerCase().includes(search.toLowerCase()) ||
                        trade.type?.toLowerCase().includes(search.toLowerCase()) ||
                        trade.trade_id?.toString().includes(search)
                      )
                      .map((trade, index) => {
                        const cleanSymbol = trade.symbol
                          ?.replace("OANDA:", "")
                          ?.replace("/", "")
                          ?.trim();

                     const currentPrice = livePrices?.[cleanSymbol] ?? null;

                        return (
                      <div
                        key={`${trade?.trade_id}-${index}`}
                        className={`border rounded-lg p-4 shadow-sm cursor-pointer mb-3 ${isDark ? "bg-[#141D22] border-gray-800" : "bg-white border-gray-100"}`}
                        onClick={() => setSelectedOrder(trade)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                                <img
                                  src={PairIcons[cleanSymbol]}
                                  alt={trade.symbol}
                                  className="w-9 h-9"
                                />
                            <div>
                              <div className={`font-semibold ${isDark ? "text-white" : "text-black"}`}>{trade.symbol}</div>
                              <div
                                className={`text-sm ${
                                  trade.type === "BUY"
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {trade.type === "BUY" ? "Buy" : "Sell"}{" "}
                                {Number(trade.lot_size).toString()}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="text-right flex-1">
                              <div
                                className={`font-bold ${
                                calculatePnL(trade, livePrices) >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                                }`}
                              >
                              {calculatePnL(trade, livePrices) >= 0
                                ? `+${calculatePnL(trade, livePrices).toFixed(2)}`
                                : calculatePnL(trade, livePrices).toFixed(2)}  USD
                              </div>
                              <div className={`flex items-center justify-end gap-1 text-[12px] ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                <span>CMP</span>
                                <MdArrowRight className="text-base" />
                                <span className={`text-sm ${isDark ? "text-white" : "text-gray-800"}`}>
                                  {currentPrice || "_"}
                                </span>
                              </div>
                            </div>

                            {/* X Close Icon at the end */}
                            {/* <button
                              onClick={(e) => {
                                e.stopPropagation();
                                  handleCloseTrade(trade.trade_id, trade.user_id);
                              }}
                              className="text-gray-400 hover:text-red-600 text-xl font-bold"
                            >
                              ×
                            </button> */}
                          </div>
                        </div>
                      </div>
                    );
                      })
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className={`text-center text-sm py-4 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                        No open position available
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PENDING TRADES MOBILE */}
          {tradeTab === "pending" && (
            <div className={isDark ? "bg-[#141D22]" : "bg-white"}>
              <div className="pb-4">
                {/* Pending Trades List */}
                <div>
                  <div className="p-4">
                    {pendingTrades.length > 0 ? (
                      // pendingTrades.map((trade) => (
                        pendingTrades
                        .filter((trade) =>
                          search === "" ||
                          trade.symbol?.toLowerCase().includes(search.toLowerCase()) ||
                          trade.type?.toLowerCase().includes(search.toLowerCase()) ||
                          trade.trade_id?.toString().includes(search)
                        )
                        .map((trade) => {
                        const cleanSymbol = trade.symbol
                          ?.replace("OANDA:", "")
                          ?.replace("/", "")
                          ?.trim();

                        const currentPrice = livePrices?.[cleanSymbol] ?? null;

                        return (
                        <div
                          key={trade.trade_id}
                          className={`border rounded-lg p-4 shadow-sm cursor-pointer mb-3 ${isDark ? "bg-[#141D22] border-gray-800" : "bg-white border-gray-200"}`}
                          onClick={() => setSelectedOrder(trade)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                                            <img
                                  src={PairIcons[cleanSymbol]}
                                  alt={trade.symbol}
                                  className="w-9 h-9"
                                />  
                              <div>
                                {/* Left Side: Symbol, Order Type, Lot Size */}
                                <div className={`font-semibold text-base ${isDark ? "text-white" : "text-black"}`}>
                                  {trade.symbol}
                                </div>
                                <div className="text-sm flex items-center gap-1">
                                  <div
                                    className={`text-sm ${
                                      trade.type === "BUY"
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {trade.type === "BUY" ? "BUY" : "SELL"}{" "}
                                    {Number(trade.lot_size).toString()}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Right Side: Limit Price and Date/Time */}
                            <div className="flex items-start gap-3">
                              <div className="text-right flex-1">
                                <div className={`flex items-center justify-end text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                  <span>Limit Price</span>
                                  <MdArrowRight className={`text-base ${isDark ? "text-gray-400" : "text-gray-600"}`} />
                                  <span className={`font-medium ${isDark ? "text-white" : "text-black"}`}>
                                    {Number(trade.entry_price || 0).toFixed(2)}
                                  </span>
                                </div>
                                <div className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                  {formatUTC(trade.entry_time)}
                                </div>
                              </div>
                              {/* X Close Icon at the end */}
                              {/* <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                   handleClosePendingOrder(trade.trade_id, trade.user_id);
                                }}
                                className="text-gray-400 hover:text-red-600 text-xl font-bold"
                              >
                                ×
                              </button> */}
                            </div>
                          </div>
                        </div>
                      );})
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className={`text-center text-sm py-4 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                          No pending position available
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CLOSED TRADES MOBILE */}
          {tradeTab === "closed" && (
            <div className={isDark ? "bg-[#141D22]" : "bg-white"}>
              <div className="pb-4">
                {/* Content Area */}
                <div className="px-4 pb-4">
                  {closedTrades.length > 0 ? (
                    <div className="space-y-3">
                      {/* {closedTrades.map((trade) => ( */}
                        {closedTrades
                        .filter((trade) =>
                          search === "" ||
                          trade.symbol?.toLowerCase().includes(search.toLowerCase()) ||
                          trade.trade_id?.toString().includes(search) ||
                          trade.type?.toLowerCase().includes(search.toLowerCase())||
                          formatUTC(trade.entry_time).includes(search)||
                          formatUTC(trade.exit_time).includes(search)
                        )
                        .map((trade) => {
                        const cleanSymbol = trade.symbol
                          ?.replace("OANDA:", "")
                          ?.replace("/", "")
                          ?.trim();
                     
                        const currentPrice = livePrices?.[cleanSymbol] ?? null;

                        return (
                        <div
                          key={trade.id}
                          className={`border rounded-lg p-4 shadow-lg cursor-pointer ${isDark ? "bg-[#252540] border-gray-700" : "bg-white border-gray-200"}`}
                          onClick={() =>
                            setExpandedTrade(
                              expandedTrade === trade.trade_id ? null : trade.trade_id
                            )
                          }
                        >
                          <div className="flex justify-between items-start">
                            {/* Left Side: Symbol Icon, Name, Order Type, Lot Size */}
                            <div className="flex items-center gap-3 flex-1">
                                 <img
                                  src={PairIcons[cleanSymbol]}
                                  alt={trade.symbol}
                                  className="w-9 h-9"
                                />
                              <div>
                                <div className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                                  {trade.symbol}
                                </div>
                                <div
                                  className={`text-sm ${
                                    trade.type === "BUY"
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {trade.type === "BUY" ? "BUY" : "SELL"}{" "}
                                  {Number(trade.lot_size).toString()}
                                </div>
                              </div>
                            </div>

                            {/* Right Side: PNL and Date/Time */}
                            <div className="text-right">
                              <div
                                className={`font-bold text-base ${
                                  trade.pnl >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {trade.pnl >= 0
                                  ? `+${Math.abs(trade.pnl).toFixed(2)} USD`
                                  : `-${Math.abs(trade.pnl).toFixed(2)} USD`}
                              </div>
                              <div className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                               {formatUTC(trade.exit_time)}
                              </div>
                            </div>
                          </div>

                          {/* Expandable Details Section */}
                          {expandedTrade === trade.trade_id && (
                            <div className={`mt-4 pt-4 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                              <div className="flex items-center justify-center gap-2 mb-4">
                                <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                  Position ID:
                                </span>
                                <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                  {trade.trade_id}
                                </span>
                              </div>

                              <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>Open Time</span>
                                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                                    {formatUTC(trade.entry_time)}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                                    Close Time
                                  </span>
                                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                                    {formatUTC(trade.exit_time) || "Active"}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>Swap</span>
                                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                                    {trade.swap || "0.00 USD"}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                                    Commission
                                  </span>
                                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                                    {trade.commission || "0.00 USD"}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                                    Open Price
                                  </span>
                                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                                    {trade.entry_price}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                                    Close Price
                                  </span>
                                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                                    {trade.exit_price || "-"}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>Stop Loss</span>
                                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                                    {(trade.stop_loss === null || trade.stop_loss === 0) && 
                                    (trade.sl_pnl === null || trade.sl_pnl === 0)
                                      ? "_"
                                      : trade.sl_pnl !== null && trade.sl_pnl !== 0
                                        ? `${Number(trade.sl_pnl).toFixed(2)} USD`
                                        : Number(trade.stop_loss).toFixed(cleanSymbol === "XAUUSD" ? 3 : 5)
                                    }
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                                    Take Profit
                                  </span>
                                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                                      {(trade.take_profit === null || trade.take_profit === 0) && 
                                      (trade.tp_pnl === null || trade.tp_pnl === 0)
                                        ? "_"
                                        : trade.tp_pnl !== null && trade.tp_pnl !== 0
                                          ? `${Number(trade.tp_pnl).toFixed(2)} USD`
                                          : Number(trade.take_profit).toFixed(cleanSymbol === "XAUUSD" ? 3 : 5)
                                      }
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );})}
                      <div className={`flex mt-5 rounded-lg p-3 items-center justify-center ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                        <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                          Showing closed position for the last 24 hours
                        </span>
                      </div>
                    </div>
                    
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className={`text-center text-sm py-4 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                        No closed position available
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Desktop View Tables */}
        <div className=" w-full ">
          {/* Tables Container */}
          <div className="hidden md:block w-full">
            {/* OPEN TRADES TABLE */}
            {tradeTab === "open" && (
              <div className="overflow-x-auto">
                {openTrades.length > 0 ? (
                  <table className="min-w-[1200px] w-full text-[13px] border-collapse">
                    <thead className={`font-medium sticky top-0 z-10 ${isDark ? "bg-[#252540] text-gray-300" : "bg-gray-100 text-black-600"}`}>
                      <tr>
                        <th className="px-4 py-2 text-center">Position ID</th>
                        <th className="px-4 py-2 text-center">Open Time</th>
                        <th className="px-4 py-2 text-center">Symbol</th>
                        <th className="px-4 py-2 text-center">Order</th>
                        <th className="px-4 py-2 text-center">Lot</th>
                        <th className="px-4 py-2 text-center">Open Price</th>
                        <th className="px-4 py-2 text-center">Current Price</th>
                        <th className="px-4 py-2 text-center">Take Profit</th>
                        <th className="px-4 py-2 text-center">Stop Loss</th>
                        <th className="px-4 py-2 text-center">Swap</th>
                        <th className="px-4 py-2 text-center">P/L USD</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {openTrades
                      .filter((trade) =>
                        search === "" ||
                        trade.symbol?.toLowerCase().includes(search.toLowerCase()) ||
                        trade.type?.toLowerCase().includes(search.toLowerCase()) ||
                        trade.trade_id?.toString().includes(search)
                      )
                      .map((trade, index) => {
                        const cleanSymbol = trade.symbol
                          ?.replace("OANDA:", "").replace("BINANCE:", "").replace("GMC:", "")
                          ?.replace("/", "")
                          ?.trim();

                        const currentPrice = livePrices?.[cleanSymbol] ?? null;

                        return (
                          <tr
                            key={`${trade?.trade_id}-${index}`}
                            className={`border-b hover:bg-gray-50 ${isDark ? "border-gray-700 hover:bg-[#1e1e36]" : "border-gray-200"}`}
                          >
                            <td className={`px-4 py-2 text-center ${isDark ? "text-gray-300" : ""}`}>
                              {trade.trade_id}
                            </td>
                            <td className={`px-4 py-2 text-center ${isDark ? "text-gray-300" : ""}`}>
                              {formatUTC(trade.entry_time)}
                            </td>
                            <td className={`px-4 py-2 text-center ${isDark ? "text-white" : ""}`}>
                              <div className="flex items-center justify-center gap-2">
                                <img
                                  src={PairIcons[cleanSymbol]}
                                  alt={trade.symbol}
                                  className="w-6 h-6"
                                />
                                <span>{trade.symbol}</span>
                              </div>
                            </td>

                            <td className="px-4 py-2 text-center font-semibold flex items-center justify-center gap-1">
                              {trade.type === "BUY" ? (
                                <>
                                  <span className="text-green-600">▲</span> BUY
                                </>
                              ) : (
                                <>
                                  <span className="text-red-600">▼</span> SELL
                                </>
                              )}
                            </td>

                            <td className={`px-4 py-2 text-center ${isDark ? "text-gray-300" : ""}`}>
                              {Number(trade.lot_size).toString()}
                            </td>
                            <td className={`px-4 py-2 text-center ${isDark ? "text-gray-300" : ""}`}>
                               {trade.symbol?.includes("XAU/USD") || trade.symbol?.includes("BTC/USD") || trade.symbol?.includes("ETH/USD") 
                                  ? Number(trade.entry_price).toFixed(3)
                                  : Number(trade.entry_price).toFixed(5)}
                            </td>
                            {/* ✅ Current Price (Live from Socket) */}
                            <td className={`px-4 py-2 text-center font-semibold ${isDark ? "text-white" : ""}`}>
                             {currentPrice
                                ? (cleanSymbol === "XAUUSD" || cleanSymbol === "XAGUSD" || cleanSymbol === "BTCUSD" || cleanSymbol === "ETHUSD"
                                    ? currentPrice.toFixed(3)
                                    : currentPrice.toFixed(5))
                                : "_"}
                            </td>
                            <td
                              onClick={() => {
                                setSelectedTrade(trade);
                                setShowModify(true);
                              }}
                              className={`px- py-2 text-center cursor-pointer ${isDark ? "text-gray-300" : "text-blue-600"}`}
                            >
                            {(trade.take_profit === null || trade.take_profit === 0) && 
                            (trade.tp_pnl === null || trade.tp_pnl === 0)
                              ? <span className={isDark ? "bg-[] text-gray-300 px-3 py-1 rounded" : ""}>Add </span>
                              : trade.tp_pnl !== null && trade.tp_pnl !== 0
                                ? `${Number(trade.tp_pnl).toFixed(2)} USD`
                                : Number(trade.take_profit).toFixed(cleanSymbol === "XAUUSD" ? 3 : 5)
                            }
                            </td>

                            <td
                              onClick={() => {
                                setSelectedTrade(trade);
                                setShowModify(true);
                              }}
                              className={`px- py-2 text-center cursor-pointer ${isDark ? "text-gray-300" : "text-blue-600"}`}
                            >
                              {(trade.stop_loss === null || trade.stop_loss === 0) && 
                              (trade.sl_pnl === null || trade.sl_pnl === 0)
                                ? <span className={isDark ? "bg-[] text-gray-300 px-3 py-1 rounded" : ""}>Add</span>
                                : trade.sl_pnl !== null && trade.sl_pnl !== 0
                                  ? `${Number(trade.sl_pnl).toFixed(2)} USD`
                                  : Number(trade.stop_loss).toFixed(cleanSymbol === "XAUUSD" ? 3 : 5)
                              }
                            </td>
                            <td className={`px- py-2 text-center ${isDark ? "text-gray-300" : ""}`}>
                              {trade.swap ?? 0}
                            </td>
                            <td
                              className={`px- py-2 text-center font-bold ${
                                calculatePnL(trade, livePrices) >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {calculatePnL(trade, livePrices) >= 0
                                ? `+${calculatePnL(trade, livePrices).toFixed(2)}`
                                : calculatePnL(trade, livePrices).toFixed(2)}
                            </td>
                            <td>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();

                                  const symbol = trade.symbol;

                                  // If NOT crypto → check forex market time
                                  if (!isCryptoPair(symbol)) {
                                    if (!isForexMarketOpen(symbol)) {
                                      setMarketClosedPopup(true);
                                      return;
                                    }
                                  }

                                  // Crypto OR Forex market open
                                  handleCloseTrade(trade.trade_id, trade.user_id);
                                }}
                                className="text-gray-400 hover:text-red-600 text-2xl p-1 mr-2 font-bold"
                              >
                                ×
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p className={`text-center text-sm py-4 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                    No open trades available
                  </p>
                )}
              </div>
            )}

            {/* PENDING TRADES TABLE */}
            {tradeTab === "pending" && (
              <div className="overflow-x-auto">
                {pendingTrades.length > 0 ? (
                  <table className="min-w-[1200px] w-full text-[13px] border-collapse">
                    <thead className={`font-medium sticky top-0 z-10 ${isDark ? "bg-[#252540] text-gray-300" : "bg-gray-100 text-black-600"}`}>
                      <tr>
                        <th className="px-4 py-2 text-center">Position ID</th>
                        <th className="px-4 py-2 text-center">Placed Time</th>
                        <th className="px-4 py-2 text-center">Symbol</th>
                        <th className="px-4 py-2 text-center">Order</th>
                        <th className="px-4 py-2 text-center">Type</th>
                        <th className="px-4 py-2 text-center">Lot</th>
                        <th className="px-4 py-2 text-center">Opening Price</th>
                        <th className="px-4 py-2 text-center">Current Price</th>
                        <th className="px-4 py-2 text-center">Take Profit</th>
                        <th className="px-4 py-2 text-center">Stop Loss</th>
                        <th className="px-4 py-2 text-center"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingTrades
                      .filter((trade) =>
                        search === "" ||
                        trade.symbol?.toLowerCase().includes(search.toLowerCase()) ||
                        trade.type?.toLowerCase().includes(search.toLowerCase()) ||
                        trade.trade_id?.toString().includes(search)
                      )
                      .map((trade) => {
                        const cleanSymbol = trade.symbol
                          ?.replace("OANDA:", "")
                          ?.replace("/", "")
                          ?.trim();
                      
                        const currentPrice = livePrices?.[cleanSymbol] ?? null;

                        return (
                      
                        <tr key={trade.id} className={`border-b hover:bg-gray-50 ${isDark ? "border-gray-700 hover:bg-[#1e1e36]" : "border-gray-200"}`}>
                          <td className={`px-4 py-2 text-center ${isDark ? "text-gray-300" : ""}`}>{trade.trade_id}</td>
                          <td className={`px-4 py-2 text-center ${isDark ? "text-gray-300" : ""}`}>
                            {formatUTC(trade.entry_time)}
                          </td>
                          <td className={`px-4 py-2 text-center ${isDark ? "text-white" : ""}`}>
                              <div className="flex items-center justify-center gap-2">
                                <img
                                  src={PairIcons[cleanSymbol]}
                                  alt={trade.symbol}
                                  className="w-6 h-6"
                                />
                                <span>{trade.symbol}</span>
                              </div>
                          </td>
                          <td className="px-4 py-2 text-center">
                          {trade.type === "BUY" ? (
                            <>
                             <span className="text-green-600">▲</span> BUY
                            </>
                            ) : (
                            <>  
                              <span className="text-red-600">▼</span> SELL
                            </>
                           )}
                          </td>
                          <td className={`px-4 py-2 text-center ${isDark ? "text-gray-300" : ""}`}>{trade.order_type === "advanced" ? "pending" : trade.order_type}</td>
                          <td className={`px-4 py-2 text-center ${isDark ? "text-gray-300" : ""}`}>{Number(trade.lot_size).toString()}</td>
                          <td className={`px-4 py-2 text-center ${isDark ? "text-gray-300" : ""}`}>
                            {trade.symbol?.includes("XAU/USD")  || trade.symbol?.includes("BTC/USD") || trade.symbol?.includes("ETH/USD") 
                              ? Number(trade.entry_price).toFixed(3)
                              : Number(trade.entry_price).toFixed(5)}
                          </td>
                          <td className={`px-4 py-2 text-center ${isDark ? "text-gray-300" : ""}`}>
                              {currentPrice
                                ? (cleanSymbol === "XAUUSD" || cleanSymbol === "XAGUSD"
                                    ? currentPrice.toFixed(3)
                                    : currentPrice.toFixed(5))
                                : "_"}
                          </td>
                            <td
                              onClick={() => {
                                setSelectedTrade(trade);
                                setShowModify(true);
                              }}
                              className={`px-4 py-2 text-center cursor-pointer ${isDark ? "text-gray-300" : "text-blue-600"}`}
                            >
                            {(trade.take_profit === null || trade.take_profit === 0) && 
                            (trade.tp_pnl === null || trade.tp_pnl === 0)
                              ? <span className={isDark ? "bg-[#3a3a5c] text-white px-3 py-1 rounded" : ""}>Add</span>
                              : trade.tp_pnl !== null && trade.tp_pnl !== 0
                                ? `${Number(trade.tp_pnl).toFixed(2)} USD`
                                : Number(trade.take_profit).toFixed(cleanSymbol === "XAUUSD" ? 3 : 5)
                            }
                            </td>

                            <td
                              onClick={() => {
                                setSelectedTrade(trade);
                                setShowModify(true);
                              }}
                              className={`px-4 py-2 text-center cursor-pointer ${isDark ? "text-gray-300" : "text-blue-600"}`}
                            >
                              {(trade.stop_loss === null || trade.stop_loss === 0) && 
                              (trade.sl_pnl === null || trade.sl_pnl === 0)
                                ? <span className={isDark ? "bg-[#3a3a5c] text-white px-3 py-1 rounded" : ""}>Add</span>
                                : trade.sl_pnl !== null && trade.sl_pnl !== 0
                                  ? `${Number(trade.sl_pnl).toFixed(2)} USD`
                                  : Number(trade.stop_loss).toFixed(cleanSymbol === "XAUUSD" ? 3 : 5)
                              }
                            </td>
                          <td>
                            <button
                              onClick={(e) => {
                                  e.stopPropagation();
                                  handleClosePendingOrder(trade.trade_id, trade.user_id);
                              }}
                              className="text-gray-400 hover:text-red-600 text-2xl p-1 mr-2 font-bold"
                            >
                              ×
                            </button>
                          </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p className={`text-center text-sm py-4 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                    No pending trades available
                  </p>
                )}
              </div>
            )}

            {/* CLOSED TRADES TABLE */}
            {tradeTab === "closed" && (
              <div className="overflow-x-auto">
                {closedTrades.length > 0 ? (
                  <table className="min-w-[1200px] w-full text-[13px] border-collapse">
                    <thead className={`font-medium sticky top-0 z-10 ${isDark ? "bg-[#252540] text-gray-300" : "bg-gray-100 text-black-600"}`}>
                      <tr>
                        <th className="px- py-2 text-center">Position ID</th>
                        <th className="px- py-2 text-center">Open Time</th>
                        <th className="px- py-2 text-center">Symbol</th>
                        <th className="px- py-2 text-center">Order</th>
                        <th className="px- py-2 text-center">Type</th>
                        <th className="px- py-2 text-center">Status</th>
                        <th className="px- py-2 text-center">Lot</th>
                        <th className="px- py-2 text-center">Open Price</th>
                        <th className="px- py-2 text-center">Close Price</th>
                        <th className="px- py-2 text-center">Take Profit</th>
                        <th className="px- py-2 text-center">Stop Loss</th>
                        <th className="px- py-2 text-center">Close Time</th>
                        <th className="px- py-2 text-center">Commission</th>
                        <th className="px- py-2 text-center">Swap</th>
                        <th className="px- py-2 text-center">P/L USD</th>
                      </tr>
                    </thead>
                    <tbody>
                      {closedTrades
                      .filter((trade) =>
                        search === "" ||
                        trade.symbol?.toLowerCase().includes(search.toLowerCase()) ||
                        trade.trade_id?.toString().includes(search) ||
                        trade.type?.toLowerCase().includes(search.toLowerCase())||
                        formatUTC(trade.entry_time).includes(search)||
                        formatUTC(trade.exit_time).includes(search)
                      )
                      .map((trade) => {
                          const cleanSymbol = trade.symbol
                          ?.replace("OANDA:", "").replace("BINANCE:", "").replace("GMC:", "")
                          ?.replace("/", "")
                          ?.trim();
                      
                        const currentPrice = livePrices?.[cleanSymbol] ?? null;

                        return (
                        <tr key={trade.id} className={`border-b hover:bg-gray-50 ${isDark ? "border-gray-700 hover:bg-[#1e1e36]" : "border-gray-200"}`}>
                          <td className={`px-6 py-2 text-center ${isDark ? "text-gray-300" : ""}`}>{trade.trade_id}</td>
                          <td className={`px-4 py-2 text-center ${isDark ? "text-gray-300" : ""}`}>
                           {formatUTC(trade.entry_time)}
                          </td>
                          <td className={`px-4 py-2 text-center ${isDark ? "text-white" : ""}`}>
                            <div className="flex items-center justify-center gap-2">
                              <img
                                src={
                                  PairIcons[
                                    trade.symbol
                                      ?.replace("OANDA:", "")
                                      ?.replace("/", "")
                                  ]
                                }
                                alt={trade.symbol}
                                className="w-6 h-6 "
                              />
                              <span>{trade.symbol}</span>
                            </div>
                          </td>
                          <td
                            className={`px-4 py-2 text-center font-semibold ${
                              trade.type === "BUY"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {trade.type}
                          </td>
                          <td className={`px-4 py-2 text-center ${isDark ? "text-gray-300" : ""}`}>
                            {trade.order_type === "advanced" ? "pending" : trade.order_type}
                          </td>
                          <td className={`px-4 py-2 text-center ${isDark ? "text-gray-300" : ""}`}>
                            {trade.order_status}
                          </td>
                          <td className={`px-4 py-2 text-center ${isDark ? "text-gray-300" : ""}`}>
                            {Number(trade.lot_size).toString()}
                          </td>
                          <td className={`px-4 py-2 text-center ${isDark ? "text-gray-300" : ""}`}>
                            {trade.symbol?.includes("XAU/USD")
                              ? Number(trade.entry_price).toFixed(3)
                              : Number(trade.entry_price).toFixed(5)}
                          </td>
                          <td className={`px-4 py-2 text-center ${isDark ? "text-gray-300" : ""}`}>
                             {trade.symbol?.includes("XAU/USD")
                                ? Number(trade.exit_price).toFixed(3)
                                : Number(trade.exit_price).toFixed(5)}
                          </td>
                          <td className={`px-4 py-2 text-center ${isDark ? "text-gray-300" : ""}`}>
                            {trade.take_profit !== null && trade.take_profit !== 0
                              ? Number(trade.take_profit).toFixed(cleanSymbol === "XAUUSD" ? 3 : 5)
                              : trade.tp_pnl !== null && trade.tp_pnl !== 0
                              ? `${Number(trade.tp_pnl).toFixed(2)} USD`
                              : "-"}
                          </td>
                          <td className={`px-4 py-2 text-center ${isDark ? "text-gray-300" : ""}`}>
                            {trade.stop_loss !== null && trade.stop_loss !== 0
                              ? Number(trade.stop_loss).toFixed(cleanSymbol === "XAUUSD" ? 3 : 5)
                              : trade.sl_pnl !== null && trade.sl_pnl !== 0
                              ? `${Number(trade.sl_pnl).toFixed(2)} USD`
                              : "-"}
                          </td>
                          <td className={`px-4 py-2 text-center ${isDark ? "text-gray-300" : ""}`}>
                            {formatUTC(trade.exit_time)}
                          </td>
                          <td className={`px-4 py-2 text-center ${isDark ? "text-gray-300" : ""}`}>
                            {trade.commission}
                          </td>
                          <td className={`px-4 py-2 text-center ${isDark ? "text-gray-300" : ""}`}>{trade.swap}</td>
                          <td
                            className={`px-4 py-2 text-center font-bold ${
                              trade.pnl >= 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {trade.pnl >= 0 ? `+${trade?.pnl}` : trade?.pnl}
                          </td>
                        </tr>
                      );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p className={`text-center text-sm py-4 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                    No closed trades available
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>


{/* Fixed Bottom Section: Statistics */}
      <div className="flex-shrink-0 z-10">
        {/* Moved: Used Margin to Equity block (preserves calculations and styling) */}
        <div className={`px-4 pb-24 md:pb-2 pt-2 mt-2 border-t z-10 ${isDark ? "bg-[#141D22] border-gray-700" : "bg-white border-gray-200"}`}>
          <div className={`flex items-center gap-4 md:gap-6 flex-wrap gap-y-2 text-sm ${isDark ? 'text-white' : 'text-black'}`}>
            <span className="shrink-0"><span className={`transition-colors duration-300 ${isDark ? dk.label : "text-gray-500"}`}>Used Margin:</span> <span className="font-semibold">{(usedMargin || 0.0).toFixed(2)} USD</span></span>

            <span className="shrink-0"><span className={`transition-colors duration-300 ${isDark ? dk.label : "text-gray-500"}`}>Free Margin:</span> <span className="font-semibold">{(freeMargin).toFixed(2)} USD</span></span>

            <span className="shrink-0"><span className={`transition-colors duration-300 ${isDark ? dk.label : "text-gray-500"}`}>Balance:</span> <span className="font-semibold">{Number(Math.max(0, balance)).toFixed(2)} USD</span></span>

            <span className="shrink-0"><span className={`transition-colors duration-300 ${isDark ? dk.label : "text-gray-500"}`}>Margin Level:</span> <span className="font-semibold">{(marginLevel).toFixed(2)}%</span></span>

      {/* <div className="flex flex-col min-w-[100px]">
  <span className={`text-md transition-colors duration-300 ${isDark ? dk.label : "text-gray-500"}`}>Account level</span>
  <div className={`relative mt-2 h-2.5 rounded-full bg-gradient-to-r transition-colors duration-300 ${isDark ? dk.sliderTrack : "from-red-600 via-yellow-400 to-green-600"}`}>
    <div
      className={`absolute top-1/2 -translate-y-1/2 w-2.5 h-5.5 rounded-full shadow-md transition-colors duration-300 ${isDark ? `${dk.sliderDot} border-2 border-gray-400` : "bg-black border-2 border-gray-100"}`}
      style={{
        left: `${accountLevel}%`,
        transform: "translate(-40%, -1%)"
      }}
    />
  </div>
</div> */}

            <span className="shrink-0"><span className={`transition-colors duration-300 ${isDark ? dk.label : "text-gray-500"}`}>Equity:</span> <span className="font-semibold">{Number(Math.max(0, equity)).toFixed(2)} USD</span></span>
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        {isMobileView && (
          <div className="fixed bottom-0 left-0 right-0 z-50">
            <MobileBottomNav
              currentView={currentView}
              setCurrentView={setCurrentView}
            />
          </div>
        )}
      </div>


      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailView order={selectedOrder} type={tradeTab} />
      )}
      <PopupTab 
      balance={balance}
      />  
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default OrderTables;
