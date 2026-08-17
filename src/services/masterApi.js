import axios from "axios";
import { BACKEND_API_URL } from "../api/config";
import Cookies from "js-cookie";

/**
 * Master API Service
 * Handles all Master Admin API calls
 * 
 * Note: For Step 1, this is the foundation.
 * Additional endpoints will be added as features are implemented in later phases.
 */

// Get Master auth token from cookies
const getMasterToken = () => {
  return Cookies.get("masterToken");
};

// Create axios instance with Master token
const createMasterApiClient = () => {
  const token = getMasterToken();
  return axios.create({
    baseURL: `${BACKEND_API_URL}`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

// ============================================
// Master Authentication APIs
// ============================================

/**
 * Master Login
 * @param {string} email
 * @param {string} password
 * @returns {Promise} { token, master, status }
 */
export const masterLogin = async (email, password) => {
  try {
    const response = await axios.post(`${BACKEND_API_URL}/master/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

// ============================================
// Master Dashboard APIs
// ============================================

/**
 * Get Master Dashboard Stats
 * @returns {Promise} { stats: { totalClients, activeClients, totalUsers, ... } }
 * 
 * PLACEHOLDER: Endpoint URL and structure may need adjustment based on backend
 */
export const getMasterDashboardStats = async () => {
  try {
    const client = createMasterApiClient();
    const response = await client.get("/dashboard/master/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    // Return placeholder data for Step 1
    return {
      success: false,
      message: "Dashboard API not yet implemented",
      stats: {},
    };
  }
};

// ============================================
// Placeholder for Future APIs
// ============================================

// ============================================
// Client Management APIs
// ============================================

/**
 * Get All Clients
 * @returns {Promise} { status, data: [clients], message }
 */
export const getMasterClients = async () => {
  try {
    const client = createMasterApiClient();
    const response = await client.get("/master/admins/");
    return response.data;
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error.response?.data || { message: "Failed to fetch clients" };
  }
};

/**
 * Get Client by ID
 * @param {number} clientId
 * @returns {Promise} { status, data: client, message }
 */
export const getMasterClientById = async (clientId) => {
  try {
    const client = createMasterApiClient();
    const response = await client.get(`/master/admins/${clientId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching client:", error);
    throw error.response?.data || { message: "Failed to fetch client" };
  }
};

/**
 * Create Client
 * @param {Object} clientData { name, company_name, email, primary_domain, plan, status }
 * @returns {Promise} { status, data: client, message }
 */
export const createMasterClient = async (clientData) => {
  try {
    const client = createMasterApiClient();
        const response = await client.post(
        "/master/admins",
        clientData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    return response.data;
  } catch (error) {
    console.error("Error creating client:", error);
    throw error.response?.data || { message: "Failed to create client" };
  }
};

/**
 * Update Client
 * @param {number} clientId
 * @param {Object} clientData { name, company_name, email, primary_domain, plan, status }
 * @returns {Promise} { status, data: client, message }
 */
export const updateMasterClient = async (clientId, clientData) => {
  try {
    const client = createMasterApiClient();
    const response = await client.put(`/master/admins/${clientId}`, clientData);
    return response.data;
  } catch (error) {
    console.error("Error updating client:", error);
    throw error.response?.data || { message: "Failed to update client" };
  }
};

/**
 * Deactivate Client
 * @param {number} clientId
 * @returns {Promise} { status, message }
 */
export const deactivateMasterClient = async (clientId) => {
  try {
    const client = createMasterApiClient();
    const response = await client.put(`/master/admins/${clientId}/status`, {});
    return response.data;
  } catch (error) {
    console.error("Error deactivating client:", error);
    throw error.response?.data || { message: "Failed to deactivate client" };
  }
};

// ============================================
// Domain Management APIs
// ============================================

/**
 * Get All Domains
 * @returns {Promise} { status, data: [domains], message }
 */
export const getMasterDomains = async () => {
  try {
    const client = createMasterApiClient();
    const response = await client.get("/domains");
    return response.data;
  } catch (error) {
    console.error("Error fetching domains:", error);
    throw error.response?.data || { message: "Failed to fetch domains" };
  }
};

/**
 * Get Domain by ID
 * @param {number} domainId
 * @returns {Promise} { status, data: domain, message }
 */
export const getMasterDomainById = async (domainId) => {
  try {
    const client = createMasterApiClient();
    const response = await client.get(`/domains/${domainId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching domain:", error);
    throw error.response?.data || { message: "Failed to fetch domain" };
  }
};

/**
 * Create Domain
 * @param {Object} domainData { domain, client_id, status }
 * @returns {Promise} { status, data: domain, message }
 */
export const createMasterDomain = async (domainData) => {
  try {
    const client = createMasterApiClient();
    const response = await client.post("/domains", domainData);
    return response.data;
  } catch (error) {
    console.error("Error creating domain:", error);
    throw error.response?.data || { message: "Failed to create domain" };
  }
};

/**
 * Update Domain
 * @param {number} domainId
 * @param {Object} domainData { domain, client_id, status }
 * @returns {Promise} { status, data: domain, message }
 */
export const updateMasterDomain = async (domainId, domainData) => {
  try {
    const client = createMasterApiClient();
    const response = await client.put(`/domains/${domainId}`, domainData);
    return response.data;
  } catch (error) {
    console.error("Error updating domain:", error);
    throw error.response?.data || { message: "Failed to update domain" };
  }
};

// ============================================
// Admin Management APIs
// ============================================

/**
 * Get All Admins (across all clients)
 * @returns {Promise} { status, data: [admins], message }
 */
export const getMasterAdmins = async () => {
  try {
    const client = createMasterApiClient();
    const response = await client.get("/master/admins");
    return response.data;
  } catch (error) {
    console.error("Error fetching admins:", error);
    throw error.response?.data || { message: "Failed to fetch admins" };
  }
};

/**
 * Get Admin by ID
 * @param {number} adminId
 * @returns {Promise} { status, data: admin, message }
 */
export const getMasterAdminById = async (adminId) => {
  try {
    const client = createMasterApiClient();
    const response = await client.get(`/admins/${adminId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching admin:", error);
    throw error.response?.data || { message: "Failed to fetch admin" };
  }
};

/**
 * Create Admin (assigned to a client)
 * @param {Object} adminData { admin_name, email_id, password, client_id, role, permission, status }
 * @returns {Promise} { status, data: admin, message }
 */
export const createMasterAdmin = async (adminData) => {
  try {
    const client = createMasterApiClient();
    const response = await client.post("/admins", adminData);
    return response.data;
  } catch (error) {
    console.error("Error creating admin:", error);
    throw error.response?.data || { message: "Failed to create admin" };
  }
};

/**
 * Update Admin
 * @param {number} adminId
 * @param {Object} adminData { admin_name, email_id, role, permission, status }
 * @returns {Promise} { status, data: admin, message }
 */
export const updateMasterAdmin = async (adminId, adminData) => {
  try {
    const client = createMasterApiClient();
    const response = await client.put(`/admins/${adminId}`, adminData);
    return response.data;
  } catch (error) {
    console.error("Error updating admin:", error);
    throw error.response?.data || { message: "Failed to update admin" };
  }
};

/**
 * Get Analytics Data
 * @param {string} timeRange - "24h", "7d", "30d", "90d"
 * @returns {Promise} { status, data: analytics, message }
 */
export const getMasterAnalytics = async (timeRange = "30d") => {
  try {
    const client = createMasterApiClient();
    const response = await client.get(`/analytics?timerange=${timeRange}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching analytics:", error);
    throw error.response?.data || { message: "Failed to fetch analytics" };
  }
};

export default {
  masterLogin,
  getMasterDashboardStats,
  getMasterClients,
  getMasterClientById,
  createMasterClient,
  updateMasterClient,
  deactivateMasterClient,
  getMasterDomains,
  getMasterDomainById,
  createMasterDomain,
  updateMasterDomain,
  getMasterAdmins,
  getMasterAdminById,
  createMasterAdmin,
  updateMasterAdmin,
  getMasterAnalytics,
};
