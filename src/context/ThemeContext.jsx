import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
      //  ADD THESE 2 LINES:
  window.dispatchEvent(new CustomEvent('themeChange', { detail: { isDark } }));
  
  //  SEND TO ALL IFRAMES ON THE PAGE:
  document.querySelectorAll('iframe').forEach(iframe => {
    try {
      iframe.contentWindow.postMessage({ type: 'THEME_CHANGE', isDark: isDark }, '*');
    } catch(e) {}
  });
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}