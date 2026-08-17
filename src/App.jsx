import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
// import Navbar from "./Component/Navbar";
import { Toaster } from "react-hot-toast";
import Login from "./Component/Login/Login";
import Navbar from "./Component/UnusedFiles/Navbar";
import Sidebar from "./Component/UnusedFiles/Sidebar";
import Register from "./Component/RegisterPage/Register";
import Contact from "./Component/RegisterPage/Contact";
import ForgotPassword from "./Component/ForgotPassword/Forgotpassword";
import EnterOTP from "./Component/ForgotPassword/Enterotppage";
import ResetPassword from "./Component/ForgotPassword/Resetpassword";
import Dashboard from "./Component/Dashboard/Dashboard";
import ReferralPage from "./Component/RegisterPage/Referralpage";
import ProfilePage from "./Component/ProfilePage/Profilepage";
import NewPassword from "./Component/Change-Password/Newpassword";
import OpenTradePage from "./Component/tradepage/Opentradepage";
import KYC from "./Component/KYCManagement/KYC";
import Help from "./Component/SupportTicket/Help";
import Setting from "./Component/SupportTicket/Setting";
import Support from "./Component/SupportTicket/Support";
import Deposit from "./Component/Deposit/Deposit";
import DashboardNavebar from "./Component/DepositNavbar/DashboardNavebar";
import Bank from "./Component/Deposit/Bank";
import Withdrawpage from "./Component/ManageWithdrawals/Withdrawpage";
import Savebank from "./Component/ManageWithdrawals/Savebank";
import BankTransfer from "./Component/ManageWithdrawals/BankTransfer";
import UPI from "./Component/ManageWithdrawals/UPI";
import Watingwithdraw from "./Component/ManageWithdrawals/Waitingwithdraw";
import Popup from "./Component/KYCManagement/Popup";
import Ticketsummary from "./Component/SupportTicket/Ticketsummary";
import PositionHistory from "./Component/PositionPage/Position";
import Admin from "./Component/AdminTicket/Admin";
import Reply from "./Component/AdminTicket/Reply";
import AdminDeposit from "./Component/AdminDeposit/AdminDeposit";
import AdminSidenav from "./Component/Admin/AdminSidenav";
import DepositReply from "./Component/AdminDeposit/DepositReply";
import RejectPop from "./Component/AdminDeposit/RejectPop";
import AdminWithdraw from "./Component/AdminWithdrawal/AdminWithdraw";
import AdminReason from "./Component/AdminWithdrawal/AdminReason";
import AdminLoginPage from "./Component/AddAdminPage/AdminLoginPage";
import AddAdmin from "./Component/AddAdminPage/AddAdmin";
import AddFund from "./Component/AdminDeposit/AddFund";
import { AuthProvider } from "./Component/context/AuthContext";
import UpdateAdimWallet from "./Component/AdminUpdateWallet/UpdateAdimWallet";
import AdminKyc from "./Component/AdminKYC/AdminKyc";
import KYCview from "./Component/AdminKYC/KYCview";
import AdminDashboard from "./Component/Admin/AdminDashboard";
import AdminNavbar from "./Component/Admin/AdminNavebar";
import AdminSidebar from "./Component/Admin/AdminSidebar";
import SetValue from "./Component/DepositRate/SetValue";
import USDT from "./Component/PaymentMode/USDT";
import Upi from "./Component/PaymentMode/Upi";
import BankPayment from "./Component/PaymentMode/BankPayment";
import AddBank from "./Component/PaymentMode/AddBank";
import OpenOrder from "./Component/orderPage/OpenOrder";
import PendingOrder from "./Component/orderPage/PendingOrder";
import EditopenOrder from "./Component/orderPage/EditopenOrder";
import BuyOrder from "./Component/orderPage/BuyOrder";
import SellOrder from "./Component/orderPage/SellOrder";
import Adduser from "./Component/adminAddUser/Adduser";
import Alluser from "./Component/adminAddUser/Alluser";
import InactiveUsers from "./Component/adminAddUser/InactiveUser";
import MonitorUsers from "./Component/adminAddUser/Monitoruser";
import Singleuser from "./Component/adminAddUser/Singleuser";
import UserDetails from "./Component/adminAddUser/UserDetails";
import EditBuyOrder from "./Component/orderPage/EditBuyOrder";
import CreateBanner from "./Component/AdminBanner/CreateBanner"
import ViewBanner from "./Component/AdminBanner/ViewBanner";
import Spread from "./Component/AdminSpread/spread";
import ProtectedRoute from "./Component/ProtectedRoutes/ProductedRoutes";
import AddSpread from "./Component/AdminSpread/AddSpread";
import EditSpread from "./Component/AdminSpread/EditSpread";
import "react-toastify/dist/ReactToastify.css"
import { ToastContainer, Slide } from "react-toastify";
import ViewAdmin from "./Component/AddAdminPage/ViewAdmin";
import EditAdmin from "./Component/AddAdminPage/EditAdmin";
import AdminSquareOff from "./Component/AdminSquareoff/AdminSquareOff";
import EditEmail from "./Component/adminAddUser/EditEmail";
import WithdrawalHistory from "./Component/History/WithdrawalHistory";
import DepositHistory from "./Component/History/DepositHistory";
import DepositDynamic from "./Component/Deposit/DepositDynamic";
import { AccountTypeProvider } from "./Component/hooks/accountTypeContext";
import DemoBuyOrder from "./Component/orderPage/DemoBuyOrder";
import DemoSellOrder from "./Component/orderPage/DemoSellOrder";
import AdminProtectedRoute from "./Component/ProtectedRoutes/AdminProtectedRoute";
import MasterProtectedRoute from "./Component/ProtectedRoutes/MasterProtectedRoute";
import AddKYC from "./Component/AdminKYC/AddKYC";
import AdminLP from "./Component/AdminLP/AdminLP";
import MasterLogin from "./Component/Master/Login/MasterLogin";
import MasterDashboard from "./Component/Master/Dashboard/MasterDashboard";
import ClientsPage from "./Component/Master/Clients/ClientsPage";
import CreateClient from "./Component/Master/Clients/CreateClient";
import ClientDetails from "./Component/Master/Clients/ClientDetails";
import EditClient from "./Component/Master/Clients/EditClient";
import DomainsPage from "./Component/Master/Domains/DomainsPage";
import CreateDomain from "./Component/Master/Domains/CreateDomain";
import DomainDetails from "./Component/Master/Domains/DomainDetails";
import EditDomain from "./Component/Master/Domains/EditDomain";
import AdminsPage from "./Component/Master/Admins/AdminsPage";
import CreateAdmin from "./Component/Master/Admins/CreateAdmin";
import AdminDetails from "./Component/Master/Admins/AdminDetails";
import EditMasterAdmin from "./Component/Master/Admins/EditAdmin";
import IBDashboard from "./Component/IB/User/IBDashboard";
import IBCommision from "./Component/IB/Admin/IBCommision";
import IBDeposit from "./Component/IB/User/IBDeposit";
import IBKYC from "./Component/IB/User/IBKYC";
import IBMyClients from "./Component/IB/User/IBMyClients";
import IBEarnings from "./Component/IB/User/IBEarnings";
import AdminIBKYC from "./Component/IB/Admin/AdminIBKYC";
import AdminIBKYCView from "./Component/IB/Admin/AdminIBKYCView";
import AdminIBDeposit from "./Component/IB/Admin/AdminIBDeposit";
import AdminIBDepositReply from "./Component/IB/Admin/AdminIBDepositReply";
import Crypto from "./Component/PaymentMode/Crypto";
import DepositPage from "./Component/Newdeposit/DepositPage";
import BitCoin from "./Component/Newdeposit/BitCoin";
import WithdrawalPage from "./Component/NewWithdraw/WithdrawalPage";
import USDTTRC20 from "./Component/Newdeposit/USDTTRC20";
import USDTERC20 from "./Component/Newdeposit/USDTERC20";
import AdminAllCommission from "./Component/IB/Admin/AdminAllCommission";
import DemoBuyEdit from "./Component/orderPage/DemoBuyEdit";
import DemoSellEdit from "./Component/orderPage/DemoSellEdit";
import WithdrawalUsdtTRC20 from "./Component/NewWithdraw/WithdrawalUsdtTRC20";
import WithdrawalUsdtERC20 from "./Component/NewWithdraw/WithdrawalUsdtERC20";
import AccountDelete from "./Component/AccountDelete/AccountDelete";
import AdminAccountDelete from "./Component/AdminAccountDelete/AdminAccountDelete";
// import AdminLogin from "./pages/insights/AdminLogin";
// import AdminDashboards from "./pages/insights/AdminDashboards";
// import TradingSignals from "./pages/insights/TradingSignals";
// import News from "./pages/insights/News";

export const adminRoutes = '/19fa78d42b6e34/vmkp/'


function AppWrapper() {
  
  return (
    <>
      {/* Show Navbar once with conditional prop */}
      {/* <Navbar showRegisterLink={isLoginPage} /> */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} pauseOnFocusLoss draggable transition={Slide} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/sidebar" element={<Sidebar />} />

        {/* ─── MASTER ADMIN ROUTES ─── */}
        <Route path="/master/login" element={<MasterLogin />} />
        <Route path="/master/dashboard" element={<MasterProtectedRoute><MasterDashboard /></MasterProtectedRoute>} />
        
        {/* Client Management */}
        <Route path="/master/clients" element={<MasterProtectedRoute><ClientsPage /></MasterProtectedRoute>} />
        <Route path="/master/clients/create" element={<MasterProtectedRoute><CreateClient /></MasterProtectedRoute>} />
        <Route path="/master/clients/:clientId" element={<MasterProtectedRoute><ClientDetails /></MasterProtectedRoute>} />
        <Route path="/master/clients/:clientId/edit" element={<MasterProtectedRoute><EditClient /></MasterProtectedRoute>} />
        
        {/* Domain Management */}
        <Route path="/master/domains" element={<MasterProtectedRoute><DomainsPage /></MasterProtectedRoute>} />
        <Route path="/master/domains/create" element={<MasterProtectedRoute><CreateDomain /></MasterProtectedRoute>} />
        <Route path="/master/domains/:domainId" element={<MasterProtectedRoute><DomainDetails /></MasterProtectedRoute>} />
        <Route path="/master/domains/:domainId/edit" element={<MasterProtectedRoute><EditDomain /></MasterProtectedRoute>} />
        
        {/* Admin Management */}
        <Route path="/master/admins" element={<MasterProtectedRoute><AdminsPage /></MasterProtectedRoute>} />
        <Route path="/master/admins/create" element={<MasterProtectedRoute><CreateAdmin /></MasterProtectedRoute>} />
        <Route path="/master/admins/:adminId" element={<MasterProtectedRoute><AdminDetails /></MasterProtectedRoute>} />
        <Route path="/master/admins/:adminId/edit" element={<MasterProtectedRoute><EditMasterAdmin /></MasterProtectedRoute>} />

        {/* Register Page */}
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/referral" element={<ReferralPage />} />

        {/* ForgotPassword */}
        <Route path="/forgot_password" element={<ForgotPassword />} />
        <Route path="/enter_otp" element={<EnterOTP />} />
        <Route path="/reset_password" element={<ResetPassword />} />

        {/* Profile */}
        <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute> <ProfilePage /> </ProtectedRoute>} />
        <Route path="/kyc" element={<ProtectedRoute> <KYC /> </ProtectedRoute>} />
        <Route path="/pop" element={<ProtectedRoute><Popup /></ProtectedRoute>}></Route>
        <Route path="/change_password" element={<ProtectedRoute> <NewPassword /> </ProtectedRoute>} />

        {/* Support ticket */}
        <Route path="/help" element={<ProtectedRoute> <Help /> </ProtectedRoute>}></Route>
        <Route path="/help/setting" element={<ProtectedRoute> <Setting /> </ProtectedRoute>}></Route>
        <Route path="/help/setting/support" element={<ProtectedRoute> <Support /> </ProtectedRoute>}></Route>
        <Route path="/help/ticket" element={<ProtectedRoute> <Ticketsummary /> </ProtectedRoute>}></Route>


        {/* Deposit page */}
        {/* <Route path="/deposit" element={<ProtectedRoute><Deposit /></ProtectedRoute>} /> */}
        <Route path="/deposit/:type" element={<ProtectedRoute> <DepositDynamic /> </ProtectedRoute>} />
        <Route path="/deposit/bank" element={<ProtectedRoute><Bank /></ProtectedRoute>} />

        <Route path="/deposit" element={<ProtectedRoute><DepositPage /></ProtectedRoute>} />
        <Route path="/deposit/bitcoin" element={<ProtectedRoute><BitCoin /></ProtectedRoute>} />
        <Route path="/deposit/usdt/trc20" element={<ProtectedRoute><USDTTRC20 /></ProtectedRoute>} />
        <Route path="/deposit/usdt/erc20" element={<ProtectedRoute><USDTERC20 /></ProtectedRoute>} />

        <Route path="/withdraw" element={<ProtectedRoute><WithdrawalPage /></ProtectedRoute>} />


        {/* Withdrawal page */}
        {/* <Route path="/withdraw" element={<ProtectedRoute><Withdrawpage /></ProtectedRoute>}></Route> */}
        <Route path="/withdraw/:type" element={<ProtectedRoute><Watingwithdraw /> </ProtectedRoute>} ></Route>
        <Route path="/withdraw/usdttrc20" element={<WithdrawalUsdtTRC20 />}></Route>
        <Route path="/withdraw/usdterc20" element={<WithdrawalUsdtERC20 />}></Route>
        <Route path="/withdraw/upi" element={<ProtectedRoute> <UPI /> </ProtectedRoute>}></Route>
        <Route path="/withdraw/addbank" element={<ProtectedRoute><BankTransfer /></ProtectedRoute>}></Route>
        <Route path="/withdraw/bank" element={<ProtectedRoute><Savebank /></ProtectedRoute>}></Route>

        {/* TradingPage */}
        <Route path="/trading" element={<ProtectedRoute><OpenTradePage /></ProtectedRoute>} />
        <Route path="/position" element={<ProtectedRoute><PositionHistory /> </ProtectedRoute>}></Route>

        {/* HISTORY */}
        <Route path="/withdraw/history" element={<ProtectedRoute><WithdrawalHistory /></ProtectedRoute>}></Route>
        <Route path="/deposit/history" element={<ProtectedRoute><DepositHistory /></ProtectedRoute>}></Route>

        {/* IB */}

        <Route path="/ib/dashboard" element={<IBDashboard />}></Route>
        <Route path="/ib/deposit" element={<IBDeposit />}></Route>
        <Route path="/ib/earnings" element={<IBEarnings />}></Route>
        <Route path="/ib/clients" element={<IBMyClients />}></Route>
        <Route path="/ib/kyc" element={<IBKYC />}></Route>

        {/* Account Delete */}
        <Route path="/accountdelete" element={<AccountDelete />}></Route>

        {/* Uncommented lines should be exactly here */}
        {/* <Route path="/insights/admin/login" element={<AdminLogin />} />
        <Route path="/insights/admin/dashboard" element={<AdminDashboards />} />
        <Route path="/insights/signals" element={<TradingSignals />} />
        <Route path="/insights/news" element={<News />} /> */}

        {/* -------------Admin Routes----------------- */}

        <Route path="/dashnav" element={<DashboardNavebar />}></Route>
        <Route path={`${adminRoutes}login`} element={<AdminLoginPage />}></Route>

        {/* Admin navbar */}
        <Route path="/adminsidenav" element={<AdminSidenav />}></Route>
        <Route path="/adminnav" element={<AdminNavbar />}></Route>
        <Route path="/adminside" element={<AdminSidebar />}></Route>

        {/* Admin dashboard */}
        <Route path={`${adminRoutes}dashboard`} element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>}></Route>

        {/* Admin */}
        <Route path={`${adminRoutes}add`} element={<AdminProtectedRoute><AddAdmin /></AdminProtectedRoute>}></Route>
        <Route path={`${adminRoutes}view`} element={<AdminProtectedRoute><ViewAdmin /></AdminProtectedRoute>}></Route>
        <Route path={`${adminRoutes}admin/edit/:id`} element={<AdminProtectedRoute><EditAdmin /></AdminProtectedRoute>}></Route>
        <Route path={`${adminRoutes}payment_configuration`} element={<AdminProtectedRoute><SetValue /></AdminProtectedRoute>}></Route>

        {/* Admin Support Ticket */}
        <Route path={`${adminRoutes}support`} element={<AdminProtectedRoute><Admin /></AdminProtectedRoute>}></Route>
        <Route path={`${adminRoutes}reply`} element={<AdminProtectedRoute><Reply /></AdminProtectedRoute>}></Route>

        {/* Admin Kyc */}
        <Route path={`${adminRoutes}kyc`} element={<AdminProtectedRoute><AdminKyc /></AdminProtectedRoute>}></Route>
        <Route path={`${adminRoutes}kyc/:id`} element={<AdminProtectedRoute><KYCview /></AdminProtectedRoute>}></Route>
        <Route path={`${adminRoutes}addKyc`} element={<AdminProtectedRoute><AddKYC /></AdminProtectedRoute>}></Route>

        {/* Users */}
        <Route path={`${adminRoutes}user/add`} element={<AdminProtectedRoute><Adduser /></AdminProtectedRoute>}></Route>
        <Route path={`${adminRoutes}user/all`} element={<AdminProtectedRoute><Alluser /></AdminProtectedRoute>}></Route>
        <Route path={`${adminRoutes}user/inactive`} element={<AdminProtectedRoute><InactiveUsers /></AdminProtectedRoute>}></Route>
        <Route path={`${adminRoutes}user/monitor`} element={<AdminProtectedRoute><MonitorUsers /></AdminProtectedRoute>}></Route>
        <Route path={`${adminRoutes}user/:id`} element={<AdminProtectedRoute><Singleuser /></AdminProtectedRoute>}></Route>
        <Route path={`${adminRoutes}user/contact`} element={<AdminProtectedRoute><EditEmail /></AdminProtectedRoute>} ></Route>
        <Route path={`${adminRoutes}userdetails/:id`} element={<AdminProtectedRoute><UserDetails /></AdminProtectedRoute>}></Route>

        {/* Order history */}
        <Route path={`${adminRoutes}order/open`} element={<AdminProtectedRoute><OpenOrder /></AdminProtectedRoute>}></Route>
        <Route path={`${adminRoutes}edit/:id`} element={<AdminProtectedRoute><EditopenOrder /></AdminProtectedRoute>}></Route>
        <Route path={`${adminRoutes}order/pending`} element={<AdminProtectedRoute><PendingOrder /></AdminProtectedRoute>}></Route>
        <Route path={`${adminRoutes}order/buy`} element={<AdminProtectedRoute><BuyOrder /></AdminProtectedRoute>}></Route>
        <Route path={`${adminRoutes}order/demo/buy`} element={<AdminProtectedRoute><DemoBuyOrder /></AdminProtectedRoute>}></Route>
        <Route path={`${adminRoutes}order/demoBuy/edit/:id`} element={<AdminProtectedRoute><DemoBuyEdit /></AdminProtectedRoute>}></Route>
        <Route path={`${adminRoutes}order/demoSell/edit/:id`} element={<AdminProtectedRoute><DemoSellEdit /></AdminProtectedRoute>}></Route>
        <Route path={`${adminRoutes}order/demo/sell`} element={<AdminProtectedRoute><DemoSellOrder /></AdminProtectedRoute>}></Route>
        <Route path={`${adminRoutes}buysell/edit/:id`} element={<AdminProtectedRoute><EditBuyOrder /></AdminProtectedRoute>}></Route>
        <Route path={`${adminRoutes}order/sell`} element={<AdminProtectedRoute><SellOrder /></AdminProtectedRoute>}></Route>

        {/* payment mode */}
        <Route path={`${adminRoutes}usdt`} element={<AdminProtectedRoute><USDT /></AdminProtectedRoute>}></Route>
        <Route path={`${adminRoutes}upi`} element={<AdminProtectedRoute><Upi /></AdminProtectedRoute>}></Route>
        <Route path={`${adminRoutes}crypto`} element={<AdminProtectedRoute><Crypto /></AdminProtectedRoute>}></Route>
        <Route path={`${adminRoutes}addbank`} element={<AdminProtectedRoute><AddBank /></AdminProtectedRoute>}></Route>
        <Route path={`${adminRoutes}banktransfer/:id`} element={<AdminProtectedRoute><BankPayment /></AdminProtectedRoute>}></Route>
        <Route path={`${adminRoutes}banktransfer`} element={<AdminProtectedRoute><BankPayment /></AdminProtectedRoute>}></Route>

        {/* Admin Deposit */}
        <Route path={`${adminRoutes}deposit`} element={<AdminProtectedRoute><AdminDeposit /></AdminProtectedRoute>}></Route>
        <Route path={`${adminRoutes}add_fund`} element={<AdminProtectedRoute><AddFund /></AdminProtectedRoute>}></Route>
        <Route path={`${adminRoutes}deposit/:id`} element={<AdminProtectedRoute><DepositReply /></AdminProtectedRoute>}></Route>
        <Route path={`${adminRoutes}update_wallet`} element={<AdminProtectedRoute><UpdateAdimWallet /></AdminProtectedRoute>}></Route>

        {/* Admin Withdrawal */}
        <Route path={`${adminRoutes}withdraw`} element={<AdminProtectedRoute><AdminWithdraw /></AdminProtectedRoute>}></Route>
        <Route path={`${adminRoutes}withdraw/:id`} element={<AdminProtectedRoute><AdminReason /></AdminProtectedRoute>}></Route>

        {/* Announcement */}
       <Route path={`${adminRoutes}banner/create`} element={<AdminProtectedRoute><CreateBanner /></AdminProtectedRoute>}></Route>
       <Route path={`${adminRoutes}banner/viewall`} element={<AdminProtectedRoute><ViewBanner /></AdminProtectedRoute>}></Route>

       {/* Spread */}
       <Route path={`${adminRoutes}view_spread`} element={<AdminProtectedRoute><Spread /></AdminProtectedRoute>}></Route>
       <Route path={`${adminRoutes}view_spread/:id`} element={<AdminProtectedRoute><EditSpread /></AdminProtectedRoute>}></Route>
       <Route path={`${adminRoutes}add_spread`} element={<AdminProtectedRoute><AddSpread /></AdminProtectedRoute>}></Route>

       {/* AutoSquareoff */}
       <Route path={`${adminRoutes}squareoff`} element={<AdminProtectedRoute><AdminSquareOff /></AdminProtectedRoute>}></Route>
       
       {/* LP */}
       <Route path={`${adminRoutes}LP`} element={<AdminProtectedRoute><AdminLP /></AdminProtectedRoute>}></Route>

       {/* IB Bounus */}
       <Route path={`${adminRoutes}commission`} element={<IBCommision />}></Route>
       <Route path={`${adminRoutes}admin/ib/deposit`} element={<AdminIBDeposit />}></Route>
       <Route path={`${adminRoutes}ib/deposit/:id`} element={<AdminProtectedRoute><AdminIBDepositReply /></AdminProtectedRoute>}></Route>
       <Route path={`${adminRoutes}admin/ib/kyc`} element={<AdminIBKYC />}></Route>
       <Route path={`${adminRoutes}admin/ib/kyc/:id`} element={<AdminIBKYCView />}></Route>
       <Route path={`${adminRoutes}admin/ib/all/commission`} element={<AdminAllCommission />}></Route>

       {/* Account Delete Requests */}
       <Route path={`${adminRoutes}account/delete/requests`} element={<AdminProtectedRoute><AdminAccountDelete /></AdminProtectedRoute>}></Route>

        {/* <Route path="/set-password" element={<Password />} /> */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/otp" element={<OTPVerification />} /> */}
        {/* <Route path="/Withdrawal" element={<WithdrawalPage />} /> */}
        {/* <Route path="/waiting" element={<Waiting />}></Route> */}
        {/* <Route path="/alert" element={<AlertModal />}></Route> */}
        <Route path="/popreason" element={<RejectPop />}></Route>

        <Route path="*" element={<Navigate to="/login" replace/>}></Route>

      </Routes>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AccountTypeProvider>     
        <AuthProvider>
        <AppWrapper />
      </AuthProvider>
      </AccountTypeProvider>
 
    </Router>
  );
}
