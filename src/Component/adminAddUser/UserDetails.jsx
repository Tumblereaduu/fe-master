import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../Admin/AdminLayout";
import { BACKEND_API_URL } from "../../api/config";
import { ChevronUp, ChevronDown, X, Plus } from "lucide-react";
import { formatUTC } from "../../api/trade/date";
import { de } from "date-fns/locale";
import toast from "react-hot-toast";

  const UserDetails = () => {
      const { id } = useParams();
      const [userData, setUserData] = useState(null);
      const [wallet, setWallet] = useState(null);
      const [loading, setLoading] = useState(true);
      const [activeAction, setActiveAction] = useState(null);
      const [actionData, setActionData] = useState([]);
      const [searchTerm, setSearchTerm] = useState("");
      const [itemsPerPage, setItemsPerPage] = useState(10);
      const [currentPage, setCurrentPage] = useState(1);
      const [showScrollBtn, setShowScrollBtn] = useState(false);
      const [scrollDirection, setScrollDirection] = useState("down");
      const [pnlAdd, setPnlAdd] = useState("");
      const [statusFilter, setStatusFilter] = useState("All");
      // Single spread (backward compat) — Spread state for individual user (single spread - kept for backward compat)
      const [spreadValue, setSpreadValue] = useState("");
      const [spreadLoading, setSpreadLoading] = useState(false);
      // Per-pair spread management states
      const [spreadInputs, setSpreadInputs] = useState({});
      const [pairSpreadLoading, setPairSpreadLoading] = useState({});

    // Add Spread modal states
    const [showAddSpreadModal, setShowAddSpreadModal] = useState(false);
    const [addSymbol, setAddSymbol] = useState("");
    const [addSpreadVal, setAddSpreadVal] = useState("");
    const [addCommission, setAddCommission] = useState("");
    const [addCategory, setAddCategory] = useState([]);
    const [addSpreadLoading, setAddSpreadLoading] = useState(false);

    const addCategories = [
      "Most Traded", "Majors", "Minors", "Forex",
      "Metals", "Crypto", "Indices", "Energy", "Stocks", "All",
    ];

    const toggleAddCategory = (val) => {
      setAddCategory((prev) =>
        prev.includes(val) ? prev.filter((c) => c !== val) : [...prev, val]
      );
    };

    const applyPNL = (type)=>{
      setActionData((prev)=>{
        if(!prev?.length) return prev;
          const updated = {...prev[0]};
          const delta = parseFloat(pnlAdd) || 0;
          const value = type === "add" ? delta : - delta;
          updated.total_pnl = (parseFloat(updated.total_pnl) || 0 ) + value;
          updated.totalFinalBalance = (parseFloat(updated.totalFinalBalance) || 0 ) + value;
        return [updated];
      })
      setPnlAdd("");
    }

    // Update spread for individual user (single spread - kept for backward compat)
    // const updateSpread = async () => {
    //   if (spreadValue === "" || spreadValue === null) {
    //     toast.error("Please enter a spread value");
    //     return;
    //   }
    //   const numSpread = Number(spreadValue);
    //   if (isNaN(numSpread) || numSpread < 0) {
    //     toast.error("Spread must be a valid non-negative number");
    //     return;
    //   }

    //   setSpreadLoading(true);
    //   try {
    //     const res = await axios.put(`${BACKEND_API_URL}/spread/user/spread/${id}`, {
    //       spread: numSpread
    //     });
    //     if (res.data.status === "success") {
    //       toast.success(res.data.message || "Spread updated successfully");
    //       // Update local state
    //       setUserData(prev => ({ ...prev, spread: numSpread }));
    //       setSpreadValue("");
    //     } else {
    //       toast.error(res.data.message || "Failed to update spread");
    //     }
    //   } catch (err) {
    //     console.error("updateSpread error:", err);
    //     toast.error(err.response?.data?.message || "Failed to update spread");
    //   } finally {
    //     setSpreadLoading(false);
    //   }
    // };

    // ============ PER-PAIR SPREAD MANAGEMENT FUNCTIONS ============

    // Set individual spread for a specific pair
    const handleSetSpread = async (spreadId, symbol) => {
      const value = spreadInputs[spreadId];
      if (!value) {
        toast.error("Please enter a spread value");
        return;
      }
      const numValue = Number(value);
      if (isNaN(numValue) || numValue < 0) {
        toast.error("Spread must be a valid non-negative number");
        return;
      }
      setPairSpreadLoading(prev => ({ ...prev, [spreadId]: true }));
      try {
        const res = await axios.put(`${BACKEND_API_URL}/spread/user-spreads/${id}`, {
          spread_id: spreadId,
          symbol: symbol,
          spread: numValue
        });
        if (res.data.status === "success") {
          toast.success(`${symbol} spread set to ${numValue} pips`);
          setSpreadInputs(prev => ({ ...prev, [spreadId]: "" }));
          // Refresh the spread setting table
          fetchDetails("Spread Setting");
        } else {
          toast.error(res.data.message || "Failed to update");
        }
      } catch (err) {
        console.error("handleSetSpread error:", err);
        toast.error(err.response?.data?.message || "Failed to update spread");
      } finally {
        setPairSpreadLoading(prev => ({ ...prev, [spreadId]: false }));
      }
    };

    // Reset individual spread to global default
    const handleResetSpread = async (spreadId, symbol) => {
      setPairSpreadLoading(prev => ({ ...prev, [spreadId]: true }));
      try {
        const res = await axios.delete(`${BACKEND_API_URL}/spread/user-spreads/${id}/${spreadId}`);
        if (res.data.status === "success") {
          toast.success(`${symbol} spread reset to global default`);
          // Refresh the spread setting table
          fetchDetails("Spread Setting");
        } else {
          toast.error(res.data.message || "Failed to reset");
        }
      } catch (err) {
        console.error("handleResetSpread error:", err);
        toast.error(err.response?.data?.message || "Failed to reset spread");
      } finally {
        setPairSpreadLoading(prev => ({ ...prev, [spreadId]: false }));
      }
    };

    // ============ PER-PAIR SPREAD MANAGEMENT FUNCTIONS END ============

    // Add new spread — uses your existing /spread/addspread endpoint
    const handleAddSpread = async (e) => {
      e.preventDefault();
      if (!addSymbol || !addSpreadVal || addCategory.length === 0) {
        toast.error("Please fill Symbol, Spread and select at least one Category");
        return;
      }
      setAddSpreadLoading(true);
      try {
        const res = await axios.post(`${BACKEND_API_URL}/spread/addspread`, {
          symbol: addSymbol.toUpperCase(),
          spread: addSpreadVal,
          ib_commission_percentage: addCommission || "0",
          category: addCategory,
        });
        if (res.data.status === "success" || res.data.message) {
          toast.success(res.data.message || "Spread added successfully!");
          setAddSymbol("");
          setAddSpreadVal("");
          setAddCommission("");
          setAddCategory([]);
          setShowAddSpreadModal(false);
          if (activeAction === "Spread Setting") fetchDetails("Spread Setting");
        } else {
          toast.error(res.data.message || "Failed to add spread");
        }
      } catch (err) {
        console.error("handleAddSpread error:", err);
        toast.error(err.response?.data?.message || "Something went wrong");
      } finally {
        setAddSpreadLoading(false);
      }
    };

    const actionTables = {
      Deposit: { headers: ["S.NO","deposit_id", "transaction_id", "payment_method", "requested_amount_usd", "transfer_amount_usd", "deposit_request_at", "deposit_status", "action"] },
      Withdrawal: { headers: ["S.NO","withdrawal_id", "payment_address_upi_id", "payment_method", "requested_amount_usd", "transfer_amount_usd", "withdrawal_status","withdrawal_request_at", "action"] },
      LoginDetails: { headers: ["S.NO","user_id", "created_at", "login_source", "action"] },
      "Open Order": { headers: ["S.NO","trade_id", "symbol", "type", "order_type", "lot_size", "entry_price", "entry_time","stop_loss", "take_profit", "order_status"] },
      "Pending Order": { headers: ["S.NO","trade_id", "symbol", "type", "order_type", "lot_size", "entry_price", "entry_time","stop_loss", "take_profit", "order_status"] },
      "Order History": { headers: ["S.NO","trade_id", "symbol", "type", "order_type", "lot_size", "entry_price", "entry_time", "exit_price", "exit_time", "stop_loss", "take_profit", "order_status","closed_by","pnl","action"] },
      KYC: { headers: ["photo_id_1", "photo_id_2", "photo_id_3", "employment_status", "occupation", "trading_experience", "income_range", "source_of_income", "photo_verification_status"] },
      "Demo Analytics": { headers: ["added_fund", "demo_total_pnl", "demo_wallet_balance", "demo_final_balance"] },
      Analytics : {headers:["total_deposit", "total_withdrawal", "total_ib_balance", "total_pnl", "totalFinalBalance", "wallet_balance"]},
      IBClients : {headers:["S.NO","username","id","account_created_at"]},
      IBClientEarnings : {headers:["S.NO","username","id","account_created_at","total_commission"]},
      IBTransfer: {headers:["S.NO", "ib_id", "user_id", "username", "email", "enter_amount", "deposit_request_at", "deposit_status"]},
      IBCommission: {headers:["S.NO", "id", "username", "trade_id", "order_type", "lot_size", "type", "commission_amount", "created_at"]},
      "Demo Trades": { headers: ["S.NO","trade_id", "symbol", "type", "order_type", "lot_size", "entry_price", "entry_time", "exit_price", "exit_time", "stop_loss", "take_profit", "order_status","closed_by","pnl"] },
      "Spread Setting": { headers: ["S.NO", "spread_id", "symbol", "global_spread", "user_spread", "spread_status", "spread_action"] },
    };

    const headerLabels = {
      deposit_id: "Deposit ID", transaction_id: "Transaction ID", payment_method: "Payment Method", requested_amount_usd: "Requested (USD)", transfer_amount_usd: "Transferred (USD)", deposit_request_at: "Requested At", deposit_status: "Status", action: "Action",
      withdrawal_id: "Withdrawal ID", payment_address_upi_id: "Transaction ID", payment_method: "Payment Method", withdrawal_status: "Status", withdrawal_request_at : "Requested At",
      user_id: "UserID", created_at: "Date & Time", action: "Action", login_source: "Source",
      photo_id_1: "Front Proof", photo_id_2: "Back Proof", photo_id_3: "Bank Proof", employment_status: "Employment Status", occupation: "Occupation",
      trading_experience: "Trading Experience", income_range: "Income", source_of_income: "Source of Income", photo_verification_status: "Status",
      trade_id: "Trade ID", symbol: "Symbol", type: "Type", order_type: "Order Type", lot_size: "Lot Size", entry_price: "Entry Price", entry_time: "Entry Time",
      exit_price: "Exit Price", exit_time: "Exit Time", pnl: "PnL",
      stop_loss: "Stop Loss", take_profit: "Take Profit", order_status: "Order Status",closed_by:"Closed By",
      total_deposit: "Total Deposits (USD)",total_withdrawal:"Total Withdrawal (USD)", total_ib_balance:"Total IB Balance", total_pnl:"Total PNL (USD)",totalFinalBalance:"Final Balance (USD)",wallet_balance:"Wallet Balance (USD)",
      added_fund: "Added Fund (USD)", demo_total_pnl: "Total PNL (USD)", demo_wallet_balance: "Wallet Balance (USD)", demo_final_balance: "Final Balance (USD)",
      ib_clients: "Total clients IB", username:"Username", id: "UserId", account_created_at : "Join Date",
      ib_total_earnings: "Total clients IB", username:"Username", id: "UserId", account_created_at : "Join Date", total_commission : "Total Commission",
      ib_transfer: "IB Transfer History", ib_id: "IB TR ID", user_id: "UserId", email: "Email", enter_amount :"Requested Amount", deposit_request_at :"Requested At", deposit_status: "status",
      ib_commission : "IB Commission",  id:"UserId", username:"Username", trade_id:"Trade ID", order_type: "Order Type", lot_size: "Lot", type: "Type", commission_amount: "Commission Amount", created_at: "Created At",
      demo_trades: "Demo Trades", trade_id: "Trade ID", symbol: "Symbol", type: "Type", order_type: "Order Type", lot_size: "Lot Size", entry_price: "Entry Price", entry_time: "Entry Time", exit_price: "Exit Price", exit_time: "Exit Time", stop_loss: "Stop Loss", take_profit: "Take Profit", order_status: "Order Status", closed_by:"Closed By", pnl:"PnL",
      // Per-pair spread labels
      spread_id: "ID", global_spread: "Global Spread", user_spread: "User Spread", spread_status: "Status", spread_action: "Action",
    };

    // Step 1: Apply status filter
    let statusFilteredRows = actionData;
    if (statusFilter !== "All") {
      statusFilteredRows = actionData.filter(row => {
        let rowStatus = "";
        if (activeAction === "Deposit") {
          rowStatus = row.deposit_status || "";
        } else if (activeAction === "Withdrawal") {
          rowStatus = row.withdrawal_status || "";
        }
        return rowStatus.toLowerCase() === statusFilter.toLowerCase();
      });
    }
    
    // Step 2: Apply search filter
    const filteredRows = statusFilteredRows.filter(row => 
      JSON.stringify(row).toLowerCase().includes(searchTerm.toLowerCase())
    );

      // Fetch user data
      useEffect(() => {
          const fetchUser = async () => {
              try {
                  const res = await axios.get(`${BACKEND_API_URL}/auth/user/${id}`);
                  if (res.data.status === "success") setUserData(res.data.data);
              } catch (err) {
                  console.error("Error fetching user:", err); 
                } finally {
                  setLoading(false);
          }
      };
            fetchUser();
    }, [id]);

      // Fetch user Wallet

      useEffect(() => {
          const fetchWallet = async () => {
              try {
              const res = await axios.get(`${BACKEND_API_URL}/wallet/${id}`);
              if (res.data.status === "success") setWallet({
              wallet: res.data.wallet,
              used_margin: res.data.used_margin,
              after_used_margin: res.data.after_used_margin
            });
          } catch (err) { console.error("Error fetching wallet:", err); }
          finally { setLoading(false); }
        };
        fetchWallet();   }, [id]);

    useEffect(() => {
      const checkScroll = () => {
        const scrollTop = window.scrollY;
        const scrollHeight = document.body.scrollHeight;
        const clientHeight = window.innerHeight;
        setShowScrollBtn(scrollHeight > clientHeight + 100);
        setScrollDirection(scrollTop < scrollHeight - clientHeight - 100 ? "down" : "up");
      };
      window.addEventListener("scroll", checkScroll);
      checkScroll();
      return () => window.removeEventListener("scroll", checkScroll);
    }, [actionData]);

    const fetchDetails = async (action) => {
      try {
        setStatusFilter("All");
        let endpoint = "";
        if (action === "Deposit") endpoint = `/deposit/admin/list/user/${id}`;
        else if (action === "Withdrawal") endpoint = `/withdrawal/admin/user/${id}`;
        else if (action === "LoginDetails") endpoint = `/auth/user-login/${id}`;
        else if (action === "Open Order") endpoint = `/adminorder/active/${id}`;
        else if (action === "Pending Order") endpoint = `/adminorder/pending/${id}`;
        else if (action === "Order History") endpoint = `/adminorder/cancelled/${id}`;
        else if (action === "KYC") endpoint = `/kyc/admin/kyc/${id}`;
        else if (action === "Analytics") endpoint = `/admindash/analytics/${id}`;
        else if (action === "Demo Analytics") endpoint = `/demoaccount/demo/analytics/${id}`;
        else if (action === "IBClients") endpoint = `/ib/earnings-clients-data/${id}`;
        else if (action === "IBClientEarnings") endpoint = `/ib/earnings-clients-data/${id}`;
        else if (action === "IBTransfer") endpoint = `/ib/ib-get/${id}`;
        else if (action === "IBCommission") endpoint = `/ib/commission/${id}`;
        else if (action === "Demo Trades") endpoint = `/adminorder/democancelled/${id}`;
        else if (action === "Spread Setting") endpoint = `/spread/user-spreads/${id}`;

        const res = await axios.get(`${BACKEND_API_URL}${endpoint}`);
        let rows =[]
        if (action === "Analytics"){
          rows=[{...res.data.data,
            wallet_balance: wallet?.wallet || 0,
          }]
        } else if (action === "Demo Analytics"){
          const demoData = res.data.data || res.data;
          rows=[{
            added_fund: demoData?.added_fund || demoData?.addedFund || 0,
            demo_total_pnl: demoData?.total_pnl || demoData?.demo_total_pnl || demoData?.totalPnl || demoData?.pnl || demoData?.demo_pnl || demoData?.total_demo_pnl || 0,
            demo_wallet_balance: demoData?.wallet_balance || wallet?.wallet || 0,
            demo_final_balance: demoData?.final_balance || demoData?.demo_final_balance || demoData?.finalBalance || 0,
          }]
        } else if (action === "Spread Setting") {
          // Per-pair spread data - rename spread to global_spread for clarity
          const spreadData = res.data.data || [];
          rows = spreadData.map(item => ({
            ...item,
            spread_id: item.id,
            global_spread: item.spread,
          }));
        } else{
          rows = res.data.data || res.data.data || res.data.deposit || res.data.withdrawal || res.data.withdraw || Object.values(res.data).find(v => Array.isArray(v)) || [];  
        }
        setActionData(Array.isArray(rows) ? rows : []);
        setCurrentPage(1);
        setSearchTerm("");
      } catch (err) {
        console.error(`Error fetching ${action}:`, err);
        setActionData([]);
      }
    };


    const toggleVisibility = async (type, id, isHidden) => {
      try {
        let endpoint = "";

        switch (type) {
          case "Order History":
            endpoint = isHidden
              ? `/order/${id}/unhide`
              : `/order/${id}/hide`;
            break;

          case "Deposit":
            endpoint = isHidden
              ? `/deposit/${id}/unhide`
              : `/deposit/${id}/hide`;
            break;

          case "Withdrawal":
            endpoint = isHidden
              ? `/withdrawal/${id}/unhide`
              : `/withdrawal/${id}/hide`;
            break;

          default:
            return;
        }

        const res = await axios.put(`${BACKEND_API_URL}${endpoint}`);

        toast.success(
          res.data?.message ||
          (isHidden ? "Restored successfully." : "Hidden successfully.")
        );

        fetchDetails(activeAction);

      } catch (err) {
        console.error(err);

        toast.error(
          err.response?.data?.message || "Failed to update visibility."
        );
      }
    };

    // const formatLocalTime = (value) => {
    //   if (!value) return "-";
    //   const date = new Date(value);
    //   return isNaN(date) ? value : date.toLocaleString();
    // };

    const totalPages = itemsPerPage === "all" ? 1 : Math.ceil(filteredRows.length / itemsPerPage);
    const startIndex = itemsPerPage === "all" ? 0 : (currentPage - 1) * itemsPerPage;
    const endIndex = itemsPerPage === "all" ? filteredRows.length : startIndex + itemsPerPage;
    const paginatedData = itemsPerPage === "all" ? filteredRows : filteredRows.slice(startIndex, endIndex);

    if (loading) return <AdminLayout><div className="flex min-h-screen justify-center items-center">Loading...</div></AdminLayout>;
    if (!userData) return <AdminLayout><div className="flex min-h-screen justify-center items-center">User not found</div></AdminLayout>;

    return (

      <AdminLayout>
        <div className="flex-1 md:mt-7 text-xs sm:text-sm ml-0 w-full">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-3 mb-3">

            {/* User Info Table */}
            <div className="overflow-x-auto rounded-xl">
              <table className="min-w-full bg-white/5 shadow-md border border-white/20 text-center">
                <thead className="bg-white/10 text-white border-b border-white/20">
                  <tr>
                    {["User ID", "Username", "Email", "Referred by", "Whatsapp", "DOB", "Nationality", "City", "Country", "Wallet Balance", "Used Margin", "After Used Margin"].map((th, idx) => (
                      <th key={idx} className="px-4 py-2 border-b border-white/20">{th}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-t border-white/20">
                    <td className="px-4 py-2">{userData.id || "-"}</td>
                    <td className="px-4 py-2">{userData.username || "-"}</td>
                    <td className="px-4 py-2">{userData.email || "-"}</td>
                    <td className="px-4 py-2">{userData.referred_by_id || "-"}</td>
                    <td className="px-4 py-2">{userData.whatsapp_number || "-"}</td>
                    <td className="px-4 py-2">{userData.date_of_birth || "-"}</td>
                    <td className="px-4 py-2">{userData.nationality || "-"}</td>
                    <td className="px-4 py-2">{userData.city || "-"}</td>
                    <td className="px-4 py-2">{userData.country || "-"}</td>
                    <td className="px-4 py-2">{wallet?.wallet ?? "-"}</td>
                    <td className="px-4 py-2">{wallet?.used_margin || "-"}</td>
                    <td className="px-4 py-2">{wallet?.after_used_margin || "-"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-8 gap-2 sm:gap-3 mb-3">
            {Object.keys(actionTables).map((action) => (
              <div
                key={action}
                onClick={() => {
                  const newAction = activeAction === action ? null : action;
                  setActiveAction(newAction);
                  if (newAction) fetchDetails(newAction);
                }}
                className={`bg-white/10 shadow-md rounded-lg p-2 sm:p-3 md:p-4 flex items-center justify-center cursor-pointer transition text-xs sm:text-sm
                ${activeAction === action ? "bg-blue-100/30 border border-blue-400" : "hover:bg-blue-50/20"}`}
              >
                <h2 className="text-white font-semibold text-center">{action}</h2>
              </div>
            ))}
          </div>

          {/* Dynamic Table */}
          {activeAction && (
            <div className="overflow-x-auto max-w-full bg-white/5 rounded-lg shadow-md p-2">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-between items-start sm:items-center mb-4">
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(e.target.value === "all" ? "all" : Number(e.target.value))}
                  className="border px-3 py-1 rounded-md text-xs sm:text-sm text-white w-full sm:w-auto"
                >
                  <option className="bg-gray-600" value={10}>10</option>
                  <option className="bg-gray-600" value={20}>20</option>
                  <option className="bg-gray-600" value={50}>50</option>
                  <option className="bg-gray-600" value="all">All</option>
                </select>

                {(activeAction === "Deposit" || activeAction === "Withdrawal") && (
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="border px-3 py-1 rounded-md text-xs sm:text-sm text-white w-full sm:w-auto"
                  >
                    <option className="bg-gray-600" value="All">All</option>
                    <option className="bg-gray-600" value="Completed">Completed</option>
                    <option className="bg-gray-600" value="Pending">Pending</option>
                    <option className="bg-gray-600" value="Rejected">Rejected</option>
                  </select>
                )}

                {/* Add Spread Button — only shows when Spread Setting is active */}
                {/* {activeAction === "Spread Setting" && (
                  <button
                    onClick={() => setShowAddSpreadModal(true)}
                    className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-xs sm:text-sm transition-colors"
                  >
                    <Plus size={14} /> Add Spread
                  </button>
                )} */}

                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border px-3 py-1 rounded-md text-xs sm:text-sm text-white w-full sm:w-auto"
                />
              </div>

              <div className="overflow-x-auto">
              <table className="min-w-full border border-white/20 text-center">
                <thead className="bg-white/10 text-white border-b border-white/20">
                  <tr>
                    {actionTables[activeAction].headers.map((header) => (
                      <th key={header} className="text-sm px-4 py-2 border-b border-white/20">{headerLabels[header] ?? header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  {paginatedData.length > 0 ? (
                    paginatedData.map((row, i) => (
                      <tr key={i} className="">
                        {actionTables[activeAction].headers.map((header) => (
                        <td key={header} className="px-4 py-2 text-xs">

{header === "S.NO" ? (
    startIndex + i + 1
) : header === "action" ? (
    activeAction === "LoginDetails" ? (
      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${
        row.action === 'login'
          ? "bg-green-500/20 text-green-400 border-green-500/30"
          : "bg-red-500/20 text-red-400 border-red-500/30"
      }`}>
        {row.action === 'login' ? "✅ Login" : "🚪 Logout"}
      </span>
    ) : (activeAction === "Order History" || activeAction === "Deposit" || activeAction === "Withdrawal") ? (
      <button
        onClick={() =>
          toggleVisibility(
            activeAction,
            row.trade_id || row.deposit_id || row.withdrawal_id,
            row.is_hidden
          )
        }
        className={`px-3 py-1 rounded text-white text-xs ${
          row.is_hidden
            ? "bg-green-600 hover:bg-green-700"
            : "bg-red-600 hover:bg-red-700"
        }`}
      >
        {row.is_hidden ? "Restore" : "Hide"}
      </button>
    ) : (
      row[header] ?? "-"
    )
) : header === "stop_loss" ? (

    row.stop_loss || row.sl_pnl ? (
        <div className="flex flex-col items-center">
            {row.stop_loss && <span>{row.stop_loss}</span>}
            {row.sl_pnl != null && (
                <span>
                    {row.sl_pnl >= 0 ? "+" : ""}
                    {row.sl_pnl} USD
                </span>
            )}
        </div>
    ) : "-"

) : header === "take_profit" ? (

    row.take_profit || row.tp_pnl ? (
        <div className="flex flex-col items-center">
            {row.take_profit && <span>{row.take_profit}</span>}
            {row.tp_pnl != null && (
                <span>
                    {row.tp_pnl >= 0 ? "+" : ""}
                    {row.tp_pnl} USD
                </span>
            )}
        </div>
    ) : "-"

) : header === "login_source" ? (
    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
      row.login_source === 'mobile_app'
        ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
        : "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
    }`}>
      {row.login_source === 'mobile_app' ? "📱 Mobile App" : "🌐 Website"}
    </span>
) : ["photo_id_1","photo_id_2","photo_id_3"].includes(header) ? (

    row[header] ? (
        <img
            src={row[header]}
            alt={header}
            className="w-20 h-20 object-cover rounded cursor-pointer"
            onClick={() => window.open(row[header], "_blank")}
        />
    ) : "-"

) : ["entry_time","exit_time","created_at","account_created_at"].includes(header) ? (

    formatUTC(row[header])

) : header === "lot_size" ? (

    Number(row[header] || 0).toString()

// ============ PER-PAIR SPREAD RENDERING START ============
) : header === "spread_id" ? (
    row.spread_id || row.id || "-"
) : header === "global_spread" ? (
    <span className="text-white font-medium">{row.global_spread ?? "-"}</span>
) : header === "user_spread" ? (
    <span className={`font-semibold ${row.user_spread !== null && row.user_spread !== undefined ? "text-cyan-400" : "text-yellow-400"}`}>
      {row.user_spread !== null && row.user_spread !== undefined ? row.user_spread : "Default"}
    </span>
) : header === "spread_status" ? (
    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
      row.user_spread !== null && row.user_spread !== undefined
        ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
        : "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }`}>
      {row.user_spread !== null && row.user_spread !== undefined ? "✅ Custom" : "Default"}
    </span>
) : header === "spread_action" ? (
    <div className="flex flex-col gap-1 items-center min-w-[130px]">
      <div className="flex gap-1 items-center">
        <input
          type="number"
          min="0"
          step="0.1"
          placeholder="Pips"
          value={spreadInputs[row.spread_id || row.id] || ""}
          onChange={(e) => setSpreadInputs(prev => ({ ...prev, [row.spread_id || row.id]: e.target.value }))}
          className="w-16 border border-white/20 rounded px-1.5 py-0.5 text-[10px] text-white bg-black/30 outline-none focus:border-cyan-400"
        />
        <button
          onClick={() => handleSetSpread(row.spread_id || row.id, row.symbol)}
          disabled={pairSpreadLoading[row.spread_id || row.id] || !spreadInputs[row.spread_id || row.id]}
          className="px-2 py-0.5 bg-cyan-600 hover:bg-cyan-700 rounded text-[10px] text-white disabled:opacity-50 transition-colors"
        >
          {pairSpreadLoading[row.spread_id || row.id] ? "..." : "Set"}
        </button>
      </div>
      {row.user_spread !== null && row.user_spread !== undefined && (
        <button
          onClick={() => handleResetSpread(row.spread_id || row.id, row.symbol)}
          disabled={pairSpreadLoading[row.spread_id || row.id]}
          className="px-2 py-0.5 bg-red-600 hover:bg-red-700 rounded text-[10px] text-white disabled:opacity-50 w-full transition-colors"
        >
          Reset to Default
        </button>
      )}
    </div>
// ============ PER-PAIR SPREAD RENDERING END ============

) : (

    row[header] ?? "-"

)}

</td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={actionTables[activeAction].headers.length} className="text-center py-4">No data found</td>
                    </tr>
                  )}
                </tbody>
              </table>
              </div>

              {activeAction === "Analytics" && (
                <div className="flex flex-col gap-12">
                  <div className="mt-10 flex items-center gap-5 justify-center">
                    <h2 className="text-2xl font-semibold">ADJUST PNL :</h2>
                    <input type="text" value={pnlAdd} onChange={(e)=> setPnlAdd(e.target.value)} placeholder="Enter ADD OR SUB PNL"
                    className="w-60 bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white outline-none" />
                  </div>
                  <div className="flex gap-10 justify-center">
                  <button className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition shadow-md w-60" onClick={()=> applyPNL("add")}>
                    ADD PNL
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition shadow-md w-60" onClick={()=> applyPNL("sub")}>
                    SUB PNL
                  </button>
                  </div>
                </div>
              )}

              {itemsPerPage !== "all" && totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="px-3 py-1 border rounded">First</button>
                  <button onClick={() => setCurrentPage(prev => prev - 1)} disabled={currentPage === 1} className="px-3 py-1 border rounded">Prev</button>
                  <span className="px-3 py-1">{currentPage} / {totalPages}</span>
                  <button onClick={() => setCurrentPage(prev => prev + 1)} disabled={currentPage === totalPages} className="px-3 py-1 border rounded">Next</button>
                  <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="px-3 py-1 border rounded">Last</button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Add Spread Modal */}
        {/* {showAddSpreadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-gray-900 border border-white/20 rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 relative">
              <button
                onClick={() => setShowAddSpreadModal(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              <h2 className="text-xl font-bold text-white mb-5 text-center">➕ Add New Spread</h2>
              <form onSubmit={handleAddSpread} className="flex flex-col gap-4">
                <div>
                  <label className="text-white/70 text-xs mb-1 block">Symbol *</label>
                  <input
                    type="text"
                    value={addSymbol}
                    onChange={(e) => setAddSymbol(e.target.value)}
                    placeholder="e.g. EURUSD"
                    className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-white/70 text-xs mb-1 block">Spread Value *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={addSpreadVal}
                    onChange={(e) => setAddSpreadVal(e.target.value)}
                    placeholder="e.g. 1.5"
                    className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-white/70 text-xs mb-1 block">IB Commission %</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={addCommission}
                    onChange={(e) => setAddCommission(e.target.value)}
                    placeholder="e.g. 5 (default 0)"
                    className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-white/70 text-xs mb-1 block">Category * (select at least one)</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {addCategories.map((cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => toggleAddCategory(cat)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                          addCategory.includes(cat)
                            ? "bg-cyan-600 text-white border-cyan-500"
                            : "bg-white/5 text-gray-400 border-white/20 hover:border-cyan-500/50"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={addSpreadLoading}
                  className="w-full py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mt-2"
                >
                  {addSpreadLoading ? "Adding..." : "Add Spread"}
                </button>
              </form>
            </div>
          </div>
        )} */}

        {showScrollBtn && (
          <button
            onClick={() => window.scrollTo({ top: scrollDirection === "down" ? document.body.scrollHeight : 0, behavior: "smooth" })}
            className="fixed bottom-8 right-0 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 animate-bounce"
          >
            {scrollDirection === "down" ? <ChevronDown /> : <ChevronUp />}
          </button>
        )}
        
      </AdminLayout>

    );
  };

  export default UserDetails;
  