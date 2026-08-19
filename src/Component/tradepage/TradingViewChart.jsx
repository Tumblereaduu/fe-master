// export default function TradingViewChart({ symbol }) {
//   const base = import.meta.env.BASE_URL;

//   return (
//     <iframe
//       src={`${base}TradingViewChart.html?symbol=${encodeURIComponent(symbol)}&theme=${localStorage.getItem("theme") || "dark"}`}
//       className="w-full h-full"
//       style={{ border: "none" }}
//       title="TradingView Chart"
//     />
//   );
// }



import React, { useRef, useEffect } from "react";

// Import the HTML file as raw string (Vite handles this)
import chartHtml from "../../../public/TradingViewChart.html?raw";

export default function TradingViewChart({ symbol }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Function to send the new symbol to the chart iframe
    const sendSymbolToChart = () => {
      if (iframe.contentWindow && symbol) {
        iframe.contentWindow.postMessage(
          {
            action: "CHANGE_SYMBOL",
            payload: symbol, // e.g., "ONA:XAUUSD" or "CRYPTO:BTCUSD"
          },
          "*"
        );
      }
    };

    // When iframe finishes loading, send the symbol
    iframe.addEventListener("load", sendSymbolToChart);

    // If it's already loaded (e.g., switching symbols fast), send immediately
    if (iframe.contentDocument?.readyState === "complete") {
      sendSymbolToChart();
    }

    // Cleanup listener on unmount
    return () => {
      iframe.removeEventListener("load", sendSymbolToChart);
    };
  }, [symbol]); // Re-run ONLY when the symbol changes

  return (
    <iframe
      ref={iframeRef}
      srcDoc={chartHtml}
      style={{
        width: "100%",
        height: "100%",
        border: "none",
        backgroundColor: "#0d0e14", // Matches chart background perfectly
        display: "block",          // Removes extra space below iframe
      }}
      title="Trading Chart"
    />
  );
}