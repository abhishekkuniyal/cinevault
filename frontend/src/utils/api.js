// API URL Helper for local development and cloud production deployment

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

/**
 * Returns the fully qualified API URL or relative path based on VITE_API_URL config.
 * @param {string} endpoint - e.g. '/api/auth/me'
 * @returns {string}
 */
export const getApiUrl = (endpoint = '') => {
  if (!endpoint) return API_BASE_URL;
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return API_BASE_URL ? `${API_BASE_URL}${path}` : path;
};
