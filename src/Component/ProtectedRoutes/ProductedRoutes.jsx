import { toast } from "react-toastify";

import { Navigate } from "react-router-dom";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const exp = localStorage.getItem("token_exp");

  if (!token) return <Navigate to="/login" replace />;

  const isExpired = (exp && Date.now() > exp)

  useEffect(() => {
    if (isExpired) {
      toast.error("Your session has expired. Please login again")
    }
  }, [isExpired])

  if (isExpired) {
    localStorage.removeItem("token");
    localStorage.removeItem("token_exp");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }
  return children;
}
