import React, { createContext, useState, useContext,useEffect } from "react";
import Cookies from "js-cookie";
import { BACKEND_API_URL } from "../../api/config";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) { 

    // Auto Logout For Admin

    useEffect(()=>{
        const interval = setInterval(()=>{
            const exp = Cookies.get("token_exp");
            const token = Cookies.get("adminToken");
            if(exp && token && Date.now() > Number(exp)){
                 console.log("ADMIN TOKEN EXPIRED → AUTO LOGOUT");
                  Cookies.remove("adminToken");
                  Cookies.remove("adminInfo");
                  Cookies.remove("token_exp");
                  window.location.href = "/lkjdtruovehwymabig1/vmkp/login";  
            }
        },2000)
         return () => clearInterval(interval);
    },[])

    // Use state for local storage
    const [token, setToken] = useState(() => localStorage.getItem("token") || null);
    const [user, setUser] = useState(() => {
        const storeUser = localStorage.getItem("user");
        return storeUser ? JSON.parse(storeUser) : null
    });

    // Admin State  (cookies)

    const [adminToken,setAdminToken] = useState(()=> Cookies.get("adminToken") || null);
    const [adminData, setAdminData] = useState(() => { const stored = Cookies.get("adminInfo"); return stored ? JSON.parse(stored) : null; });

    // when user change save to into token local storage 

    const handleLogin  = (newToken,role,data) => {
        if(role === "admin"){
            setAdminToken(newToken);
            setAdminData(data);
            Cookies.set("adminToken", newToken, { expires: 1/1440 });
            Cookies.set("adminInfo", JSON.stringify(data));
            Cookies.set("token_exp", Date.now() +  10 * 60 * 1000, { expires: 1/1440 });
        } else{
          setToken(newToken);
           setUser(data);
           localStorage.setItem("token", newToken);
           localStorage.setItem("user", JSON.stringify(data));
        }
    }


    const logout = async (role) => {
        try {
            const token = role === "admin" ? Cookies.get("adminToken") : localStorage.getItem("token");
            if(token){
               await axios.post(`${BACKEND_API_URL}/auth/logout`,{}, {
          headers: { Authorization: `Bearer ${token}` },
        });
            }
        } catch (error) {
                  console.error("Logout API failed", error);
        }
        if (role === "admin") {
             setAdminToken(null);
             setAdminData(null);
             Cookies.remove("adminToken");
             Cookies.remove("adminInfo");
             Cookies.remove("token_exp");
        }
        else {
            setToken(null);
            setUser(null);
            localStorage.removeItem("token")
            localStorage.removeItem("FreeMargin")
            localStorage.removeItem("accountType")
            localStorage.removeItem("twk_6942a0834006b2197e4e0707")
            localStorage.removeItem("twk_token_6942a0834006b2197e4e0707")
            localStorage.removeItem("user")
        }
    }


    return (
        <AuthContext.Provider value={{ token, user, adminToken, adminData,handleLogin,logout }}>
            {children}  {/*  fixed typo */}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
