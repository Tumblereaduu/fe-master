import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { BACKEND_API_URL } from '../../api/config';
import history from '../../assets/img/deposit/Group.svg'
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const DepositBalance = () => {

    const [balance, setBalance] = useState(0);
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const { isDark } = useTheme();

  // showing balance from wallet 
  useEffect(() => {
    const fetchWallet = async () => {
      if (!user?.user_id || !token) return;
      try {
        const { data } = await axios.get(`${BACKEND_API_URL}/wallet/${user.user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.status === "success") setBalance(data.wallet);
        else setBalance(0);
      } catch (error) {
        console.error("Failed to fetch wallet:", error);
        setBalance(0);
      }
    };

    fetchWallet();
  }, [user, token]);

  return (
    <div>
      <div className="bg-[#1a81f70f] px-6 py-4">
        <div className="-mx-3 flex items-center justify-between md:mx-10">

          {/* Left: Balance */}
          <h3 className="font-semibold text-sm text-gray-800 md:text-xl ">
            Available Balance : {Number(balance).toFixed(2)} USD
          </h3>

          {/* Right: History */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={()=> navigate('/deposit/history')}>
            <img src={history} alt="History" className={`w-6 h-6 transition-all duration-300 ${isDark ? "brightness-0 invert" : ""}`} />
            <h4 className="font-medium text-gray-700">Deposit History</h4>
          </div>

        </div>
      </div>
    </div>
  )
}

export default DepositBalance
