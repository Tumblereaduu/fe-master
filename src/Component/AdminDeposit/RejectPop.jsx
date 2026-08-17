import axios from 'axios'
import { useScroll } from 'framer-motion'
import React, { useState } from 'react'
import { BACKEND_API_URL } from '../../api/config'

const RejectPop = ({ deps, onclose, setAdminDeposit }) => {

    const [area, setArea] = useState("")
    const [loading, setLoading] = useState(false)

   const handleReject = async () => {
  if (!area.trim()) {
    alert("Please enter a reason before rejecting.");
    return;
  }

  try {
    setLoading(true);

    await axios.put(`${BACKEND_API_URL}/deposit/update/${deps.deposit_id}`, {
      deposit_status: "Rejected",
      deposit_reject_reason: area
    });

    setAdminDeposit((prev) =>
      prev.map((item) =>
        item.deposit_id === deps.deposit_id
          ? { ...item, deposit_status: "Rejected" }
          : item
      )
    );
    
    setLoading(false);
    onclose();
    alert("Deposit rejected successfully!");
  } catch (error) {
    console.error(error.response?.data || error.message);
    setLoading(false);
  }
};

    return (
        <div>
            <div className='flex mt-100 justify-center flex-col'>
                <textarea className='border outline-none rounded-md mx-20' name="" id="" placeholder='Type a reason' value={area} onChange={(e) => setArea(e.target.value)}></textarea> <br />

                <div className='flex justify-center'>
                    <button className='bg-red-400 px-2 py-1 cursor-pointer' onClick={handleReject}>Send</button>
                </div>
            </div>
        </div>
    )
}

export default RejectPop
