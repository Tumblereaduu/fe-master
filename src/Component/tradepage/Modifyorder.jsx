import React, { useState, useEffect } from "react";
import { X, Plus, Minus, Trash, Trash2 } from "lucide-react";
import axios from "../../services/api";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { BACKEND_API_URL } from "../../api/config";
import { useLivePrice } from "../hooks/tradePage/useLivePriceContext";
const icons = import.meta.glob("../../assets/img/currencypairicon/*.svg", {
  eager: true,
});

const PairIcons = Object.fromEntries(
  Object.entries(icons).map(([path, mod]) => {
    const fileName = path.split("/").pop().replace(".svg", "").toUpperCase();
    return [fileName, mod.default];
  })
);



export default function Modifyorder({ trade, user_id, onSave, onClose }) {
  const [takeProfit, setTakeProfit] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfitPnL, setTakeProfitPnL] = useState("");
  const [stopLossPnL, setStopLossPnL] = useState("");
  const { user, token } = useAuth();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const {livePrices} = useLivePrice();
  const [runningPnL, setRunningPnL] = useState(0);
  const [mode, setMode] = useState("price"); // "price" | "pnl"
  
    const [tpError, setTpError] = useState("");
    const [slError, setSlError] = useState("");
  
    const handleFieldErrors = (message) => {
      const msg = message.toLowerCase();
  
      // reset first
      setTpError("");
      setSlError("");
  
      if (msg.includes("take profit") || msg.includes("tp")) {
        setTpError(message);
      }
  
      if (msg.includes("stop loss") || msg.includes("sl")) {
        setSlError(message);
      }
    };
    

  const cleanSymbol = trade.symbol
  ?.toUpperCase()
  ?.replace("OANDA:", "")
  ?.replace("/", "")
  ?.replace("_", "")
  ?.trim();

  const currentPrice = livePrices?.[cleanSymbol] ?? null;

  useEffect(() => {
    if (!currentPrice || !trade || !livePrices) return;

    // Clean symbol
    const cleanSymbol = trade.symbol
      ?.replace("OANDA:", "")
      .replace("/", "")
      .trim()
      .toUpperCase();

    if (!cleanSymbol) return;

    const isBuy = trade.type?.toUpperCase() === "BUY";
    const entry = Number(trade.entry_price);
    const lot = Number(trade.lot_size);

    // Contract size logic
    const B_PAIR = ["US30USD", "BTCUSD", "ETHUSD"];

    let contractSize = 100000;
    if (cleanSymbol === "XAUUSD" || cleanSymbol === "XPDUSD") contractSize = 100;
    if (cleanSymbol === "XCUUSD") contractSize = 2300;
    if (cleanSymbol === "XAGUSD") contractSize = 5000;
    if (B_PAIR.includes(cleanSymbol)) contractSize = 1;

    // Step 1: Raw PnL (quote currency)
    let rawPnL = 0;

    if (isBuy) {
      rawPnL = (currentPrice - entry) * lot * contractSize;
    } else {
      rawPnL = (entry - currentPrice) * lot * contractSize;
    }

    // Step 2: Convert to USD if needed
    const quote = cleanSymbol.slice(3); // e.g., EURJPY → JPY

    let finalPnL = rawPnL;

    if (quote !== "USD") {
      const direct = livePrices?.[`${quote}USD`];
      const inverse = livePrices?.[`USD${quote}`];

      if (direct) {
        finalPnL = rawPnL * direct;
      } else if (inverse) {
        finalPnL = rawPnL / inverse;
      }
    }

    setRunningPnL(finalPnL);

  }, [currentPrice, trade, livePrices]);

  useEffect(() => {
    if (!trade) return;

    const hasPrice =
      (trade.take_profit !== null && trade.take_profit !== "-" && trade.take_profit !== "") ||
      (trade.stop_loss !== null && trade.stop_loss !== "-" && trade.stop_loss !== "");

    const hasPnL =
      (trade.tp_pnl !== null && trade.tp_pnl !== "-" && trade.tp_pnl !== "") ||
      (trade.sl_pnl !== null && trade.sl_pnl !== "-" && trade.sl_pnl !== "");

    if (hasPrice) {
      setMode("price");   
    } else if (hasPnL) {
      setMode("pnl");
    } else {
      setMode("pnl");    
    }
  }, [trade]);

  useEffect(() => {
    const updatePosition = () => {
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        setPosition({ x: 0, y: 200 });
      } else {
        setPosition({ x: 800, y: 300 });
      }
    };

    updatePosition(); // run on first load

    window.addEventListener("resize", updatePosition);

    return () => window.removeEventListener("resize", updatePosition);
  }, []);
  const handleMouseDown = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };
  

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  });

  useEffect(() => {
    if (trade) {
      setTakeProfit(trade.take_profit !== "-" ? trade.take_profit : "");
      setStopLoss(trade.stop_loss !== "-" ? trade.stop_loss : "");
      setTakeProfitPnL(
        trade.tp_pnl !== "-" && trade.tp_pnl !== null ? trade.tp_pnl : ""
      );
      setStopLossPnL(
        trade.sl_pnl !== "-" && trade.sl_pnl !== null ? trade.sl_pnl : ""
      );
    }
  }, [trade]);

  if (!trade) return null;

  // Helper for increment/decrement
  const adjustValue = (setter, value, step) => {
    const v = parseFloat(value || 0) + step;
    setter(v > 0 ? v.toFixed(2) : "0.00");
  };


const handleModifyOrder = async () => {
  try {
    const token = localStorage.getItem("token");
    const accountType = localStorage.getItem("accountType"); 

    const baseUrl =
      accountType === "LIVE"
        ? `${BACKEND_API_URL}/order/${trade.trade_id}/tp-sl`
        : `${BACKEND_API_URL}/demo/order/${trade.trade_id}/tp-sl`;

    const payload = 
      mode === "price"
        ? {
            user_id: user_id || user?.user_id,
            take_profit: takeProfit !== "" ? takeProfit : undefined,
            stop_loss: stopLoss !== "" ? stopLoss : undefined,
            symbol: trade.symbol
          }
        : {
            user_id: user_id || user?.user_id,
            tp_pnl: takeProfitPnL !== "" ? takeProfitPnL : undefined,
            sl_pnl: stopLossPnL !== "" ? stopLossPnL : undefined,
            symbol: trade.symbol
          };

    const response = await axios.put(`${baseUrl}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Backend success message
    toast.success(response.data.message || "TP/SL updated successfully");

    // Update UI instantly
    onSave({
      ...trade,
      take_profit: takeProfit || null,
      stop_loss: stopLoss  || null,
      tp_pnl: takeProfitPnL || null,
      sl_pnl: stopLossPnL || null,
    });
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
    onClose();
  } catch (err) {
    console.error("Failed to modify order:", err);

    // Backend error message → show as toast
    const errorMsg =
      err.response?.data?.message ||
      "Failed to upd2ate TP/SL";

    toast.error(errorMsg);
    handleFieldErrors(errorMsg);
  }
};

const handleRemoveTpSl = async (type) => {
  
  let newTp = takeProfit;
  let newSl = stopLoss;
  let newTpPnL = takeProfitPnL;
  let newSlPnL = stopLossPnL;

  if (type === "tp || tp_pnl") { newTp = null; newTpPnL = null; }
  if (type === "sl || sl_pnl") { newSl = null; newSlPnL = null; }

  setTakeProfit(newTp);
  setStopLoss(newSl);
  setTakeProfitPnL(newTpPnL);
  setStopLossPnL(newSlPnL);

  try {
      const token = localStorage.getItem("token");
      const accountType = localStorage.getItem("accountType");

      const baseurl =
      accountType === "LIVE"
      ? `${BACKEND_API_URL}/order/remove/${trade.trade_id}/tp-sl`
      : `${BACKEND_API_URL}/demo/order/remove/${trade.trade_id}/tp-sl`;

      const payload = {
        user_id: user_id || user?.user_id,
        take_profit: newTp,
        stop_loss: newSl,
        tp_pnl: newTpPnL,
        sl_pnl: newSlPnL
      };

      const response = await axios.put(`${baseurl}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Backend success message
      toast.success(response.data.message || `${type.toUpperCase()} removed successfully`);

      // Update UI instantly  
      onSave({
        ...trade,
        take_profit: newTp,
        stop_loss: newSl,
        tp_pnl: newTpPnL,
        sl_pnl: newSlPnL
      }); 
    // toast.log(`${type} removed success`);

  } catch (err) {
    console.log("REMOVE ERROR:", err.response?.data);
  }
};

  return (
    <div
      className="fixed inset-0 bg-black/20 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-[400px] max-w-full rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
          onMouseDown={handleMouseDown}
          style={{
            position: "absolute",
            left: position.x,
            top: position.y,
            cursor: dragging ? "grabbing" : "grab",
          }}
      >
      {/* Top Row: Symbol + Lots + PnL */}
      <div className="flex justify-between items-center px-4 py-4 border-b">
          <div className="flex items-center gap-3">
            <img
              src={PairIcons[cleanSymbol]}
              alt={trade.symbol}
              className="w-10 h-10"
            />

            <div className="flex flex-col">
              {/* Symbol + Lots */}
              <div className="flex gap-1 space-y-1 items-center">
                <span className="font-bold text-black text-lg">{trade.symbol}</span>
                <span className="text-[11px] text-gray-700">{Number(trade.lot_size).toString()} Lots</span>
              </div>

              {/* BUY at price */}
              <span className="text-[12px] text-gray-700">
                {trade.type?.toUpperCase()} at {Number(trade.entry_price).toFixed(3)}
              </span>
            </div>
          </div>

        <div className=" mt-2">
        {/* PnL */}
        {trade.order_status === "active" && (
        <p
          className={`text-sm font-bold -mb-6 ml-11 ${
            runningPnL >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {runningPnL >= 0 ? "+" : ""}
          {runningPnL.toFixed(2)} USD
        </p>
        )}
        <p className="text-[13px] text-gray-900 mt-7">
          CMP: {currentPrice !== null ? Number(currentPrice).toFixed(5) : "-"}
        </p>
        </div>
          <button
              onClick={onClose}
              className="mb-8"
            >
           <X size={15} />
          </button>
      </div>

        {/* Modify divider */}
        <div className="text-center ml-11">
          <p className=" text-xl text-black font-medium mt-2 w-75">Modify</p>
        </div>

        {/* <div className="flex justify-center">
          <div className="flex bg-gray-100 rounded-lg p-1 w-full max-w-xs">
            
            <button
              onClick={() => setMode("price")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
                mode === "price"
                  ? "bg-white shadow text-black"
                  : "text-gray-500"
              }`}
            >
              Price
            </button>

            <button
              onClick={() => setMode("pnl")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
                mode === "pnl"
                  ? "bg-white shadow text-black"
                  : "text-gray-500"
              }`}
            >
              USD
            </button>

          </div>
        </div> */}

        {mode === "pnl" && (
          <p className="text-[10px] text-red-500 text-center mt- -mb-3.5">
            Enter profit/loss in USD
          </p>
        )}

        {/* Editable Section */}
        <div className="px-5 py-3 space-y-5">
          {/* Take Profit */}
          <div>
            <label className="block text-sm text-black mb-1">Take Profit</label>

            <div className="flex items-center gap-2 w-full">

              {/* Input + controls */}
              <div className="flex flex-1 items-center border border-gray-400 rounded-md overflow-hidden min-w-0">

                {/* Input */}
                <input
                  type="number"
                  value={mode === "price" ? takeProfit ?? "" : takeProfitPnL ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;

                    if (mode === "price") {
                      setTakeProfit(val === "" ? null : parseFloat(val));
                    } else {
                      setTakeProfitPnL(val === "" ? null : parseFloat(val));
                    }
                  }}
                  placeholder="Not set"
                  className="flex-1 min-w-0 px-3 py-1.5 outline-none"
                />

                  {mode === "pnl" && (
                        <span className="px-2 py-1.5 text-xs text-black ">
                          USD
                      </span>
                    )}

                {/* Dropdown */}
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="px-1 py-2 text-xs border-l border-gray-400 outline-none bg-white shrink-0"
                >
                  <option value="pnl">In Money</option>
                  <option value="price">Asset price</option>
                </select>

                {/* Minus */}
                <button
                  onClick={() =>
                    mode === "price"
                      ? adjustValue(setTakeProfit, takeProfit ?? 0, -0.01)
                      : adjustValue(setTakeProfitPnL, takeProfitPnL ?? 0, -1)
                  }
                  className="px-3 py-2 border-l border-gray-400 hover:bg-gray-100 shrink-0"
                >
                  <Minus size={14} />
                </button>

                {/* Plus */}
                <button
                  onClick={() =>
                    mode === "price"
                      ? adjustValue(setTakeProfit, takeProfit ?? 0, 0.01)
                      : adjustValue(setTakeProfitPnL, takeProfitPnL ?? 0, 1)
                  }
                  className="px-3 py-2 border-l border-gray-400 hover:bg-gray-100 shrink-0"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Delete button */}
              {/* {(takeProfit !== null && takeProfit !== "") || (takeProfitPnL !== null && takeProfitPnL !== "") ? ( */}
                <button
                  onClick={() => {
                              setTakeProfit(null);
                              setTakeProfitPnL(null);
                            }}
                  className="p-1 rounded hover:bg-gray-200 transition"
                >
                  <Trash2 size={15} />
                </button>
              {/*  ) : null} */}

            </div>
            {tpError && (
              <p className="text-red-500 text-sm mt-1">{tpError}</p>
            )}
          </div>

          {/* Stop Loss */}
          <div>
            <label className="block text-sm text-black mb-1">Stop Loss</label>

            <div className="flex items-center gap-2 w-full">

              {/* Input + controls */}
              <div className="flex flex-1 items-center border border-gray-400 rounded-md overflow-hidden min-w-0">

                {/* Input */}
                <input
                  type="number"
                  value={mode === "price" ? stopLoss ?? "" : stopLossPnL ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;

                    if (mode === "price") {
                      setStopLoss(val === "" ? null : parseFloat(val));
                    } else {
                      setStopLossPnL(val === "" ? null : parseFloat(val));
                    }
                  }}
                  placeholder="Not set"
                  className="flex-1 min-w-0 px-3 py-1.5 outline-none"
                />

                  {mode === "pnl" && (
                      <span className="px-2 py-1.5 text-xs text-black ">
                        USD
                      </span>
                  )}

                {/* Dropdown */}
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="px-1 py-2 text-xs border-l border-gray-400 outline-none bg-white shrink-0"
                >
                  <option value="pnl">In Money</option>
                  <option value="price">Asset price</option>
                </select>

                {/* Minus */}
                <button
                  onClick={() =>
                    mode === "price"
                      ? adjustValue(setStopLoss, stopLoss ?? 0, -0.01)
                      : adjustValue(setStopLossPnL, stopLossPnL ?? 0, -1)
                  }
                  className="px-3 py-2 border-l border-gray-400 hover:bg-gray-100 shrink-0"
                >
                  <Minus size={14} />
                </button>

                {/* Plus */}
                <button
                  onClick={() =>
                    mode === "price"
                      ? adjustValue(setStopLoss, stopLoss ?? 0, 0.01)
                      : adjustValue(setStopLossPnL, stopLossPnL ?? 0, 1)
                  }
                  className="px-3 py-2 border-l border-gray-400 hover:bg-gray-100 shrink-0"
                >
                  <Plus size={14} />
                </button>

              </div>

              {/* Delete button */}
              {/* {(stopLoss !== null && stopLoss !== "") || (stopLossPnL !== null && stopLossPnL !== "") ? ( */}
                <button
                  onClick={() =>{
                      setStopLoss(null);
                      setStopLossPnL(null);
                  }}
                  className="p-1 rounded hover:bg-gray-200 transition"
                >
                  <Trash2 size={15} />
                </button>
              {/* ) : null} */}

            </div>
            {slError && (
              <p className="text-red-500 text-sm mt-1">{slError}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-5">
          <button
            onClick={handleModifyOrder}            
            className="w-full py-3 bg-[#F7931A] text-white rounded-md hover:bg-[#F7820A] font-medium"
          >
            Modify Position
          </button>
        </div>
      </div>
    </div>
  );
}