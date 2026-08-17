import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { BACKEND_API_URL } from "../../api/config";
import { useAuth } from "../context/AuthContext";

export default function useTotalEarnings() {
  const { user, token } = useAuth();
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [ibStatus, setIBStatus] = useState("inactive");
  const [ibKYCStatus, setKYCIBStatus] = useState("pending");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.user_id) return;

    const fetchTotalEarnings = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BACKEND_API_URL}/ib/total-earnings/${user.user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.status === "success") {
          const data = res.data.data || {};
          setTotalEarnings(Number(data.total_earnings || 0));
          setIBStatus(data.ib_status || "inactive");
          setKYCIBStatus(data.ib_kyc_status || "pending");
        }
      } catch (error) {
        console.error("Fetch IB status error:", error);
        toast.error("Your account is inactive, please contact support");
      } finally {
        setLoading(false);
      }
    };

    fetchTotalEarnings();
  }, [user, token]);

  return { totalEarnings, ibStatus, ibKYCStatus, loading };
}
