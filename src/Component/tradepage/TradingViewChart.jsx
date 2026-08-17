export default function TradingViewChart({ symbol }) {
  const base = import.meta.env.BASE_URL;

  return (
    <iframe
      src={`${base}TradingViewChart.html?symbol=${encodeURIComponent(symbol)}&theme=${localStorage.getItem("theme") || "dark"}`}
      className="w-full h-full"
      style={{ border: "none" }}
      title="TradingView Chart"
    />
  );
}