import React, { useEffect, useState } from 'react'
import { BACKEND_API_URL } from '../../api/config';
import axios from 'axios';

const viewBanner = () => {

      const [banners, setBanners] = useState([]);
    
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get(`${BACKEND_API_URL}/banner/view`);
        if (res.data.success) {
          const activeBanner = res.data.banners.filter(b => b.status === "active");
          setBanners(activeBanner);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanners();
  }, []);

  return {banners, setBanners}
}

export default viewBanner
