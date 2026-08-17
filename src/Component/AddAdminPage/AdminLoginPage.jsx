// import React, { useState } from "react"
// import { useNavigate } from "react-router-dom"
// import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5"
// import axios from "axios"
// import { toast, ToastContainer } from "react-toastify"
// import "react-toastify/dist/ReactToastify.css";
// import { BACKEND_API_URL } from "../../api/config"
// import { adminRoutes } from "../../App"
// import Cookies from "js-cookie";
// import { useAuth } from "../context/AuthContext"

// const AdminLoginPage = () => {
//     const navigate = useNavigate()
//     const [admin,setAdmin] = useState("")
//     const [email, setEmail] = useState("")
//     const [password, setPassword] = useState("")
//     const [showPassword, setShowPassword] = useState(false)
//     const [error, setError] = useState("")
//     const {handleLogin} = useAuth();

//     const handleSubmit = async () => {
//         if (!email || !password) {
//             toast.warning("Please enter both email and password fields!", {
//                 position: "top-right",
//                 autoClose: 2500,
//             });
//             return;
//         }

//         try {
//             const res = await axios.post(`${BACKEND_API_URL}/admin/login`, {
//                 // admin_name: admin,
//                 email_id: email,
//                 password: password
//             });      
//             if (res.status === 200 && res.data.status === "success") {
//             const adminData = res.data.admin;

//             // Check if status is inactive
//             if (adminData.status?.toLowerCase() !== "active") {
//                 toast.error("Your account is inactive. Please contact the admin.", {
//                     position: "top-right",
//                     autoClose: 3000,
//                 });
//                 return; // Stop further execution
//             }
//                 Cookies.set("adminInfo", JSON.stringify(adminData), { expires: 7 });
//                 Cookies.set("adminToken", res.data.token, { expires: 7 });
//                 Cookies.set("token_exp", Date.now() + 5 * 60 * 60 * 1000);

//                 toast.success("Login successfully", {
//                     position: "top-right",
//                     autoClose: 2500,
//                 });

//             // localStorage.setItem("adminInfo", JSON.stringify(adminData));
//             // localStorage.setItem("isAdminLoggedIn", "true");
//             // setError("");
//             navigate(`${adminRoutes}dashboard`);
//         }
//     } catch (error) {
//         console.error("Login error:", error);

//         if (error.response && error.response.status === 401) {
//             toast.error("Invalid email or password!", { position: "top-right", autoClose: 2500 });
//         } else if (error.response) {
//             toast.error(error.response.data?.message || "Server error occurred.", { position: "top-right", autoClose: 2500 });
//         } else {
//             toast.error("Cannot connect to server. Check backend.", { position: "top-right", autoClose: 2500 });
//         }
//     }
// };



//     return (
//         <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-blue-200 to-blue-400 px-4">
            
//             <ToastContainer />

//             {/* Login Card */}
//             <div className="relative bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md z-10">
//                 <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
//                     Login
//                 </h1>

//                 <div className="flex flex-col gap-5">
//                     <div>
//                         <label className="block text-gray-700 font-medium mb-2">Email</label>
//                         <input
//                             type="text"
//                             placeholder="Enter your email"
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-gray-700 font-medium mb-2">Password</label>
//                         <div className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-400 transition">
//                             <input
//                                 type={showPassword ? "text" : "password"}
//                                 placeholder="Enter your password"
//                                 className="outline-none w-full"
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                             />
//                             <button
//                                 type="button"
//                                 onClick={() => setShowPassword(!showPassword)}
//                                 className="ml-2 text-gray-600 hover:text-blue-600 transition"
//                             >
//                                 {showPassword ? <IoEyeOffSharp size={20} /> : <IoEyeSharp size={20} />}
//                             </button>
//                         </div>
//                     </div>

//                     {error && (
//                         <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-md border border-red-200">
//                             {error}
//                         </p>
//                     )}

//                     <button
//                         onClick={handleSubmit}
//                         className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 active:scale-95 transition-transform duration-150"
//                     >
//                         Login
//                     </button>
//                 </div>

//                 <p className="text-center text-gray-500 text-sm mt-6">© 2025 Admin Portal</p>
//             </div>
//         </div>
//     )
// }

// export default AdminLoginPage



import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_API_URL } from "../../api/config"
import { adminRoutes } from "../../App"
import Cookies from "js-cookie";
import { useAuth } from "../context/AuthContext"

const AdminLoginPage = () => {
    const navigate = useNavigate()
    const [admin,setAdmin] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const {handleLogin} = useAuth();

    const handleSubmit = async () => {
        if (!email || !password) {
            toast.warning("Please enter both email and password fields!", {
                position: "top-right",
                autoClose: 2500,
            });
            return;
        }

        try {
            const res = await axios.post(`${BACKEND_API_URL}/admin/login`, {
                email_id: email,
                password: password
            });      
            if (res.status === 200 && res.data.status === "success") {
            const adminData = res.data.admin;

            // Check if status is inactive
            if (adminData.status?.toLowerCase() !== "active") {
                toast.error("Your account is inactive. Please contact the admin.", {
                    position: "top-right",
                    autoClose: 3000,
                });
                return;
            }

                // ✅ EXISTING: Cookies (keep as is)
                Cookies.set("adminInfo", JSON.stringify(adminData), { expires: 7 });
                Cookies.set("adminToken", res.data.token, { expires: 7 });
                Cookies.set("token_exp", Date.now() + 5 * 60 * 60 * 1000);

                // ✅ NEW: Also store in localStorage (for getAdminInfo helper)
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("admin", JSON.stringify(adminData));

                toast.success("Login successfully", {
                    position: "top-right",
                    autoClose: 2500,
                });

            navigate(`${adminRoutes}dashboard`);
        }
    } catch (error) {
        console.error("Login error:", error);

        if (error.response && error.response.status === 401) {
            toast.error("Invalid email or password!", { position: "top-right", autoClose: 2500 });
        } else if (error.response) {
            toast.error(error.response.data?.message || "Server error occurred.", { position: "top-right", autoClose: 2500 });
        } else {
            toast.error("Cannot connect to server. Check backend.", { position: "top-right", autoClose: 2500 });
        }
    }
};

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-blue-200 to-blue-400 px-4">
            
            <ToastContainer />

            {/* Login Card */}
            <div className="relative bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md z-10">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Login
                </h1>

                <div className="flex flex-col gap-5">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Email</label>
                        <input
                            type="text"
                            placeholder="Enter your email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Password</label>
                        <div className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-400 transition">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="outline-none w-full"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="ml-2 text-gray-600 hover:text-blue-600 transition"
                            >
                                {showPassword ? <IoEyeOffSharp size={20} /> : <IoEyeSharp size={20} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-md border border-red-200">
                            {error}
                        </p>
                    )}

                    <button
                        onClick={handleSubmit}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 active:scale-95 transition-transform duration-150"
                    >
                        Login
                    </button>
                </div>

                <p className="text-center text-gray-500 text-sm mt-6">© 2025 Admin Portal</p>
            </div>
        </div>
    )
}

export default AdminLoginPage
    