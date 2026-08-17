import React, { createContext, useState, useContext,useEffect } from "react";
import Cookies from "js-cookie";
import { BACKEND_API_URL } from "../../api/config";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) { 

    // Auto Logout For Admin & Master

    useEffect(()=>{
        const interval = setInterval(()=>{
            // Admin auto-logout
            const adminExp = Cookies.get("token_exp");
            const adminToken = Cookies.get("adminToken");
            if(adminExp && adminToken && Date.now() > Number(adminExp)){
                 console.log("ADMIN TOKEN EXPIRED → AUTO LOGOUT");
                  Cookies.remove("adminToken");
                  Cookies.remove("adminInfo");
                  Cookies.remove("token_exp");
                  window.location.href = "/lkjdtruovehwymabig1/vmkp/login";  
            }

            // Master auto-logout
            const masterExp = Cookies.get("master_token_exp");
            const masterToken = Cookies.get("masterToken");
            if(masterExp && masterToken && Date.now() > Number(masterExp)){
                 console.log("MASTER TOKEN EXPIRED → AUTO LOGOUT");
                  Cookies.remove("masterToken");
                  Cookies.remove("masterInfo");
                  Cookies.remove("master_token_exp");
                  window.location.href = "/master/login";  
            }
        },2000)
         return () => clearInterval(interval);
    },[])

    // Use state for local storage (User)
    const [token, setToken] = useState(() => localStorage.getItem("token") || null);
    const [user, setUser] = useState(() => {
        const storeUser = localStorage.getItem("user");
        return storeUser ? JSON.parse(storeUser) : null
    });

    // Admin State (cookies)
    const [adminToken,setAdminToken] = useState(()=> Cookies.get("adminToken") || null);
    const [adminData, setAdminData] = useState(() => { const stored = Cookies.get("adminInfo"); return stored ? JSON.parse(stored) : null; });

    // Master State (cookies) - NEW
    const [masterToken, setMasterToken] = useState(() => Cookies.get("masterToken") || null);
    const [masterData, setMasterData] = useState(() => { const stored = Cookies.get("masterInfo"); return stored ? JSON.parse(stored) : null; });

    const handleLogin = (newToken, role, data) => {
        if(role === "admin"){
            setAdminToken(newToken);
            setAdminData(data);
            // Cookies.set("adminToken", newToken, { expires: 1/1440 });
            // Cookies.set("adminInfo", JSON.stringify(data));
            // Cookies.set("token_exp", Date.now() +  10 * 60 * 1000, { expires: 1/1440 });
        } else if(role === "master"){
            // NEW: Master authentication
            setMasterToken(newToken);
            setMasterData(data);
            // Cookies.set("masterToken", newToken, { expires: 1/1440 });
            // Cookies.set("masterInfo", JSON.stringify(data));
            // Cookies.set("master_token_exp", Date.now() +  10 * 60 * 1000, { expires: 1/1440 });
        } else {
            setToken(newToken);
            setUser(data);
            localStorage.setItem("token", newToken);
            localStorage.setItem("user", JSON.stringify(data));
        }
    }

    const logout = async (role) => {
        try {
            let tokenToUse;
            if(role === "admin") {
                tokenToUse = Cookies.get("adminToken");
            } else if(role === "master") {
                tokenToUse = Cookies.get("masterToken");
            } else {
                tokenToUse = localStorage.getItem("token");
            }
            
            if(tokenToUse){
               await axios.post(`${BACKEND_API_URL}/auth/logout`,{}, {
          headers: { Authorization: `Bearer ${tokenToUse}` },
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
        else if(role === "master"){
            // NEW: Master logout
            setMasterToken(null);
            setMasterData(null);
            Cookies.remove("masterToken");
            Cookies.remove("masterInfo");
            Cookies.remove("master_token_exp");
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
        <AuthContext.Provider value={{ token, user, adminToken, adminData, masterToken, masterData, handleLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
