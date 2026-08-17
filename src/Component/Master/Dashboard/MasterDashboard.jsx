import { useState, useEffect } from "react";
import MasterLayout from "../Layout/MasterLayout";
import { getMasterDashboardStats } from "../../../services/masterApi";
import { toast } from "react-toastify";
import {
  Building2,
  Globe,
  Users,
  TrendingUp,
  DollarSign,
  ActivitySquare,
  AlertCircle,
} from "lucide-react";

/**
 * MasterDashboard - Master Admin Platform Dashboard
 * Displays system-level KPIs and metrics
 * Connects to real backend API for stats
 */
const MasterDashboard = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    totalDomains: 0,
    activeDomains: 0,
    expiredDomains: 0,
    totalAdmins: 0,
    totalUsers: 0,
    todayRegistrations: 0,
    todayDeposits: 0,
    todayWithdrawals: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard stats from API
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getMasterDashboardStats();

      console.log("Dashboard Response:", response);

      if (response.status === "success") {
        const data = response.data;

        setStats({
          totalClients: data.system.totalClients || 0,
          activeClients: data.system.activeClients || 0,

          totalDomains: data.system.totalDomains || 0,
          activeDomains: data.system.activeDomains || 0,
          expiredDomains: data.system.expiredDomains || 0,

          totalAdmins: data.system.totalAdmins || 0,
          totalUsers: data.system.totalUsers || 0,

          todayRegistrations: data.system.todayRegistrations || 0,

          todayDeposits: data.deposits.completed || 0,
          todayWithdrawals: data.withdrawals.completed || 0,

          totalRevenue: data.wallets.liveBalance || 0,
          monthlyRevenue: data.trading.todayPnL || 0,
        });
      } else {
        setError(response.message || "Failed to fetch dashboard");
      }
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        err.message ||
        "Error fetching dashboard"
      );
    } finally {
      setLoading(false);
    }
  };
  
  const StatCard = ({ icon: Icon, title, value, unit = "", color = "blue" }) => {
    const colorClasses = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      purple: "from-purple-500 to-purple-600",
      orange: "from-orange-500 to-orange-600",
      red: "from-red-500 to-red-600",
      pink: "from-pink-500 to-pink-600",
    };

    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-400 font-medium text-sm">{title}</h3>
          <div className={`bg-gradient-to-br ${colorClasses[color]} p-3 rounded-lg`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        <p className="text-3xl font-bold text-white">
          {loading ? "..." : value}
          <span className="text-sm text-gray-400 ml-2">{unit}</span>
        </p>
        <p className="text-xs text-gray-500 mt-2">
          {loading ? "Loading..." : "Placeholder data - Step 1"}
        </p>
      </div>
    );
  };

  return (
    <MasterLayout>
      <div className="w-full">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Master Admin Dashboard
          </h1>
          <p className="text-gray-400 text-sm">
            Platform-level system overview and management
          </p>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Clients */}
          <StatCard
            icon={Building2}
            title="Total Clients"
            value={stats.totalClients}
            color="blue"
          />
          <StatCard
            icon={Building2}
            title="Active Clients"
            value={stats.activeClients}
            color="green"
          />

          {/* Domains */}
          <StatCard
            icon={Globe}
            title="Total Domains"
            value={stats.totalDomains}
            color="purple"
          />
          <StatCard
            icon={Globe}
            title="Active Domains"
            value={stats.activeDomains}
            color="green"
          />
          <StatCard
            icon={Globe}
            title="Expired Domains"
            value={stats.expiredDomains}
            color="red"
          />

          {/* Users & Admins */}
          <StatCard
            icon={Users}
            title="Total Admins"
            value={stats.totalAdmins}
            color="orange"
          />
          <StatCard
            icon={Users}
            title="Total Users"
            value={stats.totalUsers}
            color="pink"
          />

          {/* Activity */}
          <StatCard
            icon={ActivitySquare}
            title="Today's Registrations"
            value={stats.todayRegistrations}
            color="blue"
          />
          <StatCard
            icon={ActivitySquare}
            title="Today's Deposits"
            value={stats.todayDeposits}
            color="green"
          />
          <StatCard
            icon={ActivitySquare}
            title="Today's Withdrawals"
            value={stats.todayWithdrawals}
            color="orange"
          />

          {/* Revenue */}
          <StatCard
            icon={DollarSign}
            title="Total Revenue"
            value={stats.totalRevenue}
            unit="USD"
            color="green"
          />
          <StatCard
            icon={TrendingUp}
            title="Monthly Revenue"
            value={stats.monthlyRevenue}
            unit="USD"
            color="purple"
          />
        </div>

        {/* Placeholder Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Placeholder: User Growth Chart */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">User Growth</h2>
            <div className="h-48 flex items-center justify-center bg-gray-900 rounded">
              <p className="text-gray-500">
                📊 Chart placeholder - Will connect to API in Phase 2
              </p>
            </div>
          </div>

          {/* Placeholder: Revenue Chart */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">Revenue</h2>
            <div className="h-48 flex items-center justify-center bg-gray-900 rounded">
              <p className="text-gray-500">
                💰 Chart placeholder - Will connect to API in Phase 2
              </p>
            </div>
          </div>

          {/* Placeholder: Recent Activity */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
            <div className="h-48 flex items-center justify-center bg-gray-900 rounded">
              <p className="text-gray-500">
                📝 Activity feed placeholder - Will connect to API in Phase 2
              </p>
            </div>
          </div>

          {/* Placeholder: System Status */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">System Health</h2>
            <div className="h-48 flex items-center justify-center bg-gray-900 rounded">
              <p className="text-gray-500">
                🏥 System status placeholder - Will connect to API in Phase 2
              </p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-8 p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-yellow-200 font-medium">API Status</p>
              <p className="text-yellow-300 text-sm">{error}</p>
              <button
                onClick={fetchDashboardStats}
                className="mt-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </div>
    </MasterLayout>
  );
};

export default MasterDashboard;
