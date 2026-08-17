import React, { useState, useEffect, use } from "react";
import axios from "axios";
import img1 from "../../assets/img/ticket/img1.svg";
import img2 from "../../assets/img/ticket/img2.svg";
import img3 from "../../assets/img/ticket/img3.svg";
import { FiInfo } from "react-icons/fi";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import Sidebar from "../UnusedFiles/Sidebar";
import Navebar from "../UnusedFiles/Navbar";
import { useAuth } from "../context/AuthContext";
import { BACKEND_API_URL } from "../../api/config";
import useContactDetails from "../hooks/useContactDetails";
import DoinDashboardSidebar from "../DoinDashboardSidebar";
import NavbarForAccount from "../NavbarForAccount";
import { useTheme } from "../../context/ThemeContext";

/* ─── Dark mode overrides for browser-native elements ─── */
const darkModeCSS = `
  .dark input::placeholder { color: #6B6B80; }
`;

const Help = () => {
  const { isDark, toggleTheme } = useTheme();

  /* ─── Dark colour tokens (same as ProfilePage) ─── */
  const dk = {
    pageBg: "bg-[#141D22]",
    card: "bg-[#141D22]",
    cardAlt: "bg-[#141D22]",
    input: "bg-[#12121C] border-[#2A2A3C] text-[#EEEEF2]",
    border: "border-[#2A2A3C]",
    heading: "text-white",
    label: "text-[#BBBBCC]",
    value: "text-[#EEEEF2]",
    sub: "text-[#8888A0]",
    muted: "text-[#6B6B80]",
    tableHead: "bg-[#1A1A28] text-[#BBBBCC]",
    tableRow: "bg-[#141D22]",
    tableRowAlt: "bg-[#141D22]",
    searchBorder: "border-[#2A2A3C]",
    greenBadge: "bg-green-600 hover:bg-green-500",
    yellowBadge: "bg-yellow-500 text-[#1A1A00] hover:bg-yellow-400",
    selectHover: "hover:bg-[#1E1E2C]",
  };

  const { user } = useAuth();
  const [ticket, setTicket] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [ticketsPerPage, setTicketsPerPage] = useState(10);
  const { description, adminEmail, whatsapp, loading: contactLoading } = useContactDetails();

  useEffect(() => {
    if (!user) return;
    axios
      .get(`${BACKEND_API_URL}/support/support/user/${user.user_id}`)
      .then((res) => {
        const sortTickets = res.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setTicket(sortTickets);
      })
      .catch((err) => console.log("Ticket fetch error", err));
  }, [user]);

  const filterTicket = ticket.filter(
    (tick) =>
      tick.subject.toLowerCase().includes(search.toLowerCase()) ||
      String(tick.id).padStart(5, "0").includes(search)
  );

  const openChat = () => {
    if (window.Tawk_API) {
      window.Tawk_API.maximize();
    }
  };

  const formData = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}-${month}-${year}-${hours}-${minutes}`;
  };

  // Helper to get source display
  const getSourceDisplay = (source) => {
    if (source === 'mobile_app') {
      return { label: "📱 Mobile App", classes: "bg-purple-500/20 text-purple-400 border-purple-500/30" };
    }
    // Default to website (handles NULL and 'website')
    return { label: "🌐 Website", classes: isDark ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" : "bg-cyan-100 text-cyan-800 border-cyan-300" };
  };

  /* ─── Sun / Moon icons (same as ProfilePage) ─── */
  const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );

  const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? dk.pageBg : ""}`}>
      <style>{darkModeCSS}</style>

      <NavbarForAccount />
      <div className="flex">

        <div className="md:w-96">
          <DoinDashboardSidebar />
        </div>

        <div className="w-full flex flex-col gap-8 mt-4 mx-2 md:mx-10">

          {/* ─── Page Title + Toggle ─── */}
          <div className="flex items-center justify-center gap-3 mt-20 md:mt-20">
            <h3
              className={`font-bold text-3xl  md:block md:text-2xl transition-colors duration-300 ${
                isDark ? dk.heading : ""
              }`}
            >
              Help Center
            </h3>

       
          </div>

          {/* ─── Greeting Box ─── */}
          <div
            className={`flex flex-col gap-2 px-6 py-4 rounded-sm  transition-colors duration-300 ${
              isDark ? dk.card : "bg-[#F3F5F7]"
            }`}
          >
            <h3
              className={`font-bold text-xl transition-colors duration-300 ${
                isDark ? dk.heading : ""
              }`}
            >
              Hello, {user?.username || ""}. How can we assist you today?
            </h3>
            <p
              className={`font-light text-sm md:text-xl transition-colors duration-300 ${
                isDark ? dk.sub : ""
              }`}
            >
              Your one-stop solution for all support needs. Find answers,
              troubleshoot issues, and explore the support options we offer you.
            </p>
          </div>

          {/* ─── Contact Us Heading ─── */}
          <h2
            className={`font-bold text-2xl transition-colors duration-300 ${
              isDark ? dk.heading : ""
            }`}
          >
            Contact Us
          </h2>

          {/* ─── Contact Cards ─── */}
          <div className="flex justify-between flex-wrap gap-6 mx-10">

            {/* Box 1 – Open a ticket */}
            <div
              className={`flex flex-col border w-full rounded-sm md:w-96 md:min-h-[180px] transition-colors duration-300 ${
                isDark
                  ? `${dk.cardAlt} ${dk.border}`
                  : "border-[#8E8E8E] bg-[#F3F5F7]"
              }`}
            >
              <div className="flex flex-col justify-between flex-1 mx-2 gap-2 py-2 mb-3">
                <div className="flex flex-col gap-4 ml-2">
                  <h3
                    className={`font-bold mt-4 md:text-xl transition-colors duration-300 ${
                      isDark ? dk.heading : ""
                    }`}
                  >
                    Need Help?
                  </h3>
                  <p
                    className={`transition-colors duration-300 ${
                      isDark ? dk.sub : ""
                    }`}
                  >
                    Fill out the form, and our team will respond shortly.
                  </p>
                </div>
                <button
                  className="bg-[#1A7AF7] text-white ml-2 p-2 mt-5 rounded w-40 cursor-pointer hover:bg-[#1568D6] transition-colors duration-200"
                  onClick={() => navigate("/help/setting/support")}
                >
                  + Open a ticket
                </button>
              </div>
            </div>

            {/* Box 2 – Live Chat */}
            <div
              className={`flex flex-col border w-full rounded-sm md:w-96 md:min-h-[180px] transition-colors duration-300 ${
                isDark
                  ? `${dk.cardAlt} ${dk.border}`
                  : "border-[#8E8E8E] bg-[#F3F5F7]"
              }`}
            >
              <div className="flex flex-col justify-between flex-1 mx-2 gap-2 py-2">
                <div className="flex flex-col ml-2 gap-4 mt-3">
                  <h3
                    className={`font-bold md:text-xl transition-colors duration-300 ${
                      isDark ? dk.heading : ""
                    }`}
                  >
                    Live Chat!
                  </h3>
                  <p
                    className={`font-light transition-colors duration-300 ${
                      isDark ? dk.sub : ""
                    }`}
                  >
                    Didn't find what you were looking for? Connect instantly with
                    our Live Assistant.
                  </p>
                </div>
                <button
                  className="bg-[#1A7AF7] text-white font-medium p-2 cursor-pointer ml-2 mb-3 mt-auto rounded w-30 hover:bg-[#1568D6] transition-colors duration-200"
                  onClick={openChat}
                >
                  Start Chat
                </button>
              </div>
            </div>

            {/* Box 3 – Direct Contact */}
            <div
              className={`flex flex-col border w-full rounded-sm md:w-96 md:min-h-[180px] transition-colors duration-300 ${
                isDark
                  ? `${dk.cardAlt} ${dk.border}`
                  : "border-[#8E8E8E] bg-[#F3F5F7]"
              }`}
            >
              <div className="flex flex-col justify-between flex-1 mx-2 gap-2 py-2">
                <div className="ml-2">
                  <h3
                    className={`font-bold mt-3 md:text-xl transition-colors duration-300 ${
                      isDark ? dk.heading : ""
                    }`}
                  >
                    Still Have Questions?
                  </h3>
                  <div className="mt-2 flex flex-col gap-2">
                    <p
                      className={`transition-colors duration-300 ${
                        isDark ? dk.sub : ""
                      }`}
                    >
                      Reach out to our support team directly at:
                    </p>
                    <p
                      className={`transition-colors duration-300 ${
                        isDark ? dk.value : ""
                      }`}
                    >
                      📞 {whatsapp} (WhatsApp Number)
                    </p>
                    <p
                      className={`transition-colors duration-300 ${
                        isDark ? dk.value : ""
                      }`}
                    >
                      📧 {adminEmail} (E-mail)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── My Tickets Heading ─── */}
          <h2
            className={`font-bold text-2xl transition-colors duration-300 ${
              isDark ? dk.heading : ""
            }`}
          >
            My Tickets
          </h2>

          {/* ─── Ticket Table Section ─── */}
          <div
            className={`border rounded-sm mx-2 xl:mx-10 mb-8 p-2 md:p-0 transition-colors duration-300 ${
              isDark ? dk.border : "border-[#8E8E8E]"
            }`}
          >
            {/* Search Bar */}
            <div className="flex justify-center md:justify-end mt-3 mb-4">
              <div
                className={`flex items-center border rounded-sm w-full max-w-xs px-2 py-1 gap-2 transition-colors duration-300 ${
                  isDark ? dk.searchBorder : "border-[#8E8E8E]"
                }`}
              >
                <CiSearch
                  size={24}
                  className={isDark ? "text-[#8888A0]" : "text-gray-500"}
                />
                <input
                  className={`outline-none w-full text-sm md:text-base transition-colors duration-300 ${
                    isDark ? "bg-transparent text-[#EEEEF2]" : ""
                  }`}
                  type="text"
                  placeholder="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Empty State */}
            {filterTicket.length === 0 ? (
              <div className="flex flex-col mt-4 items-center justify-center pb-2 md:gap-6 md:mb-10">
                <FiInfo
                  size={30}
                  className={isDark ? "text-[#8888A0]" : "text-gray-500"}
                />
                <p
                  className={`font-bold md:text-xl text-center transition-colors duration-300 ${
                    isDark ? dk.heading : ""
                  }`}
                >
                  There is no ticket history
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto mt-5">
                <table className="w-full text-left border-collapse">
                  {/* Desktop Header */}
                  <thead
                    className={`hidden sm:table-header-group text-xs md:text-base transition-colors duration-300 ${
                      isDark ? dk.tableHead : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <tr className="text-center">
                      <th className="px-4 py-3">Subject</th>
                      <th className="px-4 py-3">Ticket ID</th>
                      <th className="px-4 py-3">Status</th>
                      {/* Source column header */}
                      {/* <th className="px-4 py-3">Source</th> */}
                      <th className="px-4 py-3">Date Created</th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody>
                    {filterTicket.map((tick, idx) => {
                      const sourceDisplay = getSourceDisplay(tick.ticket_source);
                      return (
                        <tr
                          key={tick.ticket_id}
                          className={`block sm:table-row border sm:border-none rounded-lg sm:rounded-none mb-4 sm:mb-0 shadow-sm sm:shadow-none transition-colors duration-300 ${
                            isDark
                              ? `${dk.tableRow} ${dk.border}`
                              : "bg-white border-gray-200"
                          }`}
                        >
                          {/* Subject */}
                          <td className="block sm:table-cell px-4 py-2">
                            <div className="flex justify-between sm:justify-center items-center w-full">
                              <span className={`font-bold sm:hidden ${isDark ? dk.label : ""}`}>Subject:</span>
                              <span className={`transition-colors duration-300 ${isDark ? dk.value : ""}`}>
                                {tick.subject}
                              </span>
                            </div>
                          </td>

                          {/* Ticket ID */}
                          <td className="block sm:table-cell px-4 py-2">
                            <div className="flex justify-between sm:justify-center items-center w-full">
                              <span className={`font-bold sm:hidden ${isDark ? dk.label : ""}`}>Ticket ID:</span>
                              <span className={`transition-colors duration-300 ${isDark ? dk.value : ""}`}>
                                {String(tick.ticket_id).padStart(5, "0")}
                              </span>
                            </div>
                          </td>

                          {/* Status Badge */}
                          <td className="block sm:table-cell px-4 py-2">
                            <div className="flex justify-between sm:justify-center items-center w-full">
                              <span className={`font-bold sm:hidden ${isDark ? dk.label : ""}`}>Status:</span>
                              <span
                                onClick={() =>
                                  navigate("/help/ticket", {
                                    state: { ticketId: tick.ticket_id },
                                  })
                                }
                                className={`cursor-pointer px-3 py-1 rounded-md sm:w-auto text-white text-sm text-center transition-colors duration-200 ${
                                  tick.replied_message
                                    ? isDark
                                      ? dk.greenBadge
                                      : "bg-green-400 hover:bg-green-500"
                                    : isDark
                                    ? dk.yellowBadge
                                    : "bg-yellow-300 text-[#8D5000] hover:bg-yellow-400"
                                }`}
                              >
                                {tick.replied_message ? "Closed" : "Open"}
                              </span>
                            </div>
                          </td>

                          {/* Source column */}
                          {/* <td className="block sm:table-cell px-4 py-2">
                            <div className="flex justify-between sm:justify-center items-center w-full">
                              <span className={`font-bold sm:hidden ${isDark ? dk.label : ""}`}>Source:</span>
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${sourceDisplay.classes}`}>
                                {sourceDisplay.label}
                              </span>
                            </div>
                          </td> */}

                          {/* Date */}
                          <td className="block sm:table-cell px-4 py-2">
                            <div className="flex justify-between sm:justify-center items-center w-full">
                              <span className={`font-bold sm:hidden ${isDark ? dk.label : ""}`}>Date:</span>
                              <span className={`transition-colors duration-300 ${isDark ? dk.value : ""}`}>
                                {formData(tick.created_at)}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ─── Bottom spacing for mobile nav ─── */}
          <div className="h-20 md:h-0" />

        </div>
      </div>
    </div>
  );
};

export default Help;
