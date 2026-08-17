import axios from "axios";
import { BACKEND_API_URL } from "../../api/config";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function useDashboardstats (){

    const {user,token} = useAuth();
    const [dashboardStasts, setDashboardStats] = useState("");


     useEffect(() => {
        const fetchDashboardStas = async () => {
          try {
            const res = await axios.get(`${BACKEND_API_URL}/ib/dashboard-stats`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
    
            if (res.data.status === "success") {
              setDashboardStats(res.data.data)
            }
          } catch (error) {
            console.error("Failed to fetch dashboard stats", error);
            toast.error("Failed to fetch dashboard stats");
          }
        }
        if (token) fetchDashboardStas()
      }, [token])

      return {dashboardStasts,setDashboardStats}
}

