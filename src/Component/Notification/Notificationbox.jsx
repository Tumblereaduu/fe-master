import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoClose } from "react-icons/io5";

const Notificationbox = ({title = "Position Opened",message= "Sell 0.01 lot XAUUSD at 3,410.69",children}) => {

  const navigate = useNavigate()

  const [visible,setVisible] = useState(true)

  return (
    <div className='bg-[#202020] relative w-84 text-white px-4 py-2 rounded-xl mx-10 mt-10' onClick={()=> navigate('/notifi2')}>
      <button className='items-end flex justify-end cursor-pointer absolute right-4 top-2.5 font-medium '><IoClose size={20} className='text-white font-bold'/></button>
     
      <div className=' mt-3 flex items-center gap-2  text-white  '>
        {/* <img src={tick} alt="" /> */}
        <h1 className='font-medium'>{title}</h1>
      </div>
      <div className='mx-6.5 pb-3  flex flex-col gap-1  text-white '>

      <h2 className='font-medium'>{message }</h2>
      {children}
      
    </div>
    </div>
  )
}

export default Notificationbox
