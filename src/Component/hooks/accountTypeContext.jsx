import { createContext, useContext, useState, useEffect } from "react";

const AccountTypeContext = createContext();

export const AccountTypeProvider = ({ children }) => {

  const [accountType, setAccountType] = useState(() => {
    return localStorage.getItem("accountType") || "LIVE";
  });

  useEffect(() => {
    localStorage.setItem("accountType", accountType);
  }, [accountType]);

  return (
    <AccountTypeContext.Provider value={{ accountType, setAccountType }}>
      {children}
    </AccountTypeContext.Provider>
  );
};

export const useAccountType = () => useContext(AccountTypeContext);
