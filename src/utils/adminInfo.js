// src/utils/adminInfo.js
// ✅ ES Module export (React compatible)
// Helper to get current admin info from ALL possible storage sources

export const getAdminInfo = () => {
  try {
    // 1. Check 'admin' object in localStorage (most reliable)
    const adminStr = localStorage.getItem('admin');
    if (adminStr) {
      try {
        const admin = JSON.parse(adminStr);
        if (admin && (admin.admin_name || admin.name)) {
          console.log('[getAdminInfo] ✅ Found in localStorage.admin:', admin.admin_name || admin.name);
          return { 
            admin_id: admin.id || null, 
            admin_name: admin.admin_name || admin.name || null 
          };
        }
      } catch (e) {}
    }

    // 2. Check 'token' in localStorage (JWT decode)
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          const name = payload.name || payload.admin_name || payload.username;
          if (name) {
            console.log('[getAdminInfo] ✅ Found in localStorage token:', name);
            return { admin_id: payload.id || null, admin_name: name };
          }
        }
      } catch (e) {}
    }

    // 3. Check 'adminToken' in localStorage
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      try {
        const parts = adminToken.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          const name = payload.name || payload.admin_name || payload.username;
          if (name) {
            console.log('[getAdminInfo] ✅ Found in localStorage.adminToken:', name);
            return { admin_id: payload.id || null, admin_name: name };
          }
        }
      } catch (e) {}
    }

    // 4. Check Cookies (your app uses js-cookie)
    // We can't import Cookies here to avoid dependency issues
    // So we use document.cookie directly
    try {
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'adminInfo' && value) {
          const admin = JSON.parse(decodeURIComponent(value));
          if (admin && (admin.admin_name || admin.name)) {
            console.log('[getAdminInfo] ✅ Found in Cookie.adminInfo:', admin.admin_name || admin.name);
            return { admin_id: admin.id || null, admin_name: admin.admin_name || admin.name || null };
          }
        }
        if (name === 'adminToken' && value) {
          const parts = value.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            const tokenName = payload.name || payload.admin_name || payload.username;
            if (tokenName) {
              console.log('[getAdminInfo] ✅ Found in Cookie.adminToken:', tokenName);
              return { admin_id: payload.id || null, admin_name: tokenName };
            }
          }
        }
      }
    } catch (e) {}

    // 5. Check 'user' object in localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && (user.admin_name || user.name || user.username)) {
          const name = user.admin_name || user.name || user.username;
          console.log('[getAdminInfo] ✅ Found in localStorage.user:', name);
          return { admin_id: user.id || null, admin_name: name };
        }
      } catch (e) {}
    }

    // 6. Check sessionStorage as fallback
    const sessionAdmin = sessionStorage.getItem('admin');
    if (sessionAdmin) {
      try {
        const admin = JSON.parse(sessionAdmin);
        if (admin && (admin.admin_name || admin.name)) {
          console.log('[getAdminInfo] ✅ Found in sessionStorage.admin:', admin.admin_name || admin.name);
          return { admin_id: admin.id || null, admin_name: admin.admin_name || admin.name || null };
        }
      } catch (e) {}
    }

    // DEBUG
    console.warn('[getAdminInfo] ❌ Could not find admin name!');
    console.log('[getAdminInfo] localStorage keys:', Object.keys(localStorage));
    
  } catch (e) {
    console.error('[getAdminInfo] Error:', e);
  }
  
  return { admin_id: null, admin_name: null };
};
