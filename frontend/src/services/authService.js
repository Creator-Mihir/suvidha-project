import API from './api';

// ─── Citizen OTP Flow ─────────────────────────────────────────────────────────

/**
 * Step 1 — Request OTP
 * Sends OTP to citizen's mobile number
 */
export const requestOTP = async (mobile) => {
  const response = await API.post('/auth/otp/request', { mobile });
  return response.data;
};

/**
 * Step 2 — Verify OTP
 * Verifies OTP and returns JWT token
 */
export const verifyOTP = async (mobile, otp) => {
  const response = await API.post('/auth/otp/verify', { mobile, otp });

  if (response.data.success) {
    // Save token and user info to localStorage
    localStorage.setItem('suvidha_token', response.data.data.token);
    localStorage.setItem('suvidha_user', JSON.stringify(response.data.data.user));
  }

  return response.data;
};

// ─── Admin Password Flow ──────────────────────────────────────────────────────

/**
 * Admin Login — username + password
 * role: 'dept_admin' | 'super_admin'
 */
export const adminLogin = async (username, password, role) => {
  const response = await API.post('/auth/login', { username, password, role });

  if (response.data.success) {
    localStorage.setItem('suvidha_token', response.data.data.token);
    localStorage.setItem('suvidha_user', JSON.stringify(response.data.data.user));
  }

  return response.data;
};

// ─── Logout ───────────────────────────────────────────────────────────────────

export const logout = () => {
  localStorage.removeItem('suvidha_token');
  localStorage.removeItem('suvidha_user');
  window.location.href = '/login';
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const getToken = () => localStorage.getItem('suvidha_token');

export const getUser = () => {
  const user = localStorage.getItem('suvidha_user');
  return user ? JSON.parse(user) : null;
};

export const isLoggedIn = () => !!getToken();

export const getUserRole = () => {
  const user = getUser();
  return user?.role || null;
};