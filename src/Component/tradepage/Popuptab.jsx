import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus } from "lucide-react";
import toast from "react-hot-toast";
import { submitOrderToServer } from "../../api/trade/order";
import { useAuth } from "../context/AuthContext";
import { useMarginStore } from "./marginStore";
import { useLivePrice } from "../hooks/tradePage/useLivePriceContext";
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

export default function PopupTab({
  open,
  onClose,
  symbol,
  initialSide = "BUY",
}) {
  const [side, setSide] = useState(initialSide);
  const [tab, setTab] = useState("market");
  const [lot, setLot] = useState("");
  const [tp, setTP] = useState("");
  const [sl, setSL] = useState("");
  const [tp_pnl, setTpPnl] = useState("");
  const [sl_pnl, setSlPnl] = useState(-10);
  const [showTP, setShowTP] = useState(false);
  const [showSL, setShowSL] = useState(false);
  const [trigger, setTrigger] = useState(0);
  const [currentPrice, setCurrentPrice] = useState([]);
  const { user, token } = useAuth();
  const { livePrices } = useLivePrice();
  const { isDark } = useTheme();
  const [tpMode, setTpMode] = useState("pnl");
  const [slMode, setSlMode] = useState("pnl");

  const [tpError, setTpError] = useState("");
  const [slError, setSlError] = useState("");

  const handleFieldErrors = (message) => {
    const msg = message.toLowerCase();

    // reset first
    setTpError("");
    setSlError("");

    if (msg.includes("take profit") || msg.includes("tp")) {
      setTpError(message);
      setShowTP(true); // auto open TP field
    }

    if (msg.includes("stop loss") || msg.includes("sl")) {
      setSlError(message);
      setShowSL(true); // auto open SL field
    }
  };
  
  const freeMargin = useMarginStore((s) => s.freeMargin);

const normalizedSymbol = (s) => s ?.replace("OANDA:", "") ?.replace("ONA:","")?.replace("BINANCE:", "")?.replace("CRYPTO:", "")?.replace("GMC:", "")?.replace("/", "")?.toUpperCase(); // To display live price 

useEffect(()=>{
  if(!symbol || !livePrices) return;

  const clean = normalizedSymbol(symbol);
  let price = livePrices[clean];

  if(!price && clean === 'BTCUSD'){
    price = livePrices['BTCUSDT']
  }
  if (price){
    setCurrentPrice(price)
  }
},[symbol, livePrices])

  let normalizedLot = lot;
  const BINANCE_PAIR = ["BTCUSD","ETHUSD", "US30USD"];
  // const BTC_PRCE =["BTCUSD"]
  const rawSymbol = symbol ?.replace("ONA:", "")?.replace("BINANCE:", "")?.replace("GMC:", "")?.replace("CRYPTO:", "")?.replace("/", "");

 const LEVERAGE = 100;
 let CONTRACT_SIZE = 100000;
 if(rawSymbol === "XAUUSD" || rawSymbol === 'XPDUSD' || rawSymbol === 'XPTUSD') CONTRACT_SIZE = 100;
 if(rawSymbol === 'XCUUSD') CONTRACT_SIZE = 2300;
 if(rawSymbol === 'XAGUSD') CONTRACT_SIZE = 5000;
 if(rawSymbol === 'DXY' || rawSymbol ==='USOIL'|| rawSymbol ==='UKOIL') CONTRACT_SIZE = 1000;
 if(BINANCE_PAIR.includes(rawSymbol)) CONTRACT_SIZE = 1;

  const price = currentPrice || 1;

  let marginQuote = (Number(normalizedLot || 0) * CONTRACT_SIZE * Number(price || 0)) / LEVERAGE;

  const quote = symbol?.split(":").pop()?.replace("/", "").slice(3).toUpperCase();
  if (quote && quote !== "USD") {
    const rate = livePrices?.["USD" + quote] ?? (livePrices?.[quote + "USD"] ? 1 / livePrices?.[quote + "USD"] : null);

    if (rate) {
      marginQuote = marginQuote / Number(rate);
    } else {
      console.log("Missing conversion pair for", quote);
    }
  }

  const requiredMargin = +marginQuote.toFixed(3);
  const availableMargin = +freeMargin.toFixed(3);
  const PRICE_STEP = 0.01;
  // -----------------------

  const getLotConfig = (symbol) => {
    if (!symbol) return { mini: 0.01, steps: 0.01 };

    const pair = symbol.split(":").pop().toUpperCase();

    if (pair === "ETHUSD" || pair === "ETH/USD") {
      return { mini: 0.1, steps: 0.1 };
    }

    return { mini: 0.01, steps: 0.01 };
  };

  // AFTER function
  const { mini, steps } = getLotConfig(symbol);

  const handleModeChange = (mode) => {
  setTpMode(mode);
  setSlMode(mode);
};


  useEffect(() => {
    if (open) {
      setSide(initialSide);
      setTab("market");
      setLot(mini);
      setTP("");
      setSL("");
      setTpPnl("");
      setSlPnl("");
      setShowTP(false);
      setShowSL(false);
      setTrigger(); // Reset trigger as well
    }
  }, [open, initialSide]);

  const cleanSymbol = symbol ?.replace("ONA:", "")?.replace("BINANCE:", "")?.replace("GMC:", "")?.replace("CRYPTO:", "")?.replace("/", "") ?.trim(); // FOR Icons to dispaly

const handleLotChange = (e) => {
  const value = e.target.value;
  setLot(value); // Always store as string while typing
    if (value === "") {
    setLot("");
    return;
  }
  const numericValue = Number(value);
  if (isNaN(numericValue)) return;
  // Prevent value below 0.01
  if (numericValue < 0.01) return;
  setLot(value);
};

const handleTriggerChange = (e) => {
  const value = e.target.value;
  setTrigger(value); // always store raw input string
};

const handleTriggerBlur = () => {
  const num = parseFloat(trigger);

  if (!isNaN(num) && num >= 0.01) {
    setTrigger(num.toFixed(5));
  } else {
    setTrigger(""); // Reset if invalid
  }
};


  // --- MODIFIED HANDLERS TO USE LOT_STEP/PRICE_STEP ---
  const handleLotIncrement = () =>
    setLot((p) => +((parseFloat(p) || 0) + steps).toFixed(2)); // Keeps lot size to 2 decimal places
  const handleLotDecrement = () =>
    setLot((p) =>
      Math.max(mini, +((parseFloat(p) || 0) - steps).toFixed(2))
    ); // Minimum lot size of 0.01

  const handleTriggerIncrement = () =>
    setTrigger((p) => +((parseFloat(p) || 0) + PRICE_STEP).toFixed(5)); // Use 5 decimals for price, adjust as needed
  const handleTriggerDecrement = () =>
    setTrigger((p) =>
      Math.max(0.01, +((parseFloat(p) || 0) - PRICE_STEP).toFixed(5))
    );

  const handleTPIncrement = () =>
    setTP((p) => +((parseFloat(p) || 0) + PRICE_STEP).toFixed(5));
  const handleTPDecrement = () =>
    setTP((p) => Math.max(0.0, +(parseFloat(p || 0) - PRICE_STEP).toFixed(5))); // Ensure TP >= 0

  const handleSLIncrement = () =>
    setSL((p) => +((parseFloat(p) || 0) + PRICE_STEP).toFixed(5));
  const handleSLDecrement = () =>
    setSL((p) => Math.max(0.0, +(parseFloat(p || 0) - PRICE_STEP).toFixed(5))); // Ensure SL >= 0
  // ----------------------------------------------------

  const [loading, setLoading] = useState(false);
  // inside component where you handle place order
const handlePlaceOrderClick = async () => {
  if (loading) return;

  // Frontend validation
  if (!lot || Number(lot) < mini) {
    toast.error("Enter a valid lot size",  { duration: 1500 });
    return;
  }

  if (availableMargin < requiredMargin || requiredMargin <=0) {
    toast.error("Insufficient margin", { duration: 1500 });
    onClose();
    return;
  }

  if (tab === "limit" && (!trigger || Number(trigger) <= 0)) {
    toast.error("Enter a valid trigger price for limit orders", { duration: 2000 } );
    return;
  }

  // Prepare payload
  const payload = {
    symbol: symbol?.replace("ONA:", "").replace("/", ""),
    type: side.toUpperCase(),
    order_type: tab,
    lot_size: Number(lot),

    ...(tpMode === "price" && tp ? { take_profit: Number(tp) } : {}),
    ...(slMode === "price" && sl ? { stop_loss: Number(sl) } : {}),

    ...(tpMode === "pnl" && tp_pnl ? { tp_pnl: Number(tp_pnl) } : {}),
    ...(slMode === "pnl" && sl_pnl ? { sl_pnl: Number(sl_pnl) } : {}),

    ...(tab === "limit" ? { trigger_price: Number(trigger) } : {}),
    ...(tab === "advanced" ? { trigger_price: Number(trigger) } : {}),
  };

  try {
    setLoading(true);

    await new Promise((res) => setTimeout(res, 1000)); // 1s loading effect

    const token = localStorage.getItem("token");
    const result = await submitOrderToServer(payload, token);

    // Backend success
    if (result.status === "success") {
      toast.success(result.message || "Order placed successfully!");
      onClose();
    } else {
      // Backend ERROR message (including trigger price validation)
      const msg = result.message || "Failed to place order";
      toast.error(msg);
      handleFieldErrors(msg);
    }
  } catch (err) {
    console.error("Order Place Error:", err);

  const backendData = err.response?.data;

    //  Get spread cost
    const spreadCost = backendData?.data?.spreadCostUsd;

    //  Set it to SL automatically
    if (spreadCost) {
      const buffer = 0.01; 
      const finalSl = -(Number(spreadCost) + buffer).toFixed(3); 

      setSlPnl(finalSl);
    }
    // Backend validation message inside catch block
    const backendMessage =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "Unknown error";

    toast.error(backendMessage);
    handleFieldErrors(backendMessage);

  } finally {
    setLoading(false);
  }
};

  return (
  <>
    {open && (
      <div className="inset-0 z-40 flex md:overflow-auto pb-30">

        {/* Overlay */}
        <div
          className="flex-1"
          onClick={onClose}
        />

          <motion.div
            initial={{ x: "0%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25 }}
            className={`w-full md:w-[380px] max-w-full h-full ${
              isDark ? "bg-[#141D22]" : "bg-white"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-1.5">
              <div className="flex items-center space-x-3">
                <img
                  src={PairIcons[cleanSymbol]}
                  alt={symbol}
                  className="w-7 h-7"
                />
                <div>
                  <div
                    className={`text-md font-bold ${
                      isDark ? "text-white" : "text-black"
                    }`}
                  >
                    {symbol?.split(":").pop()}
                  </div>
                  <div
                    className={`text-[11px] ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    } flex items-center`}
                  >
                    Current price:
                    <span className="ml-1 font-semibold text-green-600">
                      {currentPrice || []}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className={`mb-4 rounded-full ${
                  isDark ? "text-white" : ""
                }`}
              >
                <X size={20} />
              </button>
            </div>

            <div
              className={`flex border-b md:text-xs xl:text-sm ${
                isDark ? "border-gray-700" : "border-gray-300"
              }`}
            >
              <button
                onClick={() => setTab("market")}
                className={`flex-1 py-3 text-center font-bold ${
                  tab === "market"
                    ? isDark
                      ? "border-b-2 border-gray-400 text-gray-300"
                      : "border-b-2 border-blue-400 text-blue-500"
                    : isDark
                    ? "text-gray-500"
                    : "text-gray-700"
                }`}
              >
                Market
              </button>

              <button
                onClick={() => setTab("advanced")}
                className={`flex-1 py-3 text-center font-bold ${
                  tab === "advanced"
                    ? isDark
                      ? "border-b-2 border-gray-400 text-gray-300"
                      : "border-b-2 border-blue-400 text-blue-500"
                    : isDark
                    ? "text-gray-500"
                    : "text-gray-700"
                }`}
              >
                {side === "BUY" ? "Buy Above" : "Sell Below"}
              </button>

              <button
                onClick={() => setTab("limit")}
                className={`flex-1 py-3 text-center font-bold ${
                  tab === "limit"
                    ? isDark
                      ? "border-b-2 border-gray-400 text-gray-300"
                      : "border-b-2 border-blue-400 text-blue-500"
                    : isDark
                    ? "text-gray-500"
                    : "text-gray-700"
                }`}
              >
                {side === "BUY" ? "Buy Below" : "Sell Above"}
              </button>
            </div>

            <div className="">
              <div className="px-1.5 md:py-1 xl:py-4 md:space-y-2 xl:space-y-5 ">
                {(tab === "market" || tab === "limit") && (
                  <>
                    {tab === "limit" && (
                      <div>
                        <label
                          className={`text-xs font-bold ${
                            isDark ? "text-gray-300" : "text-gray-900"
                          }`}
                        >
                          Open Price
                        </label>
                        <div
                          className={`w-full flex mt-1 border rounded-lg overflow-hidden ${
                            isDark ? "border-gray-600" : "border-gray-400"
                          }`}
                        >
                          <input
                            value={trigger}
                            onChange={handleTriggerChange}
                            type="number"
                            min="0.01"
                            onBlur={handleTriggerBlur}
                            step={PRICE_STEP}
                            className={`w-full px-2 py-1.5 text-center outline-none border-none ${
                              isDark ? "bg-transparent text-white" : ""
                            }`}
                          />
                          <button
                            onClick={handleTriggerDecrement}
                            className={`px-2 py-1.5 border-l flex items-center justify-center ${
                              isDark
                                ? "border-gray-600 text-gray-300"
                                : "border-gray-400"
                            }`}
                          >
                            <Minus size={12} />
                          </button>
                          <button
                            onClick={handleTriggerIncrement}
                            className={`px-2 py-1.5 border-l flex items-center justify-center ${
                              isDark
                                ? "border-gray-600 text-gray-300"
                                : "border-gray-400"
                            }`}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    )}

                    <div>
                      <label
                        className={`text-xs font-bold ${
                          isDark ? "text-gray-300" : "text-gray-900"
                        }`}
                      >
                        Lot Size
                      </label>
                      <div
                        className={`flex mt-1 border rounded-lg overflow-hidden ${
                          isDark ? "border-gray-600" : "border-gray-400"
                        }`}
                      >
                        <input
                          value={lot}
                          onChange={(e) => {
                            const value = e.target.value;

                            // Allow empty value, integers, and up to 2 decimal places
                            if (/^\d*\.?\d{0,2}$/.test(value)) {
                              setLot(value);
                            }
                          }}
                          type="text"
                          inputMode="decimal"
                          min={mini}
                          step={steps}
                          className={`w-full px-3 py-1.5 text-center outline-none border-none ${
                            isDark ? "bg-transparent text-white" : ""
                          }`}
                        />
                        <button
                          onClick={handleLotDecrement}
                          className={`px-2 py-1.5 border-l flex items-center justify-center ${
                            isDark
                              ? "border-gray-600 text-gray-300"
                              : "border-gray-400"
                          }`}
                        >
                          <Minus size={12} />
                        </button>
                        <button
                          onClick={handleLotIncrement}
                          className={` px-2 py-1.5 border-l flex items-center justify-center ${
                            isDark
                              ? "border-gray-600 text-gray-300"
                              : "border-gray-400"
                          }`}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        className={`text-xs font-bold ${
                          isDark ? "text-gray-300" : "text-gray-900"
                        }`}
                      >
                        Take Profit
                      </label>
                      {!showTP ? (
                        <button
                          onClick={() => setShowTP(true)}
                          className={`w-full flex justify-between items-center px-3 py-2 rounded-lg text-sm font-medium mt- ${
                            isDark
                              ? "bg-[#141D22] border border-gray-700 text-gray-400"
                              : "bg-gray-100 border border-white/10 text-gray-600"
                          }`}
                        >
                          Take Profit
                          <Plus
                            size={16}
                            className="text-white bg-blue-400 rounded-2xl"
                          />
                        </button>
                      ) : (
                        <div
                          className={`flex mt-1 border rounded-lg overflow-hidden ${
                            isDark ? "border-gray-600" : "border-gray-400"
                          }`}
                        >
                          <input
                            value={tpMode === "price" ? tp : tp_pnl}
                            onChange={(e) => {
                              const val = e.target.value;
                              setTpError("");
                              if (tpMode === "price") setTP(val);
                              else setTpPnl(val);
                            }}
                            type="number"
                            min="0"
                            placeholder="Not Set"
                            className={`flex-1 py-2 text-center outline-none border-none min-w-0 text-xs ${
                              isDark ? "bg-transparent text-white" : ""
                            }`}
                          />

                          {tpMode === "pnl" && (
                            <span
                              className={`px-1.5 py-3 items-center text-[11px] ${
                                isDark ? "text-gray-300" : "text-black"
                              }`}
                            >
                              USD
                            </span>
                          )}

                          <select
                            value={tpMode}
                            onChange={(e) => handleModeChange(e.target.value)}
                            className={`px-0 py-1.5 text-[11px] border-l outline-none ${
                              isDark
                                ? "border-gray-600 bg-[#252540] text-gray-300"
                                : "border-gray-400 bg-white"
                            }`}
                          >
                            <option value="pnl">In Money</option>
                            <option value="price">Asset Price</option>
                          </select>

                          <button
                            onClick={handleTPDecrement}
                            className={`px-2 border-l ${
                              isDark
                                ? "border-gray-600 text-gray-300"
                                : "border-gray-400"
                            }`}
                          >
                            <Minus size={12} />
                          </button>

                          <button
                            onClick={handleTPIncrement}
                            className={`px-2 border-l ${
                              isDark
                                ? "border-gray-600 text-gray-300"
                                : "border-gray-400"
                            }`}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      )}
                      {tpError && (
                        <p className="text-red-500 text-sm mt-1">{tpError}</p>
                      )}
                    </div>

                    <div>
                      <label
                        className={`text-xs font-bold ${
                          isDark ? "text-gray-300" : "text-gray-900"
                        }`}
                      >
                        Stop Loss
                      </label>
                      {!showSL ? (
                        <button
                          onClick={() => setShowSL(true)}
                          className={`w-full flex justify-between items-center px-3 py-2 rounded-lg text-sm font-medium mt-1 ${
                            isDark
                              ? "bg-[#141D22] border border-gray-700 text-gray-400"
                              : "bg-gray-100 border border-white/10 text-gray-600"
                          }`}
                        >
                          Stop Loss
                          <Plus
                            size={16}
                            className="text-white bg-blue-400 rounded-2xl"
                          />
                        </button>
                      ) : (
                        <div
                          className={`flex mt-1 border rounded-lg overflow-hidden ${
                            isDark ? "border-gray-600" : "border-gray-400"
                          }`}
                        >
                          <input
                            value={slMode === "price" ? sl : sl_pnl}
                              onChange={(e) => {
                              let val = e.target.value;

                              setSlError("");

                              if (slMode === "price") {
                                // Price mode: allow normal positive decimal value
                                val = val.replace(/[^0-9.]/g, "");
                                setSL(val);
                              } else {
                                // PnL mode: always store as a negative value
                                val = val.replace(/[^0-9.]/g, "");

                                if (val !== "") {
                                  val = `-${val}`;
                                }

                                setSlPnl(val);
                              }
                            }}
                            type="text"
                            inputMode="decimal"
                            placeholder="Not Set"
                            className={`flex-1 py-2 text-center outline-none border-none min-w-0 text-xs ${
                              isDark ? "bg-transparent text-white" : "text-black"
                            }`}
                          />
                          {slMode === "pnl" && (
                            <span
                              className={`px-1.5 py-3 items-center text-[11px] ${
                                isDark ? "text-gray-300" : "text-black"
                              }`}
                            >
                              USD
                            </span>
                          )}

                          <select
                            value={slMode}
                            onChange={(e) => handleModeChange(e.target.value)}
                            className={`px-0 py-1.5 text-[11px] border-l outline-none ${
                              isDark
                                ? "border-gray-600 bg-[#252540] text-gray-300"
                                : "border-gray-400 bg-white"
                            }`}
                          >
                            <option value="pnl">In Money</option>
                            <option value="price">Asset Price</option>
                          </select>

                          <button
                            onClick={handleSLDecrement}
                            className={`px-2 border-l ${
                              isDark
                                ? "border-gray-600 text-gray-300"
                                : "border-gray-400"
                            }`}
                          >
                            <Minus size={12} />
                          </button>

                          <button
                            onClick={handleSLIncrement}
                            className={`px-2 border-l ${
                              isDark
                                ? "border-gray-600 text-gray-300"
                                : "border-gray-400"
                            }`}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      )}
                      {slError && (
                        <p className="text-red-500 text-sm mt-1">{slError}</p>
                      )}
                    </div>
                  </>
                )}

                {tab === "advanced" && (
                  <div className="grid grid-cols-1  md:space-y-2 xl:space-y-5">
                    <div className="space-y-2">
                      <div>
                        <label
                          className={`text-xs font-bold ${
                            isDark ? "text-gray-300" : "text-gray-900"
                          }`}
                        >
                          Open Price
                        </label>
                        <div
                          className={`w-full flex mt-1 border rounded-lg overflow-hidden ${
                            isDark ? "border-gray-600" : "border-gray-400"
                          }`}
                        >
                          <input
                            value={trigger}
                            type="number"
                            min="0.01"
                            onChange={handleTriggerChange}
                            step={PRICE_STEP}
                            className={`w-full px-2 py-1.5 text-center outline-none border-none ${
                              isDark ? "bg-transparent text-white" : ""
                            }`}
                          />

                          <button
                            onClick={handleTriggerDecrement}
                            className={`px-2 py-1.5 border-l flex items-center justify-center ${
                              isDark
                                ? "border-gray-600 text-gray-300"
                                : "border-gray-400"
                            }`}
                          >
                            <Minus size={12} />
                          </button>
                          <button
                            onClick={handleTriggerIncrement}
                            className={`px-2 py-1.5 border-l flex items-center justify-center ${
                              isDark
                                ? "border-gray-600 text-gray-300"
                                : "border-gray-400"
                            }`}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label
                          className={`text-xs font-bold ${
                            isDark ? "text-gray-300" : "text-gray-900"
                          }`}
                        >
                          Lot Size
                        </label>
                        <div
                          className={`flex mt-1 border rounded-lg overflow-hidden ${
                            isDark ? "border-gray-600" : "border-gray-400"
                          }`}
                        >
                          <input
                            value={lot}
                            onChange={(e) => {
                              const value = e.target.value;

                              // Allow empty value, integers, and up to 2 decimal places
                              if (/^\d*\.?\d{0,2}$/.test(value)) {
                                setLot(value);
                              }
                            }}
                            type="text"
                            inputMode="decimal"
                            min={mini}
                            step={steps}
                            className={`w-full px-3 py-1.5 text-center outline-none border-none ${
                              isDark ? "bg-transparent text-white" : ""
                            }`}
                          />

                          <button
                            onClick={handleLotDecrement}
                            className={` px-2 py-1.5 border-l flex items-center justify-center ${
                              isDark
                                ? "border-gray-600 text-gray-300"
                                : "border-gray-400"
                            }`}
                          >
                            <Minus size={12} />
                          </button>
                          <button
                            onClick={handleLotIncrement}
                            className={`px-2 py-1.5 border-l flex items-center justify-center ${
                              isDark
                                ? "border-gray-600 text-gray-300"
                                : "border-gray-400"
                            }`}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className=" md:space-y-2 xl:space-y-5 -mt-1">
                      <div>
                        <label
                          className={`flex mt-2.5 text-xs font-bold ${
                            isDark ? "text-gray-300" : "text-gray-900"
                          }`}
                        >
                          Take Profit
                        </label>
                        {!showTP ? (
                          <button
                            onClick={() => setShowTP(true)}
                            className={`w-full flex justify-between items-center px-3 py-2 rounded-lg text-sm font-medium mt-0.5 ${
                              isDark
                                ? "bg-[#141D22] border border-gray-700 text-gray-400"
                                : "bg-gray-100 border border-white/10 text-gray-600"
                            }`}
                          >
                            Take Profit
                            <Plus
                              size={16}
                              className="text-white bg-blue-400 rounded-2xl"
                            />
                          </button>
                        ) : (
                          <div
                            className={`flex mt-1.5 border rounded-lg overflow-hidden ${
                              isDark ? "border-gray-600" : "border-gray-400"
                            }`}
                          >
                            <input
                              value={tpMode === "price" ? tp : tp_pnl}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTpError("");
                                if (tpMode === "price") setTP(val);
                                else setTpPnl(val);
                              }}
                              type="number"
                              min="0"
                              placeholder="Not Set"
                              className={`flex-1 py-2 text-center outline-none border-none min-w-0 text-xs ${
                                isDark ? "bg-transparent text-white" : ""
                              }`}
                            />

                            {tpMode?.toLocaleLowerCase() === "pnl" && (
                              <span
                                className={`px-1.5 py-3 items-center text-[11px] ${
                                  isDark ? "text-gray-300" : "text-black"
                                }`}
                              >
                                USD
                              </span>
                            )}

                            <select
                              value={tpMode}
                              onChange={(e) => handleModeChange(e.target.value)}
                              className={`py-1 text-[11px] border-l outline-none ${
                                isDark
                                  ? "border-gray-600 bg-[#252540] text-gray-300"
                                  : "border-gray-400 bg-white"
                              }`}
                            >
                              <option value="pnl">In Money</option>
                              <option value="price">Asset Price</option>
                            </select>

                            <button
                              onClick={handleTPDecrement}
                              className={`px-2 border-l ${
                                isDark
                                  ? "border-gray-600 text-gray-300"
                                  : "border-gray-400"
                              }`}
                            >
                              <Minus size={12} />
                            </button>

                            <button
                              onClick={handleTPIncrement}
                              className={`px-2 border-l ${
                                isDark
                                  ? "border-gray-600 text-gray-300"
                                  : "border-gray-400"
                              }`}
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        )}
                        {tpError && (
                          <p className="text-red-500 text-sm mt-1">
                            {tpError}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          className={`text-xs font-bold ${
                            isDark ? "text-gray-300" : "text-gray-900"
                          }`}
                        >
                          Stop Loss
                        </label>
                        {!showSL ? (
                          <button
                            onClick={() => setShowSL(true)}
                            className={`w-full flex justify-between items-center px-3 py-2 rounded-lg text-sm font-medium mt-1 ${
                              isDark
                                ? "bg-[#141D22] border border-gray-700 text-gray-400"
                                : "bg-gray-100 border border-white/10 text-gray-600"
                            }`}
                          >
                            Stop Loss
                            <Plus
                              size={16}
                              className="text-white bg-blue-400 rounded-2xl"
                            />
                          </button>
                        ) : (
                          <div
                            className={`flex mt-1 border rounded-lg overflow-hidden ${
                              isDark ? "border-gray-600" : "border-gray-400"
                            }`}
                          >
                            <input
                              value={slMode === "price" ? sl : sl_pnl}
                                onChange={(e) => {
                                let val = e.target.value;

                                setSlError("");

                                if (slMode === "price") {
                                  // Price mode: allow normal positive decimal value
                                  val = val.replace(/[^0-9.]/g, "");
                                  setSL(val);
                                } else {
                                  // PnL mode: always store as a negative value
                                  val = val.replace(/[^0-9.]/g, "");

                                  if (val !== "") {
                                    val = `-${val}`;
                                  }

                                  setSlPnl(val);
                                }
                              }}
                              type="text"
                              inputMode="decimal"
                              placeholder="Not Set"
                              className={`flex-1 py-2 text-center outline-none border-none min-w-0 text-xs ${
                                isDark ? "bg-transparent text-white" : "text-black"
                              }`}
                            />

                            {slMode === "pnl" && (
                              <span
                                className={`px-1.5 py-3 items-center text-[11px] shrink-0 ${
                                  isDark ? "text-gray-300" : "text-black"
                                }`}
                              >
                                USD
                              </span>
                            )}

                            <select
                              value={slMode}
                              onChange={(e) => handleModeChange(e.target.value)}
                              className={` py-1 text-[11px] border-l outline-none shrink-0 ${
                                isDark
                                  ? "border-gray-600 bg-[#252540] text-gray-300"
                                  : "border-gray-400 bg-white"
                              }`}
                            >
                              <option value="pnl">In Money</option>
                              <option value="price">Asset Price</option>
                            </select>

                        <button onClick={handleSLDecrement} className="px-2 border-l border-gray-400 shrink-0">
                          <Minus size={12} />
                        </button>

                            <button
                              onClick={handleSLIncrement}
                              className={`px-2 border-l shrink-0 ${
                                isDark
                                  ? "border-gray-600 text-gray-300"
                                  : "border-gray-400"
                              }`}
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        )}
                        {slError && (
                          <p className="text-red-500 text-sm mt-1">
                            {slError}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div
                  className={`p- border-t text-xs ${
                    isDark ? "border-gray-700" : "border-gray-300"
                  }`}
                >
                  <div className="grid grid-cols-2 gap-y-4 mt-5">
                    <div
                      className={`text-xs ${
                        isDark ? "text-gray-400" : "text-blue-600"
                      }`}
                    >
                      Required Margin
                    </div>
                    <div
                      className={`text-right font-semibold ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    >
                      ${requiredMargin}
                    </div>

                    <div
                      className={`text-xs ${
                        isDark ? "text-gray-400" : "text-blue-600"
                      }`}
                    >
                      Free Margin
                    </div>
                    <div
                      className={`text-right font-semibold ${
                        availableMargin >= requiredMargin
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      ${availableMargin}
                    </div>

                    <div
                      className={`text-xs ${
                        isDark ? "text-gray-400" : "text-blue-600"
                      }`}
                    >
                      Charges
                    </div>
                    <div
                      className={`text-right font-semibold ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    >
                      $0.00
                    </div>
                  </div>
                </div>

              {/* Action button */}
              <div className="flex justify-center items-center">
                <button
                  // onClick={() => {
                  //   if (!lot || lot <= 0) {
                  //     toast.error("Enter a valid lot size");
                  //     return;
                  //   }
                  //   if (availableMargin < 0) {
                  //     toast.error("Insufficient margin");
                  //     return;
                  //   }
                  //   onPlaceOrder({
                  //     side,
                  //     tab,
                  //     lot,
                  //     tp,
                  //     sl,
                  //     symbol,
                  //     requiredMargin,
                  //     trigger: tab !== "market" ? trigger : null,
                  //   });
                  //   onClose();
                  // }}
                  onClick={handlePlaceOrderClick}
                   disabled={loading}
                  className={`w-full py-2 font-semibold rounded-md mt-1 ${
                    side === "BUY"
                      ? "bg-[#158BF7] text-white hover:bg-[#0F7AE5]"
                      : "bg-[#EA493F] text-white hover:bg-[#D63C33]"
                  } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {loading ? "Placing..." : tab === "market"
                    ? `${side === "BUY" ? "BUY" : "SELL"}`
                    : tab === "limit"
                    ? ` ${side === "BUY" ? "BUY" : "SELL"}`
                    : `${side === "BUY" ? "BUY" : "SELL"}`}
                </button>
              </div>
            </div>
          </div>


        </motion.div>
      </div>
    )}
  </>
  );
}
