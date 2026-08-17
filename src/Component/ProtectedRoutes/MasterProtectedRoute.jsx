import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const MasterProtectedRoute = ({ children }) => {
  const token = Cookies.get("masterToken");

  if (!token) {
    return <Navigate to="/master/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const isExpired = decoded.exp * 1000 < Date.now();

    if (isExpired) {
      Cookies.remove("masterToken");
      Cookies.remove("masterInfo");
      Cookies.remove("master_token_exp");

      toast.error("Master session expired. Please login again.");
      return <Navigate to="/master/login" replace />;
    }

    return children;
  } catch (error) {
    Cookies.remove("masterToken");
    Cookies.remove("masterInfo");
    Cookies.remove("master_token_exp");

    return <Navigate to="/master/login" replace />;
  }
};

export default MasterProtectedRoute;
