// Electricity Service - connects to dummy server on port 5003 (MongoDB)
// Auth: kNumber + mobileNumber -> JWT token -> use for all calls

const DUMMY_URL = 'http://localhost:5003';

// Token Management
const getElectricityToken = () => localStorage.getItem('electricity_token');
const setElectricityToken = (token) => localStorage.setItem('electricity_token', token);

// Get logged in SUVIDHA user
const getSuvidhaUser = () => {
  try { return JSON.parse(localStorage.getItem('suvidha_user') || '{}'); }
  catch { return {}; }
};

// Auth Headers
const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getElectricityToken()}`,
});

// LOGIN to dummy server
export const loginToDummyServer = async (kNumber, mobileNumber) => {
  const response = await fetch(`${DUMMY_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ kNumber, mobileNumber }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Login failed');
  setElectricityToken(data.token);
  localStorage.setItem('electricity_kNumber', kNumber);
  return data;
};

// Helper - auto login using SUVIDHA user mobile
const ensureLoggedIn = async (kNumber) => {
  if (!getElectricityToken()) {
    const user = getSuvidhaUser();
    const mobile = user.mobile || user.mobileNumber;
    if (!mobile) throw new Error('Please login to SUVIDHA first');
    await loginToDummyServer(kNumber, mobile);
  }
};

// GET Current Bill
export const getBill = async (kNumber) => {
  await ensureLoggedIn(kNumber);
  const response = await fetch(`${DUMMY_URL}/api/bills/current`, {
    headers: authHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch bill');
  return {
    data: {
      consumerName:  data.name || 'Consumer',
      connectionId:  data.kNumber,
      billingMonth:  data.billMonth,
      unitsConsumed: data.unitsConsumed,
      amount:        data.amount,
      dueDate:       new Date(data.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      status:        data.status,
      billId:        data._id,
      breakdown: {
        energyCharges: Math.floor(data.amount * 0.75),
        fixedCharges:  Math.floor(data.amount * 0.15),
        taxes:         Math.floor(data.amount * 0.10),
        total:         data.amount,
      }
    }
  };
};

// GET Saved Connections - uses real logged in user
export const getSavedConnections = async () => {
  const user = getSuvidhaUser();
  return {
    data: {
      connections: user.kNumber ? [
        {
          connectionId: user.kNumber,
          label: 'My Connection',
          address: user.address || '',
          status: 'active',
        }
      ] : []
    }
  };
};

// PAY Bill
export const payBill = async (kNumber, amount, billId) => {
  await ensureLoggedIn(kNumber);
  const response = await fetch(`${DUMMY_URL}/api/bills/pay`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ billId }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Payment failed');
  return {
    data: {
      transactionId: data.bill?.paymentId || `PAY-${Date.now()}`,
      message: data.message,
      status: 'success',
    }
  };
};

// GET Bill History
export const getBillHistory = async (kNumber) => {
  await ensureLoggedIn(kNumber);
  const response = await fetch(`${DUMMY_URL}/api/bills/history`, {
    headers: authHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch history');
  return { data: { bills: Array.isArray(data) ? data : [] } };
};

// FILE Complaint
export const submitComplaint = async (kNumber, category, description) => {
  await ensureLoggedIn(kNumber);
  const response = await fetch(`${DUMMY_URL}/api/complaints/new`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ category, description }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to submit complaint');
  return {
    data: {
      ticketId: data.complaint?._id || `TKT-${Date.now()}`,
      message: data.message || 'Complaint registered successfully',
    }
  };
};

// GET My Complaints
export const getMyComplaints = async (kNumber) => {
  await ensureLoggedIn(kNumber);
  const response = await fetch(`${DUMMY_URL}/api/complaints/mine`, {
    headers: authHeaders(),
  });
  const data = await response.json();
  return { data: { complaints: Array.isArray(data) ? data : [] } };
};

// NEW Connection Request
export const applyNewConnection = async (formData) => {
  const response = await fetch(`${DUMMY_URL}/api/connection/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      applicantName:  formData.fullName,
      mobileNumber:   formData.mobile,
      address:        formData.address,
      connectionType: formData.connectionType?.toLowerCase() || 'residential',
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to submit application');
  return {
    data: {
      applicationId: data.connection?.applicationId || `APP-${Date.now()}`,
      message: data.message || 'Application submitted successfully',
    }
  };
};

// TRACK Status
export const trackStatus = async (refId) => {
  try {
    const r = await fetch(`${DUMMY_URL}/api/complaints/status/${refId}`, { headers: authHeaders() });
    if (r.ok) {
      const d = await r.json();
      return { data: { refId, currentStatus: d.status } };
    }
  } catch {}
  try {
    const r = await fetch(`${DUMMY_URL}/api/connection/status/${refId}`);
    if (r.ok) {
      const d = await r.json();
      return { data: { refId, currentStatus: d.status } };
    }
  } catch {}
  throw new Error('Reference ID not found');
};