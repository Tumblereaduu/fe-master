// import React, { useEffect, useRef, memo } from "react";

// function TradingViewWidget({ symbol }) {
//   const container = useRef(null);

//   useEffect(() => {
//     container.current.innerHTML = "";

//     const script = document.createElement("script");
//     script.src =
//       "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
//     script.type = "text/javascript";
//     script.async = true;
//     script.innerHTML = JSON.stringify({
//       colorTheme: "dark",
//       displayMode: "single",
//       isTransparent: false,
//       locale: "en",
//       interval: "1m",
//       disableInterval: false,
//       width: "100%",
//       height: 450,
//       symbol: symbol,
//       showIntervalTabs: true,
//     });

//     container.current.appendChild(script);
//   }, [symbol]);

//   return (
//     <div ref={container} className="tradingview-widget-container">
//       <div className="tradingview-widget-container__widget"></div>
//     </div>
//   );
// }

// export default memo(TradingViewWidget);


import React, { useEffect, useRef, memo } from "react";
import { useTheme } from "../../context/ThemeContext";

function TradingViewWidget({ symbol }) {
  const container = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    container.current.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: isDark ? "dark" : "light",
      displayMode: "single",
      isTransparent: true,
      locale: "en",
      interval: "1m",
      disableInterval: false,
      width: "100%",
      height: 450,
      symbol: symbol,
      showIntervalTabs: true,
    });

    container.current.appendChild(script);
  }, [symbol, isDark]);

  return (
    <div
      ref={container}
      className="tradingview-widget-container"
      style={{ backgroundColor: isDark ? "#141D22" : "" }}
    >
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
}

export default memo(TradingViewWidget);