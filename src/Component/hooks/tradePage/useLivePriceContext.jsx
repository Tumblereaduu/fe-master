import React, { createContext, useContext, useEffect, useState } from "react";
import socket from "../../../socket/socket-file";

const LivePriceContext = createContext();

export const LivePriceProvider = ({ children }) => {
  const [livePrices, setLivePrices] = useState(()=>{
    const stored = localStorage.getItem("livePrices");
    return stored ? JSON.parse(stored) : {};
  });
  const [allPairs, setAllPairs] = useState(()=>{
    const stored = localStorage.getItem("allPairs");
    return stored ? JSON.parse(stored) : {};
  });

  // useEffect(()=>{
  //   localStorage.setItem("livePrices", JSON.stringify(livePrices));
  // },[livePrices])

  //  useEffect(()=>{
  //   localStorage.setItem("allPairs", JSON.stringify(allPairs));
  // },[allPairs])

  useEffect(() => {
    const handleForexUpdate = (data) => {
      if (!data) return;

      const updates = Array.isArray(data) ? data : [data];

      setLivePrices((prev) => {
        const updated = { ...prev };

        updates.forEach((item) => {
          const symbol = item.symbol?.replace("/", "")?.trim();
          updated[symbol] = parseFloat(item.price || item.p || 0);
        });

        return updated;
      });

      setAllPairs((prev) => {
        const updated = { ...prev };

        updates.forEach((item) => {
          const symbol = item.symbol?.replace("/", "")?.trim();

          updated[symbol] = {
            symbol,
            price: parseFloat(item.p || 0),
            change: item.change || "0.00%",
            low: parseFloat(item.a) || 0,
            high: parseFloat(item.b) || 0,
            up: (item.change || "").includes("+"),
            changePercent: parseFloat(item.cp || 0)
          };
        });

        return updated;
      });
    };

    socket.on("forex_update", handleForexUpdate);

    return () => {
      socket.off("forex_update", handleForexUpdate);
    };
  }, []);

  return (
    <LivePriceContext.Provider value={{ livePrices, setLivePrices, allPairs, setAllPairs }}>
      {children}
    </LivePriceContext.Provider>
  );
};

export const useLivePrice = () => useContext(LivePriceContext);