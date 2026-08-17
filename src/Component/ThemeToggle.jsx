import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      onClick={toggleTheme}
      className="w-full flex flex-col items-center p-2 cursor-pointer"
    >
      {/* Moon Icon for Light Mode */}
      <div className="w-6 h-6 flex items-center justify-center">
        {theme === "light" ? (
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <path
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
              fill="#000000"
              stroke="#4B5563"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <circle cx="12" cy="12" r="5" fill="#F97316" />
            <line x1="12" y1="1" x2="12" y2="3" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="21" x2="12" y2="23" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
            <line x1="1" y1="12" x2="3" y2="12" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
            <line x1="21" y1="12" x2="23" y2="12" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="#F97313" strokeWidth="2" strokeLinecap="round" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </div>

      {/* Label */}
      <span className="mt-12 text-[10px] font-bold text-gray-700 dark:text-orange-400 transition-colors duration-200">
        {theme === "light" ? "Dark" : ""}
      </span>
    </div>
  );
}