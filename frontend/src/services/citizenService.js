import API from './api';

// ─── Profile ──────────────────────────────────────────────────────────────────

/**
 * Check if citizen has a profile set up
 * Returns { profile, hasProfile }
 */
export const getProfile = async () => {
  const response = await API.get('/citizen/profile');
  return response.data;
};

/**
 * First time setup — save citizen name
 */
export const setupProfile = async ({ fullName, city, state, pincode }) => {
  const response = await API.post('/citizen/profile/setup', {
    fullName, city, state, pincode,
  });

  if (response.data.success) {
    // Update localStorage with name so dashboard shows it immediately
    const user = JSON.parse(localStorage.getItem('suvidha_user') || '{}');
    user.full_name = response.data.data.profile.full_name;
    localStorage.setItem('suvidha_user', JSON.stringify(user));
  }

  return response.data;
};

/**
 * Update profile
 */
export const updateProfile = async (data) => {
  const response = await API.put('/citizen/profile', data);
  return response.data;
};

// ─── Connections ──────────────────────────────────────────────────────────────

export const getConnections = async () => {
  const response = await API.get('/citizen/connections');
  return response.data;
};

export const addConnection = async (department, connectionId) => {
  const response = await API.post('/citizen/connections', { department, connectionId });
  return response.data;
};