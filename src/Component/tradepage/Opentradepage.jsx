import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LayoutGrid, ChevronDown, LogOut, LifeBuoy, MessageSquare, Globe, Users, Download, Wallet } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import TradingViewChart from "./TradingViewChart";
import InstrumentSidebar from "./InstrumentSidebar";
import PopupTab from "./Popuptab";
import Modifyorder from "../../Component/tradepage/Modifyorder";
import OrderTables from "./Ordertables";
import MobileBottomNav from "./MobileBottomNav";
import { useTheme } from "../../context/ThemeContext";
import LogoBlack from "../../assets/img/logo/Doin FX (2).svg";
import LogoYellow from "../../assets/img/logo/Doin FX.svg";
import forexIcon from "../../assets/img/pairicon/forex.svg";
import axios from "../../services/api";
import { symbol } from "framer-motion/client";
import { useAuth } from '../context/AuthContext'
import { BACKEND_API_URL } from "../../api/config";
import DoinSidebar from "../DoinSidebar";
import { useMarginStore } from "./marginStore";
import TechnicalAnalysis from "./TechnicalAnalysis";
import { useLivePrice } from "../hooks/tradePage/useLivePriceContext";

// Import currency pair icons
const icons = import.meta.glob("../../assets/img/currencypairicon/*.svg", {
  eager: true,
});

const PairIcons = Object.fromEntries(
  Object.entries(icons).map(([path, mod]) => {
    const fileName = path.split("/").pop().replace(".svg", "").toUpperCase();
    return [fileName, mod.default];
  })
);

export default function OpenTradePage() {
  //  FIX: use isDark, NOT theme
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // ─── Dark colour tokens ───
  const dk = {
    pageBg: "bg-[#141D22]",
    headerBg: "bg-[#141D22]",
    headerBorder: "border-[#2A3640]",
    card: "bg-[#1A242B]",
    border: "border-[#2A3640]",
    heading: "text-white",
    label: "text-[#8899A6]",
    value: "text-[#E8EDF0]",
    muted: "text-[#6B7B88]",
    dragHandle: "bg-[#2A3640]",
    depositBtn: "bg-[#1A3A2A] text-green-400 hover:bg-[#1F4532]",
    addFundBtn: "bg-[#1A2A3A] text-blue-400 hover:bg-[#1F3248]",
    userCircle: "bg-[#2A2A1A]",
    badgeReal: "bg-[#1A3A2A] text-green-400",
    badgeDemo: "bg-[#1A2A3A] text-blue-400",
    accountBadgeReal: "bg-green-900/40 text-green-400",
    accountBadgeDemo: "bg-blue-900/40 text-blue-400",
    modalBg: "bg-[#1A242B]",
    modalOverlay: "bg-black/60",
    sliderTrack: "from-red-700 via-yellow-500 to-green-600",
    sliderDot: "bg-white border-[#2A3640]",
  };

  // ─── Blue nav theme tokens (Image 2 style) ───
  const blueNav = {
    headerBg: "bg-[#FFFFFF]",
    headerBorder: "border-blue-300",
    textPrimary: "text-[#1877F2]",
    textSecondary: "text-[#1877F2]/70",
    dropdownBg: "bg-[#FFFFFF]",
    dropdownBorder: "border-blue-300",
    dropdownHover: "hover:bg-blue-100",
    dropdownText: "text-[#1877F2]",
    accountBadge: "bg-[#1877F2]/10 text-[#1877F2]",
    iconBg: "bg-[#1877F2]/10",
    iconColor: "text-[#1877F2]",
    chevronColor: "text-[#1877F2]",
    balanceText: "text-[#1877F2]",
    depositBtn: "bg-[#1877F2] text-white hover:bg-[#1565D8]",
    actionBtnBg: "bg-blue-100 text-[#1877F2] hover:bg-blue-200",
    switchBtnBg: "bg-blue-50 text-[#1877F2] hover:bg-blue-100",
    topUpBtnBg: "bg-[#1877F2] text-white hover:bg-blue-600",
    dividerBorder: "border-blue-200",
    labelMuted: "text-[#1877F2]/60",
    valueText: "text-[#1877F2]",
  };

  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [currentView, setCurrentView] = useState("chart");

  // Navbar Dropdown States
  const [isAccountInfoOpen, setIsAccountInfoOpen] = useState(false);
  const [isGridMenuOpen, setIsGridMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  //  UPDATE: State to handle balance visibility
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  // Height State
  //  UPDATE: Default to a taller chart height (Image 2 style) by using viewport height calculation.
  // Ensures the chart occupies more screen space by default, while keeping a minimum safe height.
 const getInitialChartHeight = () => {
  if (window.innerWidth >= 1536) {
    return 460; // 2xl
  }

  return 350; // mobile, md, lg, xl
};
  const [chartHeight, setChartHeight] = useState(getInitialChartHeight);
  
  //  DRAG STATE: Used to show/hide the protective overlay
  const [isDragging, setIsDragging] = useState(false);

  const [selectedSymbol, setSelectedSymbol] = useState("ONA:XAUUSD");
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisSymbol, setAnalysisSymbol] = useState("OANDA:XAUUSD");
  const [activeTab, setActiveTab] = useState("favourites");
  const [tradeTab, setTradeTab] = useState("open");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [modalSymbol, setModalSymbol] = useState(selectedSymbol);
  const [modalCurrentPrice, setModalCurrentPrice] = useState(0);
  const [modalInitialSide, setModalInitialSide] = useState("BUY");
  const [showModify, setShowModify] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [openCategory, setOpenCategory] = useState(null);
  const [openMobileItem, setOpenMobileItem] = useState(null);
  const [showSidebarMobile, setShowSidebarMobile] = useState(isMobileView);
  const [spreadPairs, setSpreadPairs] = useState([]);
  const [marketClosedPopup, setMarketClosedPopup] = useState(false);
  const { livePrices, allPairs } = useLivePrice();

  const [favorites, setFavorites] = useState([]);
  const [accountType, setAccountType] = useState(() => { return localStorage.getItem("accountType") || "LIVE"; });

  const { user, token } = useAuth();
  const user_id = user?.user_id;

  const isDraggingRef = useRef(false);

  useEffect(() => {
    if (!user?.user_id || !token) return;

    const fetchFavorites = async () => {
      try {
        const res = await fetch(
          `${BACKEND_API_URL}/favourites/user/${user.user_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setFavorites(data.favorites || []);
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
      }
    };

    fetchFavorites();
  }, [user, token]);

  const [openTrades, setOpenTrades] = useState([]);

  useEffect(() => {
    if (!user?.user_id) return;
    const fetchOpenTrades = async () => {
      try {
        const baseUrl =
          accountType === "LIVE"
            ? `${BACKEND_API_URL}/order`
            : `${BACKEND_API_URL}/demo/order`;

        const res = await axios.get(`${baseUrl}`, {
          params: { user_id: user.user_id, status: "active" },
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(res.data.data)) {
          setOpenTrades(res.data.data);
        } else if (Array.isArray(res.data)) {
          setOpenTrades(res.data);
        } else {
          setOpenTrades([]);
        }
      } catch (err) {
        console.error(" Failed to load open trades:", err);
      }
    };
    fetchOpenTrades();
    const interval = setInterval(fetchOpenTrades, 900);
    return () => clearInterval(interval);
  }, [user]);

  const [pendingTrades, setPendingTrades] = useState([]);

  useEffect(() => {
    if (!user?.user_id) return;
    const fetchPendingTrades = async () => {
      try {
        const baseUrl =
          accountType === "LIVE"
            ? `${BACKEND_API_URL}/order?user_id=${user.user_id}&status=pending`
            : `${BACKEND_API_URL}/demo/order?user_id=${user.user_id}&status=pending`;

        const res = await axios.get(`${baseUrl}`);
        if (Array.isArray(res.data.data)) {
          setPendingTrades(res.data.data);
        } else if (Array.isArray(res.data)) {
          setPendingTrades(res.data);
        } else {
          setPendingTrades([]);
        }
      } catch (err) {
        console.error(" Failed to load pending trades:", err);
      }
    };
    fetchPendingTrades();
    const interval = setInterval(fetchPendingTrades, 2000);
    return () => clearInterval(interval);
  }, [user]);

  const [closedTrades, setClosedTrades] = useState([]);

  useEffect(() => {
    const fetchClosedTrades = async () => {
      if (!user?.user_id) return;
      try {
        const baseUrl =
          accountType === "LIVE"
            ? `${BACKEND_API_URL}/order?user_id=${user.user_id}&status=completed_cancelled_24_hr`
            : `${BACKEND_API_URL}/demo/order?user_id=${user.user_id}&status=completed_cancelled_24_hr`;

        const res = await axios.get(`${baseUrl}`);
        if (Array.isArray(res.data.data)) {
          setClosedTrades(res.data.data);
        } else if (Array.isArray(res.data)) {
          setClosedTrades(res.data);
        } else {
          setClosedTrades([]);
        }
      } catch (err) {
        console.error("Failed to load closed trades:", err);
      }
    };
    fetchClosedTrades();
    const interval = setInterval(fetchClosedTrades, 3000);
    return () => clearInterval(interval);
  }, [user]);

  const calculatePnL = (trade, livePrices) => {
    if (!trade || !livePrices) return 0;

    const cleanSymbol = trade.symbol?.replace("OANDA:", "").replace("/", "").trim().toUpperCase();
    if (!cleanSymbol) return 0;

    const livePrice = livePrices?.[cleanSymbol];
    if (livePrice === undefined) return 0;

    const entryPrice = parseFloat(trade.entry_price);
    const lot = parseFloat(trade.lot_size);
    const type = trade.type?.toUpperCase();

    const B_PAIR = ["BTCUSDT", "BTCUSD", "ETHUSD", "US30USD"];

    let contractSize = 100000;
    if (cleanSymbol === 'XAUUSD' || cleanSymbol === 'XPDUSD' || cleanSymbol ==='XPTUSD') contractSize = 100;
    if (cleanSymbol === 'XCUUSD') contractSize = 2300;
    if (cleanSymbol === 'XAGUSD') contractSize = 5000;
    if (cleanSymbol === 'DXY' || cleanSymbol ==='USOIL' || cleanSymbol ==='UKOIL') contractSize = 1000;
    if (B_PAIR.includes(cleanSymbol)) contractSize = 1;

    const rawPnL =
      type === "BUY"
        ? (livePrice - entryPrice) * lot * contractSize
        : (entryPrice - livePrice) * lot * contractSize;

    const quote = cleanSymbol.slice(3);

    if (quote === "USD") return rawPnL;
    const direct = livePrices?.[`${quote}USD`];
    const inverse = livePrices?.[`USD${quote}`];

    if (direct) {
      return rawPnL * direct;
    }
    if (inverse) {
      return rawPnL / inverse;
    }
    return rawPnL;
  };

  const [balance, setBalance] = useState(0);
  const [totalPL, setTotalPL] = useState(0);
  const [equity, setEquity] = useState(0);
  const [usedMargin, setUsedMargin] = useState(0);
  const [freeMargin, setFreeMargin] = useState(0);
  const [marginLevel, setMarginLevel] = useState(0);
  const setStoreFreeMargin = useMarginStore((s) => s.setFreeMargin);
  const [accountLevel, setAccountLevel] = useState(0);

  useEffect(() => {
    if (!user || !token) return;

    const fetchWallet = async () => {
      try {
        const accountType = localStorage.getItem("accountType");
        const baseUrl =
          accountType === "LIVE"
            ? `${BACKEND_API_URL}/wallet/${user.user_id}`
            : `${BACKEND_API_URL}/demoaccount/demo-account/${user.user_id}`;

        const res = await axios.get(baseUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.status === "success") {
          setBalance(parseFloat(res.data.wallet) || 0);
        }
      } catch (error) {
        console.error("Wallet fetch error:", error);
      }
    };

    fetchWallet();
    const interval = setInterval(fetchWallet, 3000);
    return () => clearInterval(interval);
  }, [user, token]);

  useEffect(() => {
    if (!openTrades) return;

    let runningPL = 0;
    let marginUsed = 0;

    openTrades.forEach((trade) => {
      const pnlValue = Number(calculatePnL(trade, livePrices) >= 0
        ? `+${calculatePnL(trade, livePrices).toFixed(2)}`
        : calculatePnL(trade, livePrices).toFixed(2)) || 0;
      runningPL += pnlValue;

      marginUsed += Number(
        (trade.used_margin || "0").toString().replace(/[^0-9.-]/g, "")
      ) || 0;
    });

    const equityCalc = (balance ?? 0) + runningPL;
    const freeMarginCalc = equityCalc - marginUsed;
    const marginLevelCalc =
      marginUsed > 0 ? (equityCalc / marginUsed) * 100 : 0;

    const accountLevelCalc = balance > 0 ? (equityCalc / balance) * 100 : 0;

    setTotalPL(Number(runningPL.toFixed(2)));
    setEquity(Number(equityCalc.toFixed(2)));
    setUsedMargin(Number(marginUsed.toFixed(2)));
    setFreeMargin(Number(freeMarginCalc.toFixed(2)));
    setMarginLevel(Number(marginLevelCalc.toFixed(2)));

    setAccountLevel(
      Number(Math.min(100, Math.max(0, accountLevelCalc)).toFixed(2))
    );

    setStoreFreeMargin(freeMarginCalc);
  }, [openTrades, balance, livePrices]);

  const [allCategories, setAllCategories] = useState([]);
  const categoryIcons = {
    Populars: "",
    Majors: "",
    Minors: "",
    Forex: "FX",
    Metals: "🥇",
    Crypto: "₿",
    Indices: "📈",
    Energy: "🛢️",
    Stocks: "📊",
    All: "",
  };

  useEffect(() => {
    fetchCategoriesFromDB();
  }, []);

  const fetchCategoriesFromDB = async () => {
    try {
      const res = await axios.get(`${BACKEND_API_URL}/spread/getspread`);
      const spreads = res.data.data.flat().filter(
        (item) => item.status === "active"
      );

      const grouped = {};

      spreads.forEach((item) => {
        let categories = [];
        if (Array.isArray(item.category)) {
          categories = item.category;
        } else {
          try {
            categories = JSON.parse(item.category);
          } catch {
            categories = [item.category];
          }
        }

        categories.forEach((cat) => {
          if (!grouped[cat]) grouped[cat] = [];
          grouped[cat].push({
            name: item.symbol.replace("/", ""),
          });
        });
      });

      const formatted = Object.entries(grouped).map(
        ([category, pairs]) => ({
          name: category,
          icon: categoryIcons[category] || "📌",
          pairs,
        })
      );

      setAllCategories(formatted);
    } catch (error) {
      console.error("Error loading pairs:", error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setIsMobileView(isMobile);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCategory = (category) => {
    setOpenCategory((prev) => (prev === category ? null : category));
  };

  const handleCloseTrade = async (id, user_id) => {
    try {
      const payload = {
        tradeId: id,
        user_id: user_id
      };

      const baseUrl =
        accountType === "LIVE"
          ? `${BACKEND_API_URL}/order/${id}/close`
          : `${BACKEND_API_URL}/demo/order/${id}/close`;

      const response = await fetch(`${baseUrl}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to close position");
      }

      setOpenTrades((prev) => prev.filter((trade) => trade.id !== id));
      toast.success("Your position has been closed");
    } catch (error) {
      toast.error(error.message || "Failed to close the position");
    }
  };

  const handleClosePendingOrder = async (id, user_id) => {
    try {
      const payload = {
        tradeId: id,
        user_id: user_id
      };

      const baseUrl =
        accountType === "LIVE"
          ? `${BACKEND_API_URL}/order/close/pending/${id}`
          : `${BACKEND_API_URL}/demo/order/close/pending/${id}`;

      const response = await fetch(`${baseUrl}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to close position");
      }

      setPendingTrades((prev) => prev.filter((trade) => trade.id !== id));
      toast.success(data.message || "Pending position closed ");
    } catch (error) {
      toast.error(error.message || "Failed to close the position ");
    }
  };

  const addToFavorites = (pair) => {
    if (!favorites.find((f) => f.name === pair.name)) {
      setFavorites((p) => [...p, pair]);
      toast.success(`${pair.name} added to favourites`);
    } else {
      toast.error(`${pair.name} already in favourites`);
    }
  };

  const removeFromFavorites = (pairName) => {
    setFavorites((p) => p.filter((f) => f.name !== pairName));
    toast(`${pairName} removed from favourites`, { icon: "🗑️" });
  };

  function isForexMarketOpen(symbol) {
    if (!symbol) return false;
    const now = new Date();
    const day = now.getUTCDay();
    const hour = now.getUTCHours();
    if (day === 6) return false;
    if (day === 5 && hour >= 22) return false;
    if (day === 0 && hour < 22) return false;
    return true;
  }

  const handleOpenOrder = (symbol, livePrices, side = "BUY") => {
    if (isForexMarketOpen()) {
      setMarketClosedPopup(true);
      return;
    }

    setModalSymbol(symbol);
    setModalCurrentPrice(livePrices);
    setModalInitialSide(side);
    setShowOrderModal(true);
  };

  const handlePlaceOrder = async () => {
    if (!lot || Number(lot) <= 0) {
      toast.error("Enter a valid lot size");
      return;
    }
    if (availableMargin < 0) {
      toast.error("Insufficient margin");
      return;
    }

    if (!token) {
      toast.error("You must be logged in");
      return;
    }

    const user_id = user?.user_id;
    if (!user_id) {
      toast.error("User not found");
      return;
    }

    const payload = {
      user_id,
      symbol: symbol
        .replace("OANDA:", "")
        .replace(/([A-Z]{3,4})([A-Z]{3,4})/, "$1/$2"),
      type: side,
      lot_size: Number(lot),
      trigger_price: Number(trigger),
      take_profit: tp === "" ? null : Number(tp),
      stop_loss: sl === "" ? null : Number(sl),
      order_type: tab,
    };

    try {
      const toastId = toast.loading("Placing order...");

      //  Include token in request
      const token = localStorage.getItem("token");
      const result = await submitOrderToServer(payload, token);

      toast.dismiss(toastId);
      toast.success("Position placed Successfully");

      onPlaceOrder?.(result.status);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to position order: " + err.message);
    }
  };

  const handleSaveModify = (updatedTrade) => {
    if (openTrades.some((t) => t.id === updatedTrade.id)) {
      setOpenTrades((prev) =>
        prev.map((t) => (t.id === updatedTrade.id ? updatedTrade : t))
      );
    }
    setShowModify(false);
  };

  const handleSelectInstrument = (symbolCode) => {
    setSelectedSymbol(symbolCode);
    if (isMobileView) {
      setCurrentView("chart");
    }
  };

  // Add this function to get the current price for the selected symbol
  const getCurrentPrice = () => {
    // Extract symbol name from selectedSymbol (remove "OANDA:" prefix)
    const symbolName = selectedSymbol.replace("OANDA:", "");

    // Find the current price from favorites or allPairs
    const favoriteItem = favorites.find((item) => item.name === symbolName);
    if (favoriteItem) return favoriteItem.price;

    const allPairItem = allPairs[symbolName];
    if (allPairItem) return allPairItem.price;

    return 1.16222;
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();

    isDraggingRef.current = true;
    setIsDragging(true);

    const startY = e.clientY;
    const startHeight = chartHeight;

    const onMouseMove = (moveEvent) => {
      if (!isDraggingRef.current) return;
      const deltaY = moveEvent.clientY - startY;
      const newHeight = startHeight + deltaY;
      const minHeight = 150;
      const maxHeight = window.innerHeight - 200;

      if (newHeight >= minHeight && newHeight <= maxHeight) {
        setChartHeight(newHeight);
      }
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
      setIsDragging(false);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      document.body.style.userSelect = "";
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    document.body.style.userSelect = "none";
  };

  const containerRef = useRef(null);
  const topRef = useRef(null);
  const bottomRef = useRef(null);

  const startDrag = (e) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = topRef.current.getBoundingClientRect().height;

    const onMouseMove = (e) => {
      const newHeight = startHeight + (e.clientY - startY);
      const maxHeight = window.innerHeight - 200;
      if (newHeight > 150 && newHeight < maxHeight) {
        topRef.current.style.height = `${newHeight}px`;
        bottomRef.current.style.height = `calc(100% - ${newHeight + 12}px)`;
      }
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  //  UPDATE: Function to handle Top Up navigation and Demo Topup using API
  const handleTopUp = async () => {
    if (accountType === "DEMO") {
      try {
        const response = await axios.post(
          `${BACKEND_API_URL}/demoaccount/demo-account`,
          { user_id: user.user_id, balance: 1000 }, //  1000 USD added via API per click
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.status === "success") {
          setBalance(response.data.data.balance);
          toast.success("1000 USD added to Demo Account");
        } else {
          toast.error("Failed to add: " + response.data.message);
        }
      } catch (err) {
        console.error("Error demo fund:", err);
        toast.error("Fund not added");
      }
    } else {
      // Navigate to deposit page for real account
      navigate("/deposit");
    }
    setIsAccountInfoOpen(false);
  };

  //  UPDATE: Function to toggle balance visibility
  const handleHideBalance = () => {
    setIsBalanceHidden(prev => !prev);
  };

  //  UPDATE: Function to handle Download Logs
  const handleDownloadLogs = () => {
    const logs = openTrades.length > 0 
      ? openTrades.map(t => `Symbol: ${t.symbol}, Type: ${t.type}, Lot: ${t.lot_size}, Entry: ${t.entry_price}`).join('\n')
      : "No active trades";
    const blob = new Blob([logs], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trading_logs.txt';
    a.click();
    URL.revokeObjectURL(url);
    setIsAccountInfoOpen(false);
  };

  //  UPDATE: Function to handle Switch Account
  const handleSwitchAccount = () => {
    const newType = accountType === "LIVE" ? "DEMO" : "LIVE";
    localStorage.setItem("accountType", newType);
    setAccountType(newType);
    window.location.reload(); 
  };

  const renderCurrentView = () => {
    if (!isMobileView) {
      return (
        <div className="flex flex-1 h-full">
          <DoinSidebar />
          <InstrumentSidebar
            isMobileView={isMobileView}
            showSidebarMobile={showSidebarMobile}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            favorites={favorites}
            setFavorites={setFavorites}
            allPairs={allPairs}
            allCategories={allCategories}
            openCategory={openCategory}
            toggleCategory={toggleCategory}
            openMobileItem={openMobileItem}
            setOpenMobileItem={setOpenMobileItem}
            PairIcons={PairIcons}
            handleOpenOrder={handleOpenOrder}
            setSelectedSymbol={setSelectedSymbol}
            setAnalysisSymbol={setAnalysisSymbol}
            setShowAnalysis={setShowAnalysis}
            removeFromFavorites={removeFromFavorites}
            addToFavorites={addToFavorites}
            handleSelectInstrument={handleSelectInstrument}
            forexIcon={forexIcon}
            currentView={currentView}
            setCurrentView={setCurrentView}
          />

          <div className="flex-1 flex flex-col overflow-hidden h-full">

            {/* Chart Area */}
            <div
              className={`flex-shrink-0 relative transition-colors duration-300 ${isDark ? dk.pageBg : "bg-white"}`}
              style={{ height: `${chartHeight}px` }}
            >
              <TradingViewChart symbol={selectedSymbol} />
              {isDragging && (
                <div className="absolute inset-0 z-50 bg-transparent cursor-ns-resize" />
              )}
            </div>

            {/* Drag Handle */}
            <div
              onMouseDown={handleMouseDown}
              className={`h-1.5 cursor-row-resize z-10 flex-shrink-0 transition-colors duration-300 ${isDark ? dk.dragHandle : "bg-gray-200"}`}
            />

            {/* Bottom Tables */}
            <div className={`flex-1 overflow-auto transition-colors duration-300 ${isDark ? dk.pageBg : "bg-white"}`}>
              <OrderTables
                trade={selectedTrade}
                onClose={() => setShowModify(false)}
                onSave={handleSaveModify}
                tradeTab={tradeTab}
                setTradeTab={setTradeTab}
                allPairs={allPairs}
                openTrades={openTrades}
                pendingTrades={pendingTrades}
                closedTrades={closedTrades}
                setSelectedTrade={setSelectedTrade}
                setShowModify={setShowModify}
                handleCloseTrade={handleCloseTrade}
                handleClosePendingOrder={handleClosePendingOrder}
                prices={favorites}
                balance={balance}
              />
            </div>
          </div>
        </div>);
    }

    switch (currentView) {
      case "instruments":
        return (
          <div className={isDark ? dk.pageBg : ""}>
            <InstrumentSidebar
              isMobileView={isMobileView}
              showSidebarMobile={showSidebarMobile}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              favorites={favorites}
              setFavorites={setFavorites}
              allPairs={allPairs}
              allCategories={allCategories}
              openCategory={openCategory}
              toggleCategory={toggleCategory}
              openMobileItem={openMobileItem}
              setOpenMobileItem={setOpenMobileItem}
              PairIcons={PairIcons}
              handleOpenOrder={handleOpenOrder}
              setSelectedSymbol={setSelectedSymbol}
              setAnalysisSymbol={setAnalysisSymbol}
              setShowAnalysis={setShowAnalysis}
              removeFromFavorites={removeFromFavorites}
              addToFavorites={addToFavorites}
              handleSelectInstrument={handleSelectInstrument}
              forexIcon={forexIcon}
              currentView={currentView}
              setCurrentView={setCurrentView}
            />
            {isMobileView && (
              <div className="fixed bottom-0 left-0 right-0 z-50">
                <MobileBottomNav currentView={currentView} setCurrentView={setCurrentView} />
              </div>
            )}
          </div>
        );

      case "orders":
        return (
          <div className={`flex-1 flex flex-col transition-colors duration-300 ${isDark ? dk.pageBg : "bg-white"}`}>
            <div className="flex-1 overflow-auto">
              <OrderTables
                trade={selectedTrade}
                onClose={() => setShowModify(true)}
                onSave={handleSaveModify}
                tradeTab={tradeTab}
                setTradeTab={setTradeTab}
                symbol={modalSymbol}
                allPairs={allPairs}
                openTrades={openTrades}
                pendingTrades={pendingTrades}
                closedTrades={closedTrades}
                setSelectedTrade={setSelectedTrade}
                setShowModify={setShowModify}
                handleCloseTrade={handleCloseTrade}
                handleClosePendingOrder={handleClosePendingOrder}
                price={favorites}
                balance={balance}
                openMobileItem={openMobileItem}
                setOpenMobileItem={setOpenMobileItem}
                isMobileView={isMobileView}
                handleSelectInstrument={handleSelectInstrument}
                setSelectedSymbol={setSelectedSymbol}
                setCurrentView={setCurrentView}
              />
            </div>
            {isMobileView && (
              <div className="fixed bottom-0 left-0 right-0 z-50">
                <MobileBottomNav currentView={currentView} setCurrentView={setCurrentView} />
              </div>
            )}
          </div>
        );

      case "chart":
      default:
        return (
          <div className={`flex-1 flex flex-col transition-colors duration-300 ${isDark ? dk.pageBg : "bg-white"}`}>
            <div className={isDark ? dk.pageBg : "bg-white"} style={{ height: "calc(100vh - 140px)" }}>
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto">
                  <div className={isDark ? dk.pageBg : "bg-white"} style={{ height: "100%" }}>
                    <TradingViewChart symbol={selectedSymbol} />
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <div className="flex items-center gap-3 p-3">
                    <button
                      onClick={() => handleOpenOrder(selectedSymbol, getCurrentPrice(), "SELL")}
                      className="flex-1 bg-[#EA493F] text-white py-2.5 rounded font-bold text-md"
                    >
                      SELL
                    </button>
                    <button
                      onClick={() => handleOpenOrder(selectedSymbol, getCurrentPrice(), "BUY")}
                      className="flex-1 bg-[#158BF7] text-white py-2.5 rounded font-bold text-md"
                    >
                      BUY
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {isMobileView && (
              <div className="fixed bottom-0 left-0 right-0 z-50">
                <MobileBottomNav currentView={currentView} setCurrentView={setCurrentView} />
              </div>
            )}
          </div>
        );
    }
  };

  const displayAccountType = accountType === "LIVE" ? "REAL" : accountType;
  
  // Format symbol for display in nav
  const displaySymbol = selectedSymbol.replace("ONA:", "").replace("OANDA:", "");
  const formattedDisplaySymbol = displaySymbol.length === 6 ? `${displaySymbol.slice(0,3)}/${displaySymbol.slice(3)}` : displaySymbol;

  //  UPDATE: Balance formatting based on visibility
  const formattedBalance = isBalanceHidden ? "•••••• USD" : `${balance.toFixed(2)} USD`;

  return (
    <div className={`h-screen flex flex-col transition-colors duration-300 ${isDark ? dk.pageBg : "bg-white"}`}>
      <Toaster position="top-right" />

      {/* ─── Navbar (Blue Theme: #EAF4FF bg, #1877F2 text/icons, blue-300 border) ─── */}
      <header 
        className={`relative px-4 md:px-6 py-3 border-b transition-colors duration-300 ${
          isDark 
            ? `${dk.headerBg} ${dk.headerBorder}` 
            : `${blueNav.headerBg} ${blueNav.headerBorder}`
        }`}
      >
        {/* Backdrop for closing dropdowns */}
        {(isAccountInfoOpen || isGridMenuOpen || isUserMenuOpen) && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => { setIsAccountInfoOpen(false); setIsGridMenuOpen(false); setIsUserMenuOpen(false); }} 
          />
        )}

        <div className="flex justify-between items-center w-full">
          
          {/* Left Section: Logo & Account Dropdown */}
          <div className="flex items-center gap-4">
            <Link to="/trading">
              <img 
                src={isDark ? LogoYellow : LogoBlack} 
                alt="DOIN FX" 
                className="h-13 cursor-pointer hidden md:block" 
              />
            </Link>

            {/*  UPDATE: Removed the green plus button next to the symbol */}

            {/* Account Info Dropdown */}
            <div className="relative z-50">
              <button 
                onClick={() => setIsAccountInfoOpen(!isAccountInfoOpen)} 
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isDark 
                    ? "bg-[#1A242B] text-gray-300" 
                    : `${blueNav.accountBadge} hover:bg-[#1877F2]/20`
                }`}
              >
                {displayAccountType === "REAL" ? "Real Standard" : "Demo Standard"}
                <ChevronDown size={14} className={isDark ? "" : blueNav.chevronColor} />
              </button>

              {isAccountInfoOpen && (
                <div 
                  className={`absolute mt-2 w-72 rounded-lg shadow-xl border z-50 p-4 transition-colors ${
                    isDark 
                      ? "bg-[#1A242B] border-[#2A3640]" 
                      : `${blueNav.dropdownBg} ${blueNav.dropdownBorder}`
                  }`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className={`font-bold ${isDark ? "text-white" : blueNav.textPrimary}`}>
                      {displayAccountType === "REAL" ? "Real Standard" : "Demo Standard"}
                    </h3>
                    <span className={`text-xs ${isDark ? "text-green-400" : "text-green-600"}`}>1:2000</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className={isDark ? "text-gray-400" : blueNav.labelMuted}>Balance</span>
                      <span className={isDark ? "text-white" : blueNav.valueText}>{formattedBalance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDark ? "text-gray-400" : blueNav.labelMuted}>Equity</span>
                      <span className={isDark ? "text-white" : blueNav.valueText}>{isBalanceHidden ? "•••••• USD" : `${equity.toFixed(2)} USD`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDark ? "text-gray-400" : blueNav.labelMuted}>Margin</span>
                      <span className={isDark ? "text-white" : blueNav.valueText}>{isBalanceHidden ? "•••••• USD" : `${usedMargin.toFixed(2)} USD`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDark ? "text-gray-400" : blueNav.labelMuted}>Free margin</span>
                      <span className={isDark ? "text-white" : blueNav.valueText}>{isBalanceHidden ? "•••••• USD" : `${freeMargin.toFixed(2)} USD`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDark ? "text-gray-400" : blueNav.labelMuted}>Margin level</span>
                      <span className={isDark ? "text-white" : blueNav.valueText}>{isBalanceHidden ? "••••••%" : `${marginLevel.toFixed(2)}%`}</span>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-center">
                    {/*  UPDATE: Added functions to buttons with blue theme */}
                    <button 
                      onClick={handleTopUp} 
                      className={`py-2 rounded-md font-medium transition-colors ${
                        isDark 
                          ? "bg-green-900/40 text-green-400 hover:bg-green-900/60" 
                          : `${blueNav.topUpBtnBg}`
                      }`}
                    >
                      Top Up
                    </button>
                    <button 
                      onClick={handleHideBalance} 
                      className={`py-2 rounded-md font-medium transition-colors ${
                        isDark 
                          ? "bg-[#2A3640] text-gray-300 hover:bg-[#3A4650]" 
                          : `${blueNav.switchBtnBg}`
                      }`}
                    >
                      {isBalanceHidden ? "Show balance" : "Hide balance"}
                    </button>
                    <button 
                      onClick={handleDownloadLogs} 
                      className={`py-2 rounded-md font-medium transition-colors ${
                        isDark 
                          ? "bg-[#2A3640] text-gray-300 hover:bg-[#3A4650]" 
                          : `${blueNav.switchBtnBg}`
                      }`}
                    >
                      Download logs
                    </button>
                    <button 
                      onClick={handleSwitchAccount} 
                      className={`py-2 rounded-md font-medium transition-colors ${
                        isDark 
                          ? "bg-[#2A3640] text-gray-300 hover:bg-[#3A4650]" 
                          : `${blueNav.switchBtnBg}`
                      }`}
                    >
                      Switch account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Section: Balance, Deposit, Grid, User */}
          <div className="flex items-center gap-3">
            {/* Balance Display */}
            <span className={`font-semibold hidden md:block ${isDark ? "text-white" : blueNav.balanceText}`}>
              {formattedBalance}
            </span>
            
            {/*  UPDATE: Deposit button with blue theme */}
            <Link to="/deposit" className="hidden md:block">
              <button 
                className={`px-5 py-1.5 rounded-md text-sm font-bold transition-colors ${
                  isDark 
                    ? "bg-green-600 text-white hover:bg-green-700" 
                    : blueNav.depositBtn
                }`}
              >
                Deposit
              </button>
            </Link>

            {/*  UPDATE: Grid Icon Dropdown with blue theme */}
            <div className="relative z-50">
              <button 
                onClick={() => setIsGridMenuOpen(!isGridMenuOpen)} 
                className={`p-2 rounded-full transition-colors ${
                  isDark 
                    ? "text-gray-300 hover:bg-[#2A3640]" 
                    : `${blueNav.iconBg} ${blueNav.iconColor} hover:bg-[#1877F2]/20`
                }`}
              >
                <LayoutGrid size={20} />
              </button>
              {isGridMenuOpen && (
                 <div 
                   className={`absolute right-0 mt-2 w-56 rounded-lg shadow-xl border z-50 p-2 transition-colors ${
                     isDark 
                       ? "bg-[#1A242B] border-[#2A3640]" 
                       : `${blueNav.dropdownBg} ${blueNav.dropdownBorder}`
                   }`}
                 >
                    {/*  UPDATE: Removed Deposit from grid menu */}
                    <Link to="/profile" className="block">
                      <div 
                        className={`flex items-center gap-2.5 py-2.5 px-3 rounded-md cursor-pointer transition-colors ${
                          isDark 
                            ? "text-gray-300 hover:bg-[#2A3640]" 
                            : `${blueNav.dropdownText} ${blueNav.dropdownHover}`
                        }`}
                      >
                         <User size={15} /> Personal Area
                      </div>
                    </Link>
                    <Link to="/login" className="block">
                      <div 
                        className={`flex items-center gap-2.5 py-2.5 px-3 rounded-md cursor-pointer transition-colors ${
                          isDark 
                            ? "text-gray-300 hover:bg-[#2A3640]" 
                            : `${blueNav.dropdownText} ${blueNav.dropdownHover}`
                        }`}
                      >
                         <Globe size={15} /> Public website
                      </div>
                    </Link>
                    <Link to="/ib/dashboard" className="block">
                      <div 
                        className={`flex items-center gap-2.5 py-2.5 px-3 rounded-md cursor-pointer transition-colors ${
                          isDark 
                            ? "text-gray-300 hover:bg-[#2A3640]" 
                            : `${blueNav.dropdownText} ${blueNav.dropdownHover}`
                        }`}
                      >
                         <Users size={15} /> Partnership
                      </div>
                    </Link>
                 </div>
              )}
            </div>

            {/*  UPDATE: Removed Bell Icon entirely */}

            {/*  UPDATE: User Icon Dropdown with blue theme */}
            <div className="relative z-50">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} 
                className={`p-2 rounded-full transition-colors ${
                  isDark 
                    ? "bg-[#2A2A1A] text-[#F7931A] hover:bg-[#3A3A2A]" 
                    : `${blueNav.iconBg} ${blueNav.iconColor} hover:bg-[#1877F2]/20`
                }`}
              >
                <User size={18} />
              </button>
              {isUserMenuOpen && (
                 <div 
                   className={`absolute right-0 mt-2 w-64 rounded-lg shadow-xl border z-50 p-2 transition-colors ${
                     isDark 
                       ? "bg-[#1A242B] border-[#2A3640]" 
                       : `${blueNav.dropdownBg} ${blueNav.dropdownBorder}`
                   }`}
                 >
                    {/*  UPDATE: Cleaned up layout with blue theme */}
                    <div className={`px-3 py-3 border-b mb-2 ${isDark ? "border-gray-700" : blueNav.dividerBorder}`}>
                       <div className={`text-sm font-semibold ${isDark ? "text-white" : blueNav.textPrimary}`}>
                         {displayAccountType === "REAL" ? "Real Standard" : "Demo Standard"}
                       </div>
                       <div className={`text-xs mt-0.5 ${isDark ? "text-gray-500" : blueNav.labelMuted}`}>
                         {user?.email || "user@example.com"}
                       </div>
                       <div className={`text-xs mt-0.5 ${isDark ? "text-gray-500" : blueNav.labelMuted}`}>
                         {formattedBalance}
                       </div>
                    </div>
                    {/*  UPDATE: Support Link routes to Help.jsx */}
                    <Link to="/help" className="block">
                      <div 
                        className={`flex items-center gap-2.5 py-2.5 px-3 rounded-md cursor-pointer transition-colors ${
                          isDark 
                            ? "text-gray-300 hover:bg-[#2A3640]" 
                            : `${blueNav.dropdownText} ${blueNav.dropdownHover}`
                        }`}
                      >
                         <LifeBuoy size={15} /> Support
                      </div>
                    </Link>
                    <div 
                      className={`flex items-center gap-2.5 py-2.5 px-3 rounded-md cursor-pointer transition-colors ${
                        isDark 
                          ? "text-gray-300 hover:bg-[#2A3640]" 
                          : `${blueNav.dropdownText} ${blueNav.dropdownHover}`
                      }`}
                    >
                      <MessageSquare size={15} /> Suggest a feature
                    </div>
                    <Link to="/login" className="block">
                      <div className="flex items-center gap-2.5 py-2.5 px-3 rounded-md cursor-pointer text-red-500 hover:bg-red-500/10 transition-colors">
                         <LogOut size={15} /> Sign Out
                      </div>
                    </Link>
                 </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">{renderCurrentView()}</div>

      {/* ─── Modals ─── */}
      {showModify && (
        <Modifyorder
          trade={selectedTrade}
          user_id={user_id}
          onClose={() => setShowModify(false)}
          onSave={handleSaveModify}
          allPairs={allPairs}
        />
      )}

      <PopupTab
        open={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        symbol={modalSymbol}
        currentPrice={modalCurrentPrice}
        allPairs={allPairs}
        livePrices={livePrices}
        onPlaceOrder={handlePlaceOrder}
        initialSide={modalInitialSide}
      />

      {/* Market Closed Popup */}
      {marketClosedPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className={`absolute inset-0 transition-colors duration-300 ${isDark ? dk.modalOverlay : "bg-black/40"}`}
            onClick={() => setMarketClosedPopup(false)}
          />
          <div className={`relative w-full max-w-md mx-4 rounded-lg shadow-lg p-6 transition-colors duration-300 ${isDark ? dk.modalBg : "bg-white"}`}>
            <div className="flex items-start justify-between">
              <h3 className={`text-lg font-bold transition-colors duration-300 ${isDark ? dk.heading : ""}`}>Market Closed!</h3>
              <button
                onClick={() => setMarketClosedPopup(false)}
                className={`hover:opacity-70 transition-colors duration-300 ${isDark ? dk.muted : "text-gray-500 hover:text-gray-700"}`}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <p className={`mt-3 text-sm transition-colors duration-300 ${isDark ? dk.label : "text-gray-700"}`}>
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

      {/* Technical Analysis Popup */}
      {showAnalysis && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-colors duration-300 ${isDark ? dk.modalOverlay : "bg-black/50"}`}>
          <div className={`rounded-lg shadow-lg w-[350px] md:w-[460px] relative transition-colors duration-300 ${isDark ? dk.modalBg : "bg-white"}`}>

            <div className={`flex justify-between items-center px-4 py-2 border-b-3 transition-colors duration-300 ${isDark ? `border-[#F7931A]` : "border-orange-400"}`}>
              <h3 className={`text-lg mt-1 p-2 font-semibold transition-colors duration-300 ${isDark ? dk.heading : "text-black"}`}>
                Technical Analysis
              </h3>
              <button
                onClick={() => setShowAnalysis(false)}
                className={`pb-2 hover:opacity-70 text-3xl transition-colors duration-300 ${isDark ? dk.muted : "text-gray-400 hover:text-gray-800"}`}
              >
                ×
              </button>
            </div>

            <div className="p-4">
              <TechnicalAnalysis symbol={analysisSymbol} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
