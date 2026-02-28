const axios = require('axios');
const DUMMY_URL = process.env.DUMMY_SERVER_URL || 'http://localhost:4002';
const USE_DUMMY = process.env.USE_DUMMY_SERVER === 'true';

const tryDummy = async (fn, fallback) => {
  if (USE_DUMMY) {
    try { return await fn(); }
    catch { console.warn('[GAS-DUMMY] Unavailable, using fallback'); }
  }
  return fallback();
};

const getDummyBill = async (connectionId) => tryDummy(
  () => axios.get(`${DUMMY_URL}/gas/bill/${connectionId}`, { timeout: 3000 }).then(r => r.data),
  () => ({
    connectionId,
    consumerName: 'Ramesh Kumar',
    address: 'B-42, Vijay Nagar, Indore, MP',
    billingMonth: 'Feb 2026',
    amount: 1250.00,
    dueDate: '2026-03-18',
    status: 'unpaid',
    connectionType: 'Domestic',
  })
);

const getDummyConnections = async (userId) => tryDummy(
  () => axios.get(`${DUMMY_URL}/gas/connections/${userId}`, { timeout: 3000 }).then(r => r.data),
  () => [
    { connectionId: 'GAS-1092837', label: 'Home',   amount: 1850 },
    { connectionId: 'GAS-2200331', label: 'Shop',   amount: 4200 },
    { connectionId: 'GAS-3004412', label: 'Office', amount: 850  },
  ]
);

const getDummyConsumption = async (connectionId) => tryDummy(
  () => axios.get(`${DUMMY_URL}/gas/consumption/${connectionId}`, { timeout: 3000 }).then(r => r.data),
  () => ({
    currentMonthSCM: 28.5,
    previousMonthSCM: 24.2,
    efficiencyRating: 'Good',
    trend: 'up',
    history: [
      { month: 'Oct 2025', scm: 22.1 },
      { month: 'Nov 2025', scm: 24.2 },
      { month: 'Dec 2025', scm: 26.8 },
      { month: 'Jan 2026', scm: 24.2 },
      { month: 'Feb 2026', scm: 28.5 },
    ],
  })
);

const submitDummyPayment = async (connectionId, amount) => tryDummy(
  () => axios.post(`${DUMMY_URL}/gas/payment`, { connectionId, amount }, { timeout: 3000 }).then(r => r.data),
  () => {
    const txnId = `TXN-${Date.now().toString().slice(-8)}`;
    return { success: true, transactionId: txnId, message: `Payment of ₹${amount} successful.` };
  }
);

const submitDummyCylinderBooking = async (connectionId) => tryDummy(
  () => axios.post(`${DUMMY_URL}/gas/cylinder-booking`, { connectionId }, { timeout: 3000 }).then(r => r.data),
  () => {
    const bookingId = `BK${Date.now().toString().slice(-6)}`;
    return { success: true, bookingId, message: `Cylinder booked. Delivery in 48 hrs. Ref: ${bookingId}` };
  }
);

const submitDummyComplaint = async (data) => tryDummy(
  () => axios.post(`${DUMMY_URL}/gas/complaint`, data, { timeout: 3000 }).then(r => r.data),
  () => {
    const ticketId = `TKT${Date.now().toString().slice(-6)}`;
    return { success: true, ticketId, message: `Complaint filed. Ticket: ${ticketId}. Resolution in 24 hours.` };
  }
);

const submitDummyNewConnection = async (data) => tryDummy(
  () => axios.post(`${DUMMY_URL}/gas/new-connection`, data, { timeout: 3000 }).then(r => r.data),
  () => {
    const appId = `APP${Date.now().toString().slice(-6)}`;
    return { success: true, applicationId: appId, message: `Application submitted. ID: ${appId}. Verification will start shortly.` };
  }
);

const getDummyTrackingStatus = async (refId) => tryDummy(
  () => axios.get(`${DUMMY_URL}/gas/track/${refId}`, { timeout: 3000 }).then(r => r.data),
  () => ({
    refId,
    currentStatus: 'in_progress',
    steps: [
      { label: 'Request Registered', status: 'completed', time: '10 min ago' },
      { label: 'Under Review',       status: 'completed', time: '5 min ago'  },
      { label: 'In Progress',        status: 'active',    time: 'Now'        },
      { label: 'Resolved',           status: 'pending',   time: 'Pending'    },
    ],
  })
);

module.exports = {
  getDummyBill, getDummyConnections, getDummyConsumption,
  submitDummyPayment, submitDummyCylinderBooking,
  submitDummyComplaint, submitDummyNewConnection, getDummyTrackingStatus,
};