import React, { useEffect, useState } from 'react'
import { BACKEND_API_URL } from '../../api/config';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export const kycStatusContext = () => {

     const [kycVerified, setKycVerified] = useState(false);
     const [frontStatus, setFrontStatus] = useState("");
     const [backStatus, setBackStatus] = useState("");
     const [bankStatus, setBankStatus] = useState("");
     const { token, user } = useAuth();
     const [ibStatus,setIbStatus] = useState("");


      useEffect(() => {
    if (!user?.user_id) return;

    const fetchKYCStatus = async () => {
      try {
        const { data } = await axios.get(
          `${BACKEND_API_URL}/kyc/status/${user.user_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const kyc = Array.isArray(data) ? data[0] : data;

        if (!kyc) {
          setKycVerified(false);
          return;
        }

        const photo1 = kyc.photo_id_1_status?.toLowerCase() || "";
        const photo2 = kyc.photo_id_2_status?.toLowerCase() || "";
        const photo3 = kyc.photo_id_3_status?.toLowerCase() || "";
        const ib = kyc.ib_status?.toLowerCase() || "";

        setFrontStatus(photo1);
        setBackStatus(photo2);
        setBankStatus(photo3);
        setIbStatus(ib)

        setKycVerified(
          photo1 === "approved" &&
          photo2 === "approved" &&
          photo3 === "approved"
        );

      } catch (error) {
        console.error("Failed to fetch KYC status", error);
        setKycVerified(false);
      }
    };

    fetchKYCStatus();
  }, [user, token]);

  return {
    kycVerified, setKycVerified, frontStatus, setFrontStatus, backStatus, setBackStatus, bankStatus, setBankStatus, ibStatus, setIbStatus, token, user
  }
}
