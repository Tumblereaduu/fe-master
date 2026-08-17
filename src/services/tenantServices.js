import axios from "axios";
import { BACKEND_API_URL } from "../api/config";

export const getCurrentTenant = async () => {
    const response = await axios.get(
        `${BACKEND_API_URL}/tenant/current`
    );

    return response.data;
};