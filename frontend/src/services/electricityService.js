// Electricity Service - Frontend
// Flow: Frontend → API Gateway (3000) → Electricity Microservice (3003) → PostgreSQL DB

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const BASE = `${API}/electricity`;

// ── Token Management ───────────────────────────────────────────────────────────
const getElectricityToken = () => localStorage.getItem('electricity_token');
const setElectricityToken = (token) => localStorage.setItem('electricity_token', token);
const clearElectricityToken = () => localStorage.removeItem('electricity_token');

const getSuvidhaUser = () => {
  try { return JSON.parse(localStorage.getItem('suvidha_user') || '{}'); }
  catch { return {}; }
};

// Suvidha JWT (for API Gateway auth middleware)
const suvidhaHeaders = (extra = {}) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('suvidha_token')}`,
  ...extra,
});

// Electricity JWT (for electricity service auth)
const electricityHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('suvidha_token')}`,
  'X-Electricity-Token': getElectricityToken() || '',
});

// ── LOGIN (K Number + Mobile → get electricity service JWT) ──────────────────
export const loginToElectricityService = async (kNumber, mobileNumber) => {
  const res = await fetch(`${BASE}/login`, {
    method: 'POST',
    headers: suvidhaHeaders(),
    body: JSON.stringify({ kNumber, mobileNumber }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  setElectricityToken(data.token);
  localStorage.setItem('electricity_kNumber', kNumber);
  return data;
};

// Auto-login helper
const ensureLoggedIn = async (kNumber) => {
  if (!getElectricityToken()) {
    const user = getSuvidhaUser();
    const mobile = user.mobile || user.mobileNumber;
    if (!mobile) throw new Error('Please login to SUVIDHA first');
    await loginToElectricityService(kNumber, mobile);
  }
};

// ── BILL ──────────────────────────────────────────────────────────────────────
export const getBill = async (kNumber) => {
  await ensureLoggedIn(kNumber);
  const res = await fetch(`${BASE}/bill/current`, {
    headers: electricityHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch bill');
  return {
    data: {
      consumerName:  data.data?.consumerName || data.consumerName || 'Consumer',
      connectionId:  data.data?.connectionId || data.connectionId || kNumber,
      billingMonth:  data.data?.billingMonth || data.billingMonth || 'N/A',
      unitsConsumed: data.data?.unitsConsumed || data.unitsConsumed || 0,
      amount:        data.data?.amount || data.amount || 0,
      dueDate:       data.data?.dueDate || data.dueDate ? new Date(data.data?.dueDate || data.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A',
      status:        data.data?.status || data.status || 'unknown',
      billId:        data.data?.billId || data.billId || data._id,
      breakdown: {
        energyCharges: data.data?.breakdown?.energyCharges || Math.floor((data.data?.amount || data.amount || 0) * 0.75),
        fixedCharges:  data.data?.breakdown?.fixedCharges || Math.floor((data.data?.amount || data.amount || 0) * 0.15),
        taxes:         data.data?.breakdown?.taxes || Math.floor((data.data?.amount || data.amount || 0) * 0.10),
        total:         data.data?.breakdown?.total || data.data?.amount || data.amount || 0,
      },
    },
  };
};

export const getBillHistory = async (kNumber) => {
  await ensureLoggedIn(kNumber);
  const res = await fetch(`${BASE}/bill/history`, {
    headers: electricityHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch history');
  
  const bills = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
  return { data: { bills } };
};

export const payBill = async (kNumber, amount, billId) => {
  await ensureLoggedIn(kNumber);
  const res = await fetch(`${BASE}/bill/pay`, {
    method: 'POST',
    headers: electricityHeaders(),
    body: JSON.stringify({ billId, amount }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Payment failed');
  return {
    data: {
      transactionId: data.data?.transactionId || data.transactionId || `PAY-${Date.now()}`,
      message: data.message || data.data?.message || 'Payment successful',
      status: 'success',
    },
  };
};

// ── COMPLAINTS ────────────────────────────────────────────────────────────────
export const submitComplaint = async (kNumber, complaintType, description) => {
  await ensureLoggedIn(kNumber);
  const res = await fetch(`${BASE}/complaint`, {
    method: 'POST',
    headers: electricityHeaders(),
    body: JSON.stringify({ complaintType, description }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to submit complaint');
  return {
    data: {
      ticketId: data.data?.ticketId || data.ticketId || `TKT-${Date.now()}`,
      message: data.message || data.data?.message || 'Complaint registered successfully',
    },
  };
};

export const getMyComplaints = async (kNumber) => {
  await ensureLoggedIn(kNumber);
  const res = await fetch(`${BASE}/complaints`, {
    headers: electricityHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch complaints');
  
  const complaints = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
  return { data: { complaints } };
};

// ── NEW CONNECTION ─────────────────────────────────────────────────────────────
export const applyNewConnection = async (formData) => {
  const res = await fetch(`${BASE}/connection/request`, {
    method: 'POST',
    headers: suvidhaHeaders(),
    body: JSON.stringify({
      applicantName:  formData.fullName,
      mobileNumber:   formData.mobile,
      address:        formData.address,
      connectionType: formData.connectionType?.toLowerCase() || 'residential',
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to submit application');
  return {
    data: {
      applicationId: data.data?.applicationId || data.applicationId || `APP-${Date.now()}`,
      message: data.message || data.data?.message || 'Application submitted successfully',
    },
  };
};

// ── TRACK STATUS ──────────────────────────────────────────────────────────────
export const trackStatus = async (refId) => {
  const res = await fetch(`${BASE}/track/${refId}`, {
    headers: suvidhaHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Reference ID not found');
  return { data: data.data || data };
};

// ── SAVED CONNECTIONS ─────────────────────────────────────────────────────────
export const getSavedConnections = async () => {
  const user = getSuvidhaUser();
  return {
    data: {
      connections: user.kNumber ? [{
        connectionId: user.kNumber,
        label: 'My Connection',
        address: user.address || '',
        status: 'active',
      }] : [],
    },
  };
};