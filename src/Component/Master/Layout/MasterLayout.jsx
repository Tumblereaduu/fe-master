import React, { useState } from "react";
import MasterNavbar from "./MasterNavbar";
import MasterSidebar from "./MasterSidebar";

/**
 * MasterLayout - Layout wrapper for all Master Admin pages
 * Ensures consistent navbar, sidebar, and responsive mobile drawer across all pages
 * 
 * Usage:
 * <MasterLayout>
 *   <YourMasterPageContent />
 * </MasterLayout>
 */
const MasterLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-x-hidden">
      {/* Navbar */}
      <header className="sticky top-0 z-50">
        <MasterNavbar
          mobileDrawerOpen={mobileDrawerOpen}
          setMobileDrawerOpen={setMobileDrawerOpen}
        />
      </header>

      {/* Sidebar */}
      <MasterSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileDrawerOpen={mobileDrawerOpen}
        setMobileDrawerOpen={setMobileDrawerOpen}
      />

      {/* Main Content */}
      <main
        className={`flex-1 flex flex-col min-h-screen mt-12 md:mt-10 ml-0 ${
          collapsed ? "md:ml-20" : "md:ml-50"
        }`}
      >
        <div className="flex-1 px-2 sm:px-4 md:px-6 lg:px-8 py-6 md:py-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MasterLayout;
