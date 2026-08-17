import React, { useState, useRef, useEffect } from "react";
import { LogOut, Menu } from "lucide-react";
import logo from "../../assets/img/logo/Doin FX.svg";
import { NavLink, useNavigate } from "react-router-dom";
import { BACKEND_API_URL } from "../../api/config";
import { adminRoutes } from "../../App";
import Cookies from "js-cookie";

const AdminNavbar = ({ mobileDrawerOpen, setMobileDrawerOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [stats, setStats] = useState({});
  const [adminName, setAdminName] = useState("")
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const [utcTime, setUtcTime] = useState("");

  // ─── Notification System Refs ───
  const audioRef = useRef(null);
  const soundIntervalRef = useRef(null);
  const previousStatsRef = useRef(null);
  const notificationPermissionRef = useRef(false);
  const isInitialLoadRef = useRef(true);
  const isAudioUnlockedRef = useRef(false); // ✅ NEW: Track if audio is unlocked

  // Get permissions from adminInfo
  const adminInfoRaw = Cookies.get("adminInfo");

  const permissions = adminInfoRaw
    ? JSON.parse(adminInfoRaw)?.permission?.map(p => p.toLowerCase().trim())
    : [];

  // live utc time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const utc = now.toUTCString();
      setUtcTime(utc.replace("GMT", ""));
    };
    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // ✅ FIXED: "Cookie" → "Cookies"
  useEffect(() => {
    const adminInfo = Cookies.get("adminInfo")
      ? JSON.parse(Cookies.get("adminInfo"))  // ← FIXED HERE!
      : null;

    if (adminInfo?.admin_name) {
      setAdminName(adminInfo.admin_name);
    }
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ───────────────────────────────────────────────────────────
  // NOTIFICATION SYSTEM FUNCTIONS
  // ───────────────────────────────────────────────────────────

  // Request browser notification permission on app load
  const requestNotificationPermission = () => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          notificationPermissionRef.current = true;
        }
      });
    } else if ("Notification" in window && Notification.permission === "granted") {
      notificationPermissionRef.current = true;
    }
  };

  // ✅ NEW: Unlock audio playback after first user interaction
  // Modern browsers (Chrome, Edge, Firefox, Brave) require user interaction before autoplay
  const unlockAudio = () => {
    if (isAudioUnlockedRef.current || !audioRef.current) {
      return;
    }

    try {
      // Attempt to play and immediately pause
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            isAudioUnlockedRef.current = true;
            console.log("✅ Audio unlocked successfully");
          })
          .catch((error) => {
            console.warn("⚠️ Audio unlock failed:", error);
          });
      }
    } catch (error) {
      console.warn("⚠️ Error unlocking audio:", error);
    }
  };

  // Play notification sound repeatedly
  const playNotificationSound = () => {
    // Prevent multiple sound loops from running simultaneously
    if (soundIntervalRef.current) {
      console.log("⚠️ Sound already playing, skipping");
      return;
    }

    if (!audioRef.current) {
      console.warn("⚠️ Audio element not initialized");
      return;
    }

    if (!isAudioUnlockedRef.current) {
      console.warn("⚠️ Audio not unlocked yet. Unlock happens after first user interaction");
      return;
    }

    try {
      // Play the sound immediately
      audioRef.current.currentTime = 0;
      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("⚠️ Initial audio playback failed:", error);
        });
      }

      // Play sound every 2 seconds for 10 seconds (5 times total)
      let soundCount = 0;
      soundIntervalRef.current = setInterval(() => {
        soundCount++;

        if (soundCount >= 5) {
          // 5 iterations × 2 seconds = 10 seconds total
          clearInterval(soundIntervalRef.current);
          soundIntervalRef.current = null;
          console.log("✅ Notification sound stopped after 10 seconds");
          return;
        }

        try {
          audioRef.current.currentTime = 0;
          const playPromise = audioRef.current.play();

          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.warn("⚠️ Repeated audio playback failed:", error);
            });
          }
        } catch (error) {
          console.warn("⚠️ Error during sound replay:", error);
        }
      }, 2000);
    } catch (error) {
      console.error("❌ Error starting notification sound:", error);
    }
  };

  // Stop notification sound
  const stopNotificationSound = () => {
    if (soundIntervalRef.current) {
      clearInterval(soundIntervalRef.current);
      soundIntervalRef.current = null;
    }
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch (error) {
        console.warn("⚠️ Error stopping audio:", error);
      }
    }
  };

  // Show browser notification
  const showBrowserNotification = (title, body) => {
    if ("Notification" in window && notificationPermissionRef.current) {
      try {
        new Notification(title, {
          body: body,
          icon: logo,
          tag: "admin-notification",
        });
      } catch (error) {
        console.warn("⚠️ Error showing browser notification:", error);
      }
    }
  };

  // Check for new requests by comparing stats
  const checkForNewRequests = (previousStats, currentStats) => {
    if (!previousStats) {
      return;
    }

    const newRequests = [];

    // Map of stat keys to notification messages
    const notificationMap = {
      deposits: "New Deposit Request",
      withdrawals: "New Withdrawal Request",
      pendingKYC: "New KYC Verification Request",
      support: "New Support Ticket",
      ibPending: "New IB Deposit Request",
      ibKYCPending: "New IB KYC Request",
    };

    // Check each stat to see if it increased
    Object.entries(notificationMap).forEach(([key, message]) => {
      const prevValue = previousStats[key] || 0;
      const currentValue = currentStats[key] || 0;

      // Only trigger notification if count increased
      if (currentValue > prevValue) {
        newRequests.push(message);
      }
    });

    // Handle all new requests
    if (newRequests.length > 0) {
      newRequests.forEach((message) => {
        // Play sound
        playNotificationSound();

        // Show browser notification
        showBrowserNotification("New Admin Notification", message);
      });
    }
  };

  // ✅ NEW: Test notification function for debugging
  const testNotification = () => {
    console.log("🔔 Testing notification sound...");
    if (!isAudioUnlockedRef.current) {
      console.warn("⚠️ Audio not unlocked. Click anywhere on the page first to unlock audio.");
      return;
    }
    playNotificationSound();
    showBrowserNotification("Test Notification", "This is a test notification sound");
  };

  // ───────────────────────────────────────────────────────────
  // REQUEST NOTIFICATION PERMISSION ON MOUNT
  // ───────────────────────────────────────────────────────────
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // ───────────────────────────────────────────────────────────
  // INITIALIZE AUDIO REF - Using public folder path
  // ───────────────────────────────────────────────────────────
  useEffect(() => {
    try {
      // ✅ FIXED: Use public folder path instead of src
      audioRef.current = new Audio("/notification.mp3");
      audioRef.current.preload = "auto";
      audioRef.current.volume = 1; // ✅ NEW: Ensure volume is set
      console.log("✅ Audio initialized successfully");
    } catch (error) {
      console.error("❌ Error initializing audio:", error);
    }
  }, []);

  // ───────────────────────────────────────────────────────────
  // ADD CLICK/TOUCH LISTENER TO UNLOCK AUDIO
  // ───────────────────────────────────────────────────────────
  useEffect(() => {
    const handleUserInteraction = () => {
      unlockAudio();
      // Remove listener after first interaction to improve performance
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };

    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("keydown", handleUserInteraction);
    document.addEventListener("touchstart", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };
  }, []);

  // ───────────────────────────────────────────────────────────
  // FETCH STATS AND POLL FOR CHANGES
  // ───────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BACKEND_API_URL}/admindash`);
        const data = await res.json();

        if (data.success) {
          // Check for new requests (skip on initial load)
          if (!isInitialLoadRef.current) {
            checkForNewRequests(previousStatsRef.current, data.stats);
          } else {
            isInitialLoadRef.current = false;
          }

          // Update stats state for UI
          setStats(data.stats);

          // Store current stats as previous for next comparison
          previousStatsRef.current = data.stats;
        }
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      }
    };

    // Fetch immediately on mount
    fetchData();

    // Poll every 5 seconds
    const pollInterval = setInterval(fetchData, 5000);

    // Cleanup: Clear interval and stop sound on unmount
    return () => {
      clearInterval(pollInterval);
      stopNotificationSound();
    };
  }, []);

  // Badge style helper
  const badgeStyle = (color) =>
    `ml-2 px-1.5 py-0.5 rounded-full text-white font-semibold text-[10px] transition-transform duration-300 transform hover:scale-110 ${color}`;

  return (
    <div className="w-full bg-gray-900 border-b border-black shadow-sm flex items-center justify-between px-2 sm:px-4 md:px-6 py-3 fixed top-0 left-0 right-0 z-50">
      {/* Left side — Logo + Hamburger */}
      <div className="flex items-center space-x-2 md:space-x-3">
        {/* Hamburger Button (Mobile Only) */}
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="md:hidden text-white p-1.5 hover:bg-gray-800 rounded transition-colors"
          title="Toggle Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        {/* Logo */}
        <div className="flex items-center space-x-1 sm:space-x-2 cursor-pointer" onClick={() => navigate(`${adminRoutes}dashboard`)}>
          <img src={logo} alt="Doin FX" className="w-20 sm:w-24 md:w-30 object-contain" />
        </div>
      </div>

      {/* Right side — Links */}
      <div className="hidden md:flex items-center space-x-3 lg:space-x-6 text-[10px] sm:text-[12px] md:text-[13px]">
        {/* Deposit */}
        {
          permissions.includes("deposits") && (
            <NavLink className="text-white hover:text-gray-400 flex items-center" to={`${adminRoutes}deposit`}>
              Deposit
              {stats.deposits > 0 && (
                <span className={badgeStyle("bg-yellow-500 animate-pulse")}>{stats.deposits}</span>
              )}
            </NavLink>
          )
        }
        {/* Withdrawal */}
        {
          permissions.includes("withdrawals") && (
            <NavLink className="text-white hover:text-gray-400 flex items-center" to={`${adminRoutes}withdraw`}>
              Withdrawal
              {stats.withdrawals > 0 && (
                <span className={badgeStyle("bg-orange-500 animate-pulse")}>{stats.withdrawals}</span>
              )}
            </NavLink>
          )
        }

        {/* Support */}
        {
          permissions.includes("tickets") && (
            <NavLink className="text-white hover:text-gray-400 flex items-center" to={`${adminRoutes}support`}>
              Support
              {stats.support > 0 && (
                <span className={badgeStyle("bg-pink-500 animate-pulse")}>{stats.support}</span>
              )}
            </NavLink>
          )
        }

        {/* KYC */}
        {
          permissions.includes("kyc") && (
            <NavLink className="text-white hover:text-gray-400 flex items-center" to={`${adminRoutes}kyc`}>
              KYC Verification
              {stats.pendingKYC > 0 && (
                <span className={badgeStyle("bg-indigo-500 animate-pulse")}>{stats.pendingKYC}</span>
              )}
            </NavLink>
          )
        }

        {/* IB */}
        {
          permissions.includes("ib") && (
            <NavLink className="text-white hover:text-gray-400 flex items-center" to={`${adminRoutes}admin/ib/deposit`}>
              IB Deposit
              {stats.ibPending > 0 && (
                <span className={badgeStyle("bg-[#10B981] animate-pulse")}>{stats.ibPending}</span>
              )}
            </NavLink>
          )
        }

        {/* IB KYC */}
        {
          permissions.includes("ib") && (
            <NavLink className="text-white hover:text-gray-400 flex items-center" to={`${adminRoutes}admin/ib/kyc`}>
              IB KYC
              {stats.ibKYCPending > 0 && (
                <span className={badgeStyle("bg-[#FE01E7] animate-pulse")}>{stats.ibKYCPending}</span>
              )}
            </NavLink>
          )
        }
      </div>

      {/* User dropdown */}
      {/* live utc time display */}
      <div className="hidden lg:block text-white text-[11px]">
        <div className="text-white">
          <span className="font-semibold text-orange-400">UTC Time:</span> {utcTime}
        </div>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-1 text-white cursor-pointer focus:outline-none text-[11px] sm:text-[12px]"
        >
          <span className="font-medium  sm:inline">{adminName || "Admin"}</span>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-gray-800 text-white rounded-lg shadow-lg border border-gray-700 z-50">
            <ul className="py-2 text-sm">
              <li className="px-4 py-2 hover:bg-gray-700 flex items-center space-x-2 text-red-400 cursor-pointer" onClick={() => {
                // ✅ EXISTING: Clear Cookies
                Cookies.remove("adminInfo");
                Cookies.remove("admin_menu");
                Cookies.remove("adminToken");
                Cookies.remove("isAdminLoggedIn");
                Cookies.remove("token_exp");

                // ✅ NEW: Also clear localStorage (for getAdminInfo helper)
                localStorage.removeItem("token");
                localStorage.removeItem("admin");

                navigate(`${adminRoutes}login`)
              }}>
                <LogOut size={16} />
                <span>Logout</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNavbar;
