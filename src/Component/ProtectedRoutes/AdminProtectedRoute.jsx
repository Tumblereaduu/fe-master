import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import {jwtDecode} from "jwt-decode";

const AdminProtectedRoute = ({ children }) => {
  const token = Cookies.get("adminToken");

  if (!token) {
    return <Navigate to="/lkjdtruovehwymabig1/vmkp/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const isExpired = decoded.exp * 1000 < Date.now();

    if (isExpired) {
      Cookies.remove("adminToken");
      Cookies.remove("adminInfo");

      toast.error("Admin session expired. Please login again.");
      return <Navigate to="/lkjdtruovehwymabig1/vmkp/login" replace />;
    }

    return children;
  } catch (error) {

    Cookies.remove("adminToken");
    Cookies.remove("adminInfo");

    return <Navigate to="/lkjdtruovehwymabig1/vmkp/login" replace />;
  }
};

export default AdminProtectedRoute;
