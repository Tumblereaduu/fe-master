import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './darkmode.css'             // ← Dark mode css
import App from './App.jsx'
import { AuthProvider } from './Component/context/AuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'      // ← Dark mode context
import "@fontsource/inter";
import "@fontsource/league-spartan";
import { LivePriceProvider } from './Component/hooks/tradePage/useLivePriceContext.jsx'
import { TenantProvider } from "./context/TenantContext.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TenantProvider>
    <ThemeProvider>                 {/* ← Dark mode wrap */}
      <AuthProvider>
        <LivePriceProvider>
          <App />
        </LivePriceProvider>
      </AuthProvider>
    </ThemeProvider>
    </TenantProvider>
  </StrictMode>,
)
