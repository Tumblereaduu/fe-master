import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, ChevronDown } from "lucide-react";
import forexIcon from "../../assets/img/pairicon/forex.svg";
import goldIcon from "../../assets/img/pairicon/goldbars.svg";
import bitcoinIcon from "../../assets/img/pairicon/bitcoin.svg";
import indicesIcon from "../../assets/img/pairicon/indices.svg";
import oilIcon from "../../assets/img/pairicon/oilbarrel.svg";
import stocksIcon from "../../assets/img/pairicon/Stocks.svg";
import popularIcon from "../../assets/img/pairicon/popular.svg";
import majorIcon from "../../assets/img/pairicon/major.svg";
import minorIcon from "../../assets/img/pairicon/minor.svg";
import ChartIcon from "../../assets/img/tradepage/Diagram.svg";
import AnalysisIcon from "../../assets/img/tradepage/Vector.svg";
import Fremove from "../../assets/img/tradepage/remove.svg";
import MobileBottomNav from "./MobileBottomNav";
import axios from "../../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { BACKEND_API_URL } from "../../api/config";
import PopupTab from "./Popuptab";
import { useLivePrice } from "../hooks/tradePage/useLivePriceContext";
import { useTheme } from "../../context/ThemeContext";

const PAIR_SEARCH_ALIASES = {
  "UK/OIL": ["uk oil", "brent", "brent oil", "oil"],
  "US/OIL": ["us oil", "oil", "crude", "wti", "petroleum"],
  "US30/USD": ["us30", "dow", "dow jones", "dj30", "wall street"],
  "XPD/USD": ["palladium", "xpd"],
  "XCU/USD": ["copper", "xcu"],
  "ETH/USD": ["ethereum", "eth", "crypto"],
  "BTC/USD": ["bitcoin", "btc", "crypto"],
  "XAG/USD": ["silver", "xag"],
  "USD/CAD": ["canadian dollar", "cad", "loonie"],
  "USD/CHF": ["swiss franc", "franc", "chf"],
  "USD/JPY": ["japanese yen", "yen", "jpy"],
  "NZD/JPY": ["new zealand dollar", "kiwi", "nzd", "yen"],
  "NZD/CHF": ["new zealand dollar", "kiwi", "nzd", "swiss franc"],
  "NZD/CAD": ["new zealand dollar", "kiwi", "nzd", "canadian dollar"],
  "NZD/USD": ["new zealand dollar", "kiwi", "nzd"],
  "GBP/NZD": ["british pound", "pound", "sterling", "gbp", "kiwi"],
  "GBP/CHF": ["british pound", "pound", "sterling", "gbp", "swiss franc"],
  "GBP/CAD": ["british pound", "pound", "sterling", "gbp", "canadian dollar"],
  "GBP/AUD": ["british pound", "pound", "sterling", "gbp", "australian dollar"],
  "GBP/JPY": ["british pound", "pound", "sterling", "gbp", "yen"],
  "GBP/USD": ["british pound", "pound", "sterling", "gbp"],
  "EUR/CHF": ["euro", "eur", "swiss franc"],
  "EUR/CAD": ["euro", "eur", "canadian dollar"],
  "EUR/NZD": ["euro", "eur", "kiwi"],
  "EUR/AUD": ["euro", "eur", "australian dollar"],
  "EUR/GBP": ["euro", "eur", "pound", "sterling"],
  "EUR/JPY": ["euro", "eur", "yen"],
  "EUR/USD": ["euro", "eur"],
  "CHF/JPY": ["swiss franc", "franc", "yen"],
  "CAD/JPY": ["canadian dollar", "cad", "yen"],
  "CAD/CHF": ["canadian dollar", "cad", "swiss franc"],
  "AUD/CHF": ["australian dollar", "aud", "aussie", "swiss franc"],
  "AUD/NZD": ["australian dollar", "aud", "aussie", "kiwi"],
  "AUD/CAD": ["australian dollar", "aud", "aussie", "canadian dollar"],
  "AUD/JPY": ["australian dollar", "aud", "aussie", "yen"],
  "AUD/USD": ["australian dollar", "aud", "aussie"],
  "XAU/USD": ["gold", "xau", "bullion", "precious metal", "gold spot"],
};

const InstrumentSidebar = ({
  showSidebarMobile,
  activeTab,
  setActiveTab,
  allCategories,
  openCategory,
  toggleCategory,
  openMobileItem,
  setOpenMobileItem,
  PairIcons,
  setSelectedSymbol,
  setAnalysisSymbol,
  setShowAnalysis,
  currentView,
  setCurrentView,
  isMobileView,
}) => {
  const { isDark } = useTheme(); // ✅ Get isDark state

  // ─── Dark colour tokens ───
  const dk = {
    pageBg: "bg-[#141D22]",
    card: "bg-[#1A242B]",
    border: "border-[#2A3640]",
    borderLight: "border-[#1E2830]",
    heading: "text-white",
    value: "text-[#E8EDF0]",
    label: "text-[#8899A6]",
    muted: "text-[#6B7B88]",
    hover: "hover:bg-[#1E2830]",
    input: "bg-[#121A20] border-[#2A3640] text-[#E8EDF0]",
    modalBg: "bg-[#1A242B]",
    modalOverlay: "bg-black/60",
    iconFilter: "brightness-0 invert",
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [selectedSymbol] = useState("BINANCE:EURUSD");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [modalSymbol, setModalSymbol] = useState(selectedSymbol);
  const [modalCurrentPrice, setModalCurrentPrice] = useState(0);
  const [modalInitialSide, setModalInitialSide] = useState("BUY");
  const [hideFavourites, setHideFavourites] = useState(false);
  const [marketClosedPopup, setMarketClosedPopup] = useState(false);
  const { livePrices, allPairs } = useLivePrice();

    // ─── Internal sidebar tab state (extends parent activeTab) ───
  const [sidebarTab, setSidebarTab] = useState(activeTab);
  // ─── Sync with parent when activeTab changes ───
  useEffect(() => {
    setSidebarTab(activeTab);
  }, [activeTab]);
  // ─── Tab definitions — 12 tabs in order ───
  const tabs = [
    { id: "favourites", label: "Fav", icon: Star, isLucide:true },
    { id: "mosttraded", label: "Most Traded", icon: popularIcon },
    { id: "majors", label: "Majors", icon: majorIcon },
    { id: "minors", label: "Minors", icon: minorIcon },
    { id: "forex", label: "Forex", icon: forexIcon },
    { id: "metals", label: "Metals", icon: goldIcon },
    { id: "crypto", label: "Crypto", icon: bitcoinIcon },
    { id: "indices", label: "Indices", icon: indicesIcon },
    { id: "energy", label: "Energy", icon: oilIcon },
    { id: "stocks", label: "Stocks", icon: stocksIcon },
    // { id: "populars", label: "Populars", icon: popularIcon },
    { id: "all", label: "All" },
  ];
  // ─── Map quick tab id to category name ───
  const tabCategoryMap = {
    mosttraded: "Most Traded",
    majors: "Majors",
    minors: "Minors",
    forex: "Forex",
    metals: "Metals",
    crypto: "Crypto",
    indices: "Indices",
    energy: "Energy",
    stocks: "Stocks",
    populars: "Most Traded",
  };

  const handleOpenOrder = (symbol, livePrices, side = "BUY") => {
    if (!isForexMarketOpen(symbol)) {
      setMarketClosedPopup(true);
      return;
    }
    setShowOrderModal(true);
    setModalSymbol(symbol);
    setModalCurrentPrice(livePrices);
    setModalInitialSide(side);
    setShowOrderModal(true);
    setHideFavourites(true);
  };

  const handleSelectInstrument = (symbolCode) => {
    setSelectedSymbol(symbolCode);
    if (isMobileView) {
      setCurrentView("chart");
    }
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
      symbol: symbol.replace("ONA:", "").replace(/([A-Z]{3,4})([A-Z]{3,4})/, "$1/$2"),
      type: side,
      lot_size: Number(lot),
      trigger_price: Number(trigger),
      take_profit: tp === "" ? null : Number(tp),
      stop_loss: sl === "" ? null : Number(sl),
      order_type: tab,
    };

    try {
      const toastId = toast.loading("Placing order...");
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

  const [accountType, setAccountType] = useState(() => {
    return localStorage.getItem("accountType") || "LIVE";
  });

  const { user, token } = useAuth();
  const user_id = user?.user_id;

  const apiBase =
    accountType === "LIVE"
      ? `${BACKEND_API_URL}/favourites`
      : `${BACKEND_API_URL}/demofavourites`;

  const fetchFavorites = async () => {
    if (!user_id) return;
    try {
      const { data } = await axios.get(`${apiBase}/user/${user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setFavorites(data.favorites || []);
      } else {
        setFavorites([]);
      }
    } catch (err) {
      console.error("Error fetching favorites:", err);
      setFavorites([]);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user_id, token, accountType]);

  const addToFavorites = async (pair) => {
    if (favorites.some((f) => f.symbol === pair.symbol)) {
      toast.error(`${pair.symbol} already in favourites`);
      return;
    }

    try {
      const res = await axios.post(
        `${apiBase}/add`,
        { user_id, symbol: pair.symbol },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200 || res.status === 201) {
        setFavorites((prev) => [...prev, pair]);
        toast.success(`${pair.symbol} added to favourites`);
      }
    } catch (err) {
      console.error("Add favorite failed:", err);
      if (err.response.status === 403) {
        toast.error(err.response.data.message);
        return;
      }
      toast.error("Failed to add favourite");
    }
  };

  const removeFromFavorites = async (symbol) => {
    try {
      const { data } = await axios.delete(`${apiBase}/remove`, {
        data: { user_id, symbol },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setFavorites((prev) => prev.filter((f) => f.symbol !== symbol));
        toast.success(`${symbol} removed from favourites`);
      } else {
        toast.error("Failed to remove favourite");
      }
    } catch (err) {
      console.error("Error removing favorite:", err);
      toast.error("Error removing favourite");
    }
  };

  const filteredFavorites = useMemo(() => {
    if (!searchTerm.trim()) return favorites;
    const searchLower = searchTerm.toLowerCase();
    return favorites.filter((item) => {
      // Search by symbol
      if (item.symbol?.toLowerCase().includes(searchLower)) {
        return true;
      }
      // Search by aliases
      const cleanSymbol = item.symbol?.replace("/", "").trim();
      for (const [pairKey, aliases] of Object.entries(PAIR_SEARCH_ALIASES)) {
        if (pairKey.replace("/", "") === cleanSymbol) {
          return aliases.some(alias => alias.toLowerCase().includes(searchLower));
        }
      }
      return false;
    });
  }, [favorites, searchTerm]);

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return allCategories;
    const searchLower = searchTerm.toLowerCase();
    return allCategories
      .map((cat) => ({
        ...cat,
        pairs: cat.pairs.filter((p) => {
          // Search by pair name/symbol
          if (p.name?.toLowerCase().includes(searchLower)) {
            return true;
          }
          // Search by aliases
          const cleanSymbol = p.name?.replace("/", "").trim();
          for (const [pairKey, aliases] of Object.entries(PAIR_SEARCH_ALIASES)) {
            if (pairKey.replace("/", "") === cleanSymbol) {
              return aliases.some(alias => alias.toLowerCase().includes(searchLower));
            }
          }
          return false;
        }),
      }))
      .filter((cat) => cat.pairs.length > 0);
  }, [allCategories, searchTerm]);

  const ALWAYS_OPEN = ["BTCUSDT", "BTCUSD", "ETHUSD"];
  const GMC_PAIRS = ["XAGUSD", "XPDUSD", "XPTUSD", "DXY", "USOIL", "UKOIL"];

  function isForexMarketOpen(symbol) {
    if (!symbol) return false;

    const cleanSymbol = symbol.split(":").pop().replace("/", "").toUpperCase();

    if (ALWAYS_OPEN.includes(cleanSymbol)) {
      return true;
    }

    const now = new Date();
    const day = now.getUTCDay();
    const hour = now.getUTCHours();

    if (day === 6) return false;
    if (day === 5 && hour >= 22) return false;
    if (day === 0 && hour < 22) return false;

    return true;
  }

  const categoryOrder = ["Most Traded", "Majors", "Minors", "Forex", "Metals", "Crypto", "Indices", "Energy", "Stocks", "All"];
  const sortedFilteredCategories = useMemo(() => {
    const sorted = [...filteredCategories].sort((a, b) => {
      const i1 = categoryOrder.indexOf(a.name);
      const i2 = categoryOrder.indexOf(b.name);
      return (i1 === -1 ? 999 : i1) - (i2 === -1 ? 999 : i2);
    });

    // Ensure XAU/USD is first in "Most Traded" category
    return sorted.map((cat) => {
      if (cat.name === "Most Traded") {

        const pairs = [...cat.pairs];

        pairs.sort((a, b) => {
          const aIsGold = a.name.replace(/[/:]/g, "").toUpperCase().includes("XAUUSD");
          const bIsGold = b.name.replace(/[/:]/g, "").toUpperCase().includes("XAUUSD");

          if (aIsGold && !bIsGold) return -1;
          if (!aIsGold && bIsGold) return 1;
          return 0;
        });

        return {
          ...cat,
          pairs,
        };
      }

      return cat;
    });
  }, [filteredCategories]);

   // ─── All flat pairs (for "All" tab — no category headers) ───
  const allFlatPairs = useMemo(() => {
    return sortedFilteredCategories.flatMap(cat => cat.pairs);
  }, [sortedFilteredCategories]);
  // ─── Visible tabs: only show tabs that have pairs (Favourites always shown) ───
  const visibleTabs = useMemo(() => {
    return tabs.filter((tab) => {
      if (tab.id === "favourites") return true;
      if (tab.id === "all") return sortedFilteredCategories.some(cat => cat.pairs.length > 0);
      const catName = tabCategoryMap[tab.id];
      if (!catName) return false;
      const cat = sortedFilteredCategories.find(c => c.name === catName);
      return cat ? cat.pairs.length > 0 : false;
    });
  }, [tabs, sortedFilteredCategories]);
  // ─── Auto-switch tab if current one becomes invisible ───
  useEffect(() => {
    if (visibleTabs.length > 0 && !visibleTabs.some(t => t.id === sidebarTab)) {
      setSidebarTab("favourites");
      setActiveTab("favourites");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleTabs]);
  // ─── Get flat pairs for a specific quick tab ───
  const getFlatPairsForTab = (tabId) => {
    const catName = tabCategoryMap[tabId];
    if (!catName) return [];
    const cat = sortedFilteredCategories.find(c => c.name === catName);
    return cat ? cat.pairs : [];
  };
  // ─── Reusable flat list renderer for category tabs ───
  const renderFlatList = (pairs) => {
    if (pairs.length === 0) {
      return (
        <p className={`text-center text-sm py-10 transition-colors duration-300 ${isDark ? dk.muted : "text-[#1877F2]"}`}>
          No instruments found
        </p>
      );
    }
    return pairs.map((item) => (
      <div
        key={item.name}
        className={`group flex items-center justify-between px-4 py-3 cursor-pointer border-b last:border-b-0 transition-colors duration-200 ${isDark ? `${dk.hover} ${dk.borderLight}` : "hover:bg-[#EAF4FF] border-[#1877F2]/20"}`}
        onClick={() => {
          const BinanceSymbol = item.name.split(":").pop();
          let prefix = "ONA";
          if (ALWAYS_OPEN.includes(BinanceSymbol)) {
            prefix = "CRYPTO";
          } else if (GMC_PAIRS.includes(BinanceSymbol)) {
            prefix = "GMC";
          }
          const symbolCode = `${prefix}:${item.name}`;
          if (isMobileView) {
            handleSelectInstrument(symbolCode);
          } else {
            setSelectedSymbol(symbolCode);
          }
        }}
      >
        <div className="flex items-center gap-3">
          <img src={PairIcons[item.name] || forexIcon} alt={item.name} className="w-6 h-6" />
          <h4 className={`text-xs font-semibold transition-colors duration-200 ${isDark ? dk.value : "text-[#1877F2]"}`}>
            {item.name}
          </h4>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              const isFavorite = favorites.some(fav => fav.symbol === item.name);
              if (isFavorite) {
                removeFromFavorites(item.name);
              } else {
                addToFavorites({ symbol: item.name });
              }
            }}
            className={`flex items-center gap-1 p-1 rounded transition-colors duration-200 ${isDark ? dk.hover : "hover:bg-[#1877F2]/10"}`}
            title={favorites.some(fav => fav.symbol === item.name) ? "Remove from favorites" : "Add to favorites"}
          >
            {favorites.some(fav => fav.symbol === item.name) ? (
              <Star size={16} className="text-yellow-500 fill-yellow-500" />
            ) : (
              <Star size={16} className="text-yellow-500" />
            )}
          </button>
        </div>
      </div>
    ));
  };

  return (
    <aside
      className={`flex flex-col md:border-r-3 transition-colors duration-300
        ${isMobileView ? "absolute mt-16 inset-0 z-10 w-full pb-18" : "w-75"} 
        ${isMobileView && !showSidebarMobile ? "hidden" : "flex"}
        ${isDark ? `${dk.pageBg} ${dk.border}` : "bg-[#FFFFFF] border-gray-300"}`}
    >
      {/* Search Bar */}
      {!hideFavourites && (
        <>
          {/* ─── Shared Search Bar (above tabs) ─── */}
          <div className="p-2 border-b border-[#1877F2]/20">
            <div className={`flex items-center border rounded-lg px-3 py-2.5 transition-colors duration-300 ${isDark ? dk.input : "border-[#1877F2] bg-[#FFFFFF]"}`}>
              <Search size={18} className={isDark ? dk.label : "text-[#1877F2]"} />
              <input
                type="text"
                placeholder="Search Instrument"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`ml-2 flex-1 text-sm outline-none bg-transparent transition-colors duration-300 ${isDark ? dk.value : "text-[#1877F2]"}`}
              />
            </div>
          </div>

          {/* 🔹 Tabs — arranged in a 3-column grid (3 3 3 layout) */}
          {/* <div className={`grid grid-cols-3 gap-2 p-2 transition-colors duration-300 ${isDark ? dk.card : "bg-[#FFFFFF]"} border-b ${isDark ? "border-[#2A3640]" : "border-[#1877F2]"}`}>
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setSidebarTab(tab.id);
                  if (tab.id === "favourites" || tab.id === "all") {
                    setActiveTab(tab.id);
                  }
                }}
                className={`w-full px-2 py-2 rounded text-xs font-medium transition-all duration-200 text-center truncate
                  ${sidebarTab === tab.id
                    ? isDark
                      ? "bg-gray-600 text-white"
                      : "bg-[#1877F2] text-white"
                    : isDark
                      ? `${dk.label} hover:bg-[#222E38]`
                      : "text-[#1877F2] hover:bg-[#1877F2]/10"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div> */}

          {/* Tabs */}
          <div
            className={`flex flex-wrap justify-around gap-1 p-1 ${
              isDark ? "bg-[#1A2027]" : "bg-white"
            } border-b ${
              isDark ? "border-[#2A3640]" : "border-gray-200"
            }`}
          >
            {visibleTabs.map((tab) => {
              const isActive = sidebarTab === tab.id;

              return (

                <button
                  key={tab.id}
                  onClick={() => {
                    setSidebarTab(tab.id);

                    if (tab.id === "favourites" || tab.id === "all") {
                      setActiveTab(tab.id);
                    }
                  }}
                  className={`
                    min-w-[60px]
                    h-6
                    px-1
                    rounded-md
                    border
                    text-[12.5px]
                    font-medium
                    transition-all
                    duration-200
                    ${
                      isActive
                        ? "bg-[#EEF3FF] border-[#b9cffc] text-[#1F3FBF]"
                        : isDark
                        ? "bg-[#202B36] border-[#3A4652] text-white"
                        : "bg-white border-gray-300 text-black hover:bg-gray-50"
                    }
                  `}
                >
                  <div className="flex items-center justify-center">
                      {/* Icon */}
                      {tab.icon &&
                        (tab.isLucide ? (
                          <tab.icon size={14} />
                        ) : (
                          <img
                            src={tab.icon}
                            alt={tab.label}
                            className="w-4 h-4 object-contain mr-0.5"
                          />
                        ))}

                      <span>{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Main Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            {/* ---------------- FAVOURITES ---------------- */}
            {sidebarTab === "favourites" && (
              <div>
                {filteredFavorites.length === 0 ? (
                  <p className={`text-center text-sm py-10 transition-colors duration-300 ${isDark ? dk.muted : "text-[#1877F2]"}`}>
                    No favourites found
                  </p>
                ) : (
                  filteredFavorites.map((item) => {
                    const BinanceSymbol = item.symbol.split(":").pop();
                    let prefix = "ONA";
                    if ((ALWAYS_OPEN || US30).includes(BinanceSymbol)) {
                      prefix = "CRYPTO";
                    } else if (GMC_PAIRS.includes(BinanceSymbol)) {
                      prefix = "GMC";
                    }
                    const symbolCode = `${prefix}:${item.symbol}`;
                    const ALWAYS_OPEN_AN = ["BTCUSDT", "BTCUSD", "ETHUSD"];
                    const US30 = ["US30USD"];
                    const GMC_PAIRS_AN = ["XAGUSD", "XPDUSD"];

                // remove any existing prefix (VERY important)
                const cleanedSymbol = item.symbol.split(":").pop().trim();

                let prefixed = "OANDA";

                if (ALWAYS_OPEN_AN.includes(cleanedSymbol)) {
                  prefixed = "BINANCE";
                } else if (GMC_PAIRS_AN.includes(cleanedSymbol)) {
                  prefixed = "PYTH";
                }

                const analysisSymbol = `${prefixed}:${cleanedSymbol}`;

                const cleanSymbol = item.symbol?.replace("/", "")?.trim();
                const liveData =  allPairs[cleanSymbol]
                const livePrice = liveData?.price ?? "_";
                const highPrice = liveData?.high ?? "_";
                const lowPrice = liveData?.low ?? "_";
                const percentage = liveData?.changePercent ?? "_";
                const isItemOpen = openMobileItem === item.symbol;

                    return (
                      <motion.div
                        layout
                        key={item.symbol}
                        className={`group px-2.5 py-3 cursor-pointer border-b transition-colors duration-200 ${isDark ? `${dk.hover} ${dk.borderLight}` : "hover:bg-[#EAF4FF] border-[#1877F2]/20"}`}
                        onClick={() => {
                          if (isMobileView) {
                            setOpenMobileItem(isItemOpen ? null : item.symbol);
                          } else {
                            setSelectedSymbol(symbolCode);
                          }
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img src={PairIcons[item.symbol] || forexIcon} alt={item.symbol} className="w-7 h-7" />
                            <div>
                              <h4 className={`text-sm font-semibold transition-colors duration-200 ${isDark ? dk.value : "text-[#000000]"}`}>
                                {item.symbol}
                              </h4>
                            </div>
                          </div>

                          <div className="relative w-38 flex items-center justify-end h-10">
                            <div className="w-full text-right md:group-hover:opacity-0 transition-opacity duration-200">
                              <span className={`text-sm font-semibold block transition-colors duration-200 ${isDark ? dk.value : "text-[#1877F2]"}`}>
                                {livePrice ? livePrice : "_"}
                              </span>
                              <span className={`text-[11px] block transition-colors duration-200 ${isDark ? dk.muted : "text-[#000000]/50"}`}>
                                L: {lowPrice} H: {highPrice}
                              </span>
                            </div>

                            {/* Desktop Hover Actions */}
                            <div className="hidden md:block absolute inset-0 md:flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <div className={`flex flex-col items-center text-[9px] transition-colors duration-200 ${isDark ? dk.muted : "text-[#1877F2]/60"}`}>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleOpenOrder(symbolCode, item.price, "BUY"); }}
                                  className="flex items-center justify-center w-6 h-6 text-xs rounded text-white bg-[#158BF7] hover:opacity-90"
                                >
                                  B
                                </button>
                                BUY
                              </div>
                              <div className={`flex flex-col items-center text-[9px] transition-colors duration-200 ${isDark ? dk.muted : "text-[#1877F2]/60"}`}>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleOpenOrder(symbolCode, item.price, "SELL"); }}
                                  className="flex items-center justify-center w-6 h-6 text-xs rounded text-white bg-[#EA493F] hover:opacity-90"
                                >
                                  S
                                </button>
                                SELL
                              </div>
                              {/* <div className={`flex flex-col items-center text-[9px] transition-colors duration-200 ${isDark ? dk.muted : "text-[#1877F2]/60"}`}>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setAnalysisSymbol(analysisSymbol); setShowAnalysis(true); }}
                                  className="flex items-center justify-center w-6.5 h-8 text-xs rounded"
                                >
                                <img src={AnalysisIcon} alt="analysis" className={`w-6.5 h-6.5 ${isDark ? "brightness-0 invert" : "brightness-0"}`} />
                                </button>
                                ANALYSIS
                              </div> */}

                              <div className={`flex flex-col items-center text-[9px] transition-colors duration-200 ${isDark ? dk.muted : "text-[#1877F2]/60"}`}>
                                <button
                                  onClick={(e) => { e.stopPropagation(); removeFromFavorites(item.symbol); }}
                                  className="flex items-center justify-center w-6 h-6 text-xs rounded"
                                >
                                <img src={Fremove} alt="remove" className={`w-4.5 h-4.5 ${isDark ? "brightness-0 invert" : "brightness-0"}`} />
                                </button>
                                REMOVE
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Mobile Actions */}
                        {isItemOpen && isMobileView && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center justify-between gap-2 pt-3 mt-2"
                          >
                            {["BUY", "SELL"].map((label, i) => (
                              <div key={label} className={`flex flex-col items-center text-[10px] transition-colors duration-200 ${isDark ? dk.muted : "text-[#1877F2]/60"}`}>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleOpenOrder(symbolCode, item.price, label); }}
                                  className={`flex items-center justify-center w-8 h-8 text-xs rounded text-white mb-1 ${i === 0 ? "bg-[#158BF7]" : "bg-[#DA493F]"} hover:opacity-90`}
                                >
                                  {label[0]}
                                </button>
                                {label}
                              </div>
                            ))}
                            <div className={`flex flex-col items-center text-[9px] transition-colors duration-200 ${isDark ? dk.muted : "text-[#1877F2]/60"}`}>
                              <button onClick={(e) => { e.stopPropagation(); handleSelectInstrument(symbolCode); }} className="flex items-center justify-center w-8 h-8 rounded mb-1">
                                <img src={ChartIcon} alt="chart" className={`w-8 h-8 ${isDark ? "brightness-0 invert" : "filter brightness-0"}`} />
                              </button>
                              CHART
                            </div>
                            {/* <div className={`flex flex-col items-center text-[9px] transition-colors duration-200 ${isDark ? dk.muted : "text-[#1877F2]/60"}`}>
                              <button onClick={(e) => { e.stopPropagation(); setAnalysisSymbol(analysisSymbol); setShowAnalysis(true); }} className={`flex items-center justify-center w-6.5 h-8 text-xs rounded transition-colors duration-200 ${isDark ? dk.hover : "hover:bg-[#1877F2]/10"}`}>
                               <img src={AnalysisIcon} alt="analysis" className={`w-6.5 h-6.5 ${isDark ? "brightness-0 invert" : "brightness-0"}`} />
                              </button>
                              ANALYSIS
                            </div> */}
                            <div className={`flex flex-col items-center text-[10px] transition-colors duration-200 ${isDark ? dk.muted : "text-[#1877F2]/60"}`}>
                              <button onClick={(e) => { e.stopPropagation(); removeFromFavorites(item.symbol); }} className="flex items-center justify-center w-8 h-8 rounded mb-1">
                               <img src={Fremove} alt="remove" className={`w-6 h-6 ${isDark ? "brightness-0 invert" : "brightness-0"}`} />
                              </button>
                              REMOVE
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })
                )}
              </div>
            )}

            {/* ─── ALL — flat list of all pairs, no category headers ─── */}
            {sidebarTab === "all" && (
              <div className="p-2">
                {renderFlatList(allFlatPairs)}
              </div>
            )}

            {/* ─── MOST TRADED flat list ─── */}
            {sidebarTab === "mosttraded" && (
              <div className="p-2">
                {renderFlatList(getFlatPairsForTab("mosttraded"))}
              </div>
            )}

            {/* ─── MAJORS flat list ─── */}
            {sidebarTab === "majors" && (
              <div className="p-2">
                {renderFlatList(getFlatPairsForTab("majors"))}
              </div>
            )}

            {/* ─── MINORS flat list ─── */}
            {sidebarTab === "minors" && (
              <div className="p-2">
                {renderFlatList(getFlatPairsForTab("minors"))}
              </div>
            )}

            {/* ─── FOREX flat list ─── */}
            {sidebarTab === "forex" && (
              <div className="p-2">
                {renderFlatList(getFlatPairsForTab("forex"))}
              </div>
            )}

            {/* ─── METALS flat list ─── */}
            {sidebarTab === "metals" && (
              <div className="p-2">
                {renderFlatList(getFlatPairsForTab("metals"))}
              </div>
            )}

            {/* ─── CRYPTO flat list ─── */}
            {sidebarTab === "crypto" && (
              <div className="p-2">
                {renderFlatList(getFlatPairsForTab("crypto"))}
              </div>
            )}

            {/* ─── INDICES flat list ─── */}
            {sidebarTab === "indices" && (
              <div className="p-2">
                {renderFlatList(getFlatPairsForTab("indices"))}
              </div>
            )}

            {/* ─── ENERGY flat list ─── */}
            {sidebarTab === "energy" && (
              <div className="p-2">
                {renderFlatList(getFlatPairsForTab("energy"))}
              </div>
            )}

            {/* ─── STOCKS flat list ─── */}
            {sidebarTab === "stocks" && (
              <div className="p-2">
                {renderFlatList(getFlatPairsForTab("stocks"))}
              </div>
            )}

            {/* ─── POPULARS flat list ─── */}
            {sidebarTab === "populars" && (
              <div className="p-2">
                {renderFlatList(getFlatPairsForTab("populars"))}
              </div>
            )}
          </div>
        </>
      )}

    <PopupTab
      open={showOrderModal}
      onClose={() =>{
        setShowOrderModal(false);
        setHideFavourites(false);
      }}
      symbol={modalSymbol}
      currentPrice={modalCurrentPrice}
      onPlaceOrder={handlePlaceOrder}
      initialSide={modalInitialSide}
    />

    {marketClosedPopup && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className={`absolute inset-0 transition-colors duration-300 ${isDark ? dk.modalOverlay : "bg-black/40"}`}
          onClick={() => setMarketClosedPopup(false)}
        />
        <div className={`relative w-full max-w-md mx-4 rounded-lg shadow-lg p-6 transition-colors duration-300 ${isDark ? dk.modalBg : "bg-[#EAF4FF] border border-[#1877F2]"}`}>
          <div className="flex items-start justify-between">
            <h3 className={`text-lg font-bold transition-colors duration-300 ${isDark ? dk.heading : "text-[#1877F2]"}`}>Market Closed!</h3>
            <button
              onClick={() => setMarketClosedPopup(false)}
              className={`hover:opacity-70 transition-colors duration-300 ${isDark ? dk.muted : "text-[#1877F2] hover:text-[#1877F2]/80"}`}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
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

      {/*Mobile Bottom Nav */}
      {isMobileView && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <MobileBottomNav
            currentView={currentView}
            setCurrentView={setCurrentView}
          />
        </div>
      )}
    </aside>
  );
};

export default InstrumentSidebar;
