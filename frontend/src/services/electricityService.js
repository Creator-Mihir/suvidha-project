import API from './api';

// ─── Bill ─────────────────────────────────────────────────────────────────────

export const getBill = async (connectionId) => {
  const response = await API.get(`/electricity/bill/${connectionId}`);
  return response.data;
};

export const getSavedConnections = async () => {
  const response = await API.get('/electricity/connections');
  return response.data;
};

export const getPaymentHistory = async () => {
  const response = await API.get('/electricity/history');
  return response.data;
};

// ─── Payment ──────────────────────────────────────────────────────────────────

export const payBill = async (connectionId, amount, paymentMethod = 'kiosk') => {
  const response = await API.post('/electricity/payment', {
    connectionId, amount, paymentMethod,
  });
  return response.data;
};

// ─── Complaint ────────────────────────────────────────────────────────────────

export const submitComplaint = async (connectionId, category, description) => {
  const response = await API.post('/electricity/complaint', {
    connectionId, category, description,
  });
  return response.data;
};

// ─── New Connection ───────────────────────────────────────────────────────────

export const applyNewConnection = async (formData) => {
  const response = await API.post('/electricity/new-connection', formData);
  return response.data;
};

// ─── Tracking ─────────────────────────────────────────────────────────────────

export const trackStatus = async (refId) => {
  const response = await API.get(`/electricity/track/${refId}`);
  return response.data;
};