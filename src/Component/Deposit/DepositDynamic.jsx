import { useParams,Navigate } from "react-router-dom";
import Scan from "./Scan";
import Waiting from "./Waiting";

export default function DepositDynamic() {
  const { type } = useParams();
  const allowedTypes = ["upi","usdt"]

  if (!type){ return <Navigate to="/deposit" replace />;}

  if (!allowedTypes.includes(type.toLowerCase())) {
    return <Navigate to="/login" replace />; 
  }

   if (type.toLowerCase() === "upi") {
    return <Scan />;
  }

  return <Waiting />;
}