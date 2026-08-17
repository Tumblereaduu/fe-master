import React, { useEffect, useState } from "react";
import IBSidebar from "../IBSidebar";
import IBNavbar from "../IBNavbar";
import currentImg from "../../../assets/img/ib/dashboard/current-image.svg";
import partnerImg from "../../../assets/img/ib/dashboard/partner-image.svg";
import copyImg from "../../../assets/img/ib/dashboard/copy-image.svg";
import { useAuth } from "../../context/AuthContext";
import { Slide, toast, ToastContainer } from "react-toastify";
import { BadgeCheck } from "lucide-react";
import axios from "../../../services/api";
import { BACKEND_API_URL } from "../../../api/config";
import useDashboardstats from "../../hooks/useDashboardStats";
import viewBanner from "../../hooks/viewBanner";
import { useTheme } from "../../../context/ThemeContext";

const IBDashboard = () => {
  const { user, token } = useAuth();
  const { isDark } = useTheme();
  const userId = user?.user_id || user?.id;
  const handleCopy = () => {
    navigator.clipboard.writeText(`https://onebluetrade.com/register?ref=${userId}`);
    toast.success("Copied to clipboard!");
  };
  const [ibStatus, setIbStatus] = useState("");
  const [totalearn, setTotalEarn] = useState("");
  const [ibKycStatus, setIbKycStatus] = useState("");
  const { dashboardStasts, setDashboardStats } = useDashboardstats();
  const { banners, setBanners } = viewBanner();

  const dk = {
    pageBg: "bg-[#141D22]",
    card: "bg-[#1A242B]",
    heading: "text-white",
    label: "text-[#8899A6]",
    value: "text-[#E8EDF0]",
    muted: "text-[#6B7B88]",
    linkText: "text-[#E8EDF0]",
    copyBorder: "border-[#2A3640]",
    copyHover: "hover:bg-[#222E38]",
    statTitle: "text-[#8899A6]",
    statValue: "text-white",
    adBg: "bg-[#1A242B]",
    dividerBorder: "border-[#2A3640]",
  };

  useEffect(() => {
    const fetchTotalEarnings = async () => {
      try {
        const res = await axios.get(`${BACKEND_API_URL}/ib/total-earnings/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.status === "success") {
          const data = res.data.data;
          setTotalEarn(data);
          setIbKycStatus(data?.ib_kyc_status || "Not submited");
          setIbStatus(data?.ib_status || "not");
        }
      } catch (error) {
        console.error("Failed to fetch total earnings", error);
      }
    };
    fetchTotalEarnings();
  }, [token, userId]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? dk.pageBg : "bg-white"}`}>
      <IBNavbar />

      <div className="flex pt-20">
        {/* Sidebar */}
        <div className="md:w-64 2xl:w-80">
          <IBSidebar />
        </div>
        <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" transition={Slide} />

        {/* Main */}
        <div className="flex-1 px-4 sm:px-4 lg:px-5 py-6 space-y-8">

          {/* TOP CARD */}
          <div className={`border-2 border-gray-300 rounded-lg p-5 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-8 lg:gap-10 lg:justify-between transition-colors duration-300 ${isDark ? dk.card : "bg-white"}`}>

            {/* Earnings Section */}
            <div className="flex flex-col xl:flex-row gap-8 lg:gap-14">
              <div className="flex items-center gap-4 sm:gap-6">
                <img
                  src={currentImg}
                  className="w-24 sm:w-28 lg:w-40"
                  alt="Current Earnings"
                />
                <div>
                  <p className={`text-sm sm:text-lg lg:text-[30px] font-medium transition-colors duration-300 ${isDark ? dk.muted : "text-[#111]"}`}>
                    Current Earnings
                  </p>
                  <h2 className={`text-2xl sm:text-3xl lg:text-[54px] font-extrabold leading-tight transition-colors duration-300 ${isDark ? dk.heading : "text-black"}`}>
                    $ {Number(dashboardStasts?.current_earnings || 0).toFixed(2)}
                  </h2>
                </div>
              </div>
            </div>

            {/* Partner Info */}
            <div className={`space-y-4 sm:space-y-5 px-6 lg:border-l-2 transition-colors duration-300 ${isDark ? dk.dividerBorder : "border-gray-300"}`}>
              <h3 className={`text-lg sm:text-xl lg:text-[30px] transition-colors duration-300 ${isDark ? dk.value : "text-black"}`}>
                Partner ID:
                <span className="font-extrabold ml-2 sm:ml-3">{userId || "N/A"}</span>
              </h3>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className={`text-sm sm:text-lg lg:text-[24px] transition-colors duration-300 ${isDark ? dk.label : "text-gray-700"}`}>
                  Account Status:
                </span>
                {ibStatus === "active" ? (
                  <span className="bg-[#008236] text-white px-3 sm:px-7 py-1 rounded-md text-md font-semibold">Active</span>
                ) : (
                  <span className="bg-[#E7000B] text-white px-3 sm:px-7 py-1 rounded-md text-md font-semibold">In Active</span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className={`text-sm sm:text-lg lg:text-[24px] transition-colors duration-300 ${isDark ? dk.label : "text-gray-700"}`}>
                  KYC Status:
                </span>
                {ibKycStatus === "completed" ? (
                  <span className="ml-2 inline-flex items-center px-5 py-0.5 text-xl font-semibold bg-[#160c4e] rounded-md">
                    <span className="bg-gradient-to-r from-[#FFD700] to-[#FFB347] bg-clip-text text-transparent font-bold">
                      Verified
                    </span>
                    <BadgeCheck
                      className="ml-2 w-5 h-5"
                      style={{
                        stroke: "url(#ibVerifiedGradient)",
                        fill: "none",
                      }}
                    />
                    <svg width="0" height="0">
                      <defs>
                        <linearGradient id="ibVerifiedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop stopColor="#FFD700" offset="0%" />
                          <stop stopColor="#FFB347" offset="100%" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                ) : (
                  <span className="bg-[#E7000B] text-white rounded-sm px-4 py-2">Not Verified</span>
                )}
              </div>
            </div>
          </div>

          {/* PARTNER LINK */}
          <div className={`mt-8 border rounded-lg overflow-hidden flex flex-col lg:flex-row lg:items-center transition-colors duration-300 ${isDark ? `${dk.card} ${dk.copyBorder}` : "bg-white border-gray-300"}`}>

            {/* Partner Link Label */}
            <div className="bg-blue-500 flex items-center justify-center gap-2 px-3 py-3 lg:px-8 lg:py-5 w-full lg:w-auto">
              <img src={partnerImg} className="w-6 lg:w-10" alt="Partner" />
              <span className="text-white text-sm lg:text-[20px] font-semibold italic">
                Partner Link
              </span>
            </div>

            {/* Link */}
            <div className={`w-full flex-1 px-3 py-3 lg:px-6 lg:py-1 text-xs sm:text-sm lg:text-[20px] break-all text-center lg:text-left transition-colors duration-300 ${isDark ? dk.linkText : "text-gray-800"}`}>
              https://onebluetrade.com/register?ref={userId}
            </div>

            {/* Copy Button */}
            <div
              onClick={handleCopy}
              className={`w-full lg:w-auto flex items-center justify-center gap-2 px-3 py-3 lg:px-6 lg:py-5 border-t lg:border-t-0 lg:border-l cursor-pointer transition-colors duration-200 ${isDark ? `${dk.copyBorder} ${dk.copyHover}` : "border-gray-300 hover:bg-gray-50"}`}
            >
              <img src={copyImg} className={`w-4 lg:w-6 transition-all duration-200 ${isDark ? "brightness-0 invert" : ""}`} alt="Copy" />
              <span className={`text-xs lg:text-[18px] font-medium transition-colors duration-200 ${isDark ? dk.value : ""}`}>
                Click To Copy
              </span>
            </div>
          </div>

          {/* STATS + AD */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Stats */}
            <div className="order-2 md:order-none lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                ["Total Revenue", `$ ${Number(dashboardStasts.total_revenue || 0).toFixed(2)}`],
                ["Total Clients", `${dashboardStasts.total_clients || 0}`],
                ["This Month Revenue", `$ ${Number(dashboardStasts.month_revenue || 0).toFixed(2)}`],
                ["This Month Clients", `${dashboardStasts.month_clients || 0}`],
                ["Yesterday Revenue", `$ ${Number(dashboardStasts.yesterday_revenue || 0).toFixed(2)}`],
                ["Yesterday Clients", `${dashboardStasts.yesterday_clients || 0}`],
              ].map(([title, value], i) => (
                <div
                  key={i}
                  className={`border-2 border-gray-300 rounded-lg p-6 transition-colors duration-300 ${isDark ? dk.card : "bg-white"}`}
                >
                  <p className={`text-[18px] font-medium transition-colors duration-300 ${isDark ? dk.statTitle : "text-gray-800"}`}>
                    {title}
                  </p>
                  <h2 className={`text-[36px] font-extrabold mt-2 transition-colors duration-300 ${isDark ? dk.statValue : "text-black"}`}>
                    {value}
                  </h2>
                </div>
              ))}
            </div>
        {/* AD */}
            {/* STRICT: Only show banners where location='ib_dashboard' AND status='active' - NO fallback to other locations */}
            {(() => {
                const ibBanner = banners.find(b => b.location === 'ib_dashboard' && b.status === 'active');
                return ibBanner ? (
                     <div className={`order-1 border-2 border-gray-300 rounded-lg flex items-center justify-center text-[32px] font-bold transition-colors duration-300 ${isDark ? `${dk.adBg} ${dk.statValue}` : "bg-[#FAFAFA] text-black"}`}>
                        <img src={ibBanner.image} alt="N/A" className="w-full h-full object-cover rounded-lg" />
                    </div>
                ) : null;
            })()}
          </div>

        </div>
      </div>
    </div>
  );
};

export default IBDashboard;
