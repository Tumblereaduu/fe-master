// utils/depositSource.js

/**
 * Detect if the user is accessing from mobile app or website
 * Returns 'mobile_app' or 'website'
 */
export const getDepositSource = () => {
  // Check if running inside React Native WebView or Capacitor
  const isReactNative = typeof window !== 'undefined' && window.ReactNativeWebView;
  const isCapacitor = typeof window !== 'undefined' && window.Capacitor;
  
  // Check for custom headers or global variables set by mobile app
  const isMobileApp = typeof window !== 'undefined' && (
    window.__MOBILE_APP__ === true || 
    window.__IS_MOBILE_APP__ === true ||
    localStorage.getItem('is_mobile_app') === 'true'
  );
  
  // Check user agent for mobile app indicators
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
  const hasMobileAppIndicator = userAgent.includes('wv') || // Android WebView
                                 userAgent.includes('capacitor') ||
                                 userAgent.includes('ionic') ||
                                 userAgent.includes('cordova');
  
  if (isReactNative || isCapacitor || isMobileApp || hasMobileAppIndicator) {
    return 'mobile_app';
  }
  
  return 'website';
};

/**
 * Get the display label for deposit source
 */
export const getDepositSourceLabel = (source) => {
  return source === 'mobile_app' ? 'Mobile App' : 'Website';
};