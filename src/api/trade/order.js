import axios from "axios";
import { BACKEND_API_URL } from "../config";

export const submitOrderToServer = async (payload, token) => {
  try {
    const accountType = localStorage.getItem("accountType"); 

    const baseUrl =
      accountType === "LIVE"
        ? `${BACKEND_API_URL}/order/place`
        : `${BACKEND_API_URL}/demo/order/place`;

    const res = await axios.post(baseUrl, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (err) {
    console.error("Error submitting order:", err.response?.data || err.message);
    throw err;
  }
};
