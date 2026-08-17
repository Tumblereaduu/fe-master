import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { BACKEND_API_URL } from "../../api/config";

export default function useContactDetails() {
  const [description, setDescription] = useState("");
  const [adminEmail, AdminSetEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_URL}/contact`);
        
        if (response.data.data && response.data.data.length > 0) {
          const details = response.data.data[0];
          setDescription(details.description);
          AdminSetEmail(details.email);
          setWhatsapp(details.whatsapp_number);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        toast.error("Failed to load contact details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    description,
    adminEmail,
    whatsapp,
    loading
  };
}
