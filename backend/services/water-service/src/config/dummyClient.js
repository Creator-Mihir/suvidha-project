const axios = require('axios');
const DUMMY_URL = process.env.DUMMY_SERVER_URL || 'http://localhost:4003';
const USE_DUMMY = process.env.USE_DUMMY_SERVER === 'true';

const tryDummy = async (fn, fallback) => {
  if (USE_DUMMY) {
    try { return await fn(); }
    catch { console.warn('[WATER-DUMMY] Unavailable, using fallback'); }
  }
  return fallback();
};

const getDummyBill = async (connectionId) => tryDummy(
  () => axios.get(`${DUMMY_URL}/water/bill/${connectionId}`, { timeout: 3000 }).then(r => r.data),
  () => ({
    connectionId,
    consumerName: 'Rahul Sharma',
    address: 'Flat 402, Vijay Nagar, Indore',
    billingPeriod: '01 Jan - 31 Jan 2026',
    dueDate: '2026-03-15',
    prevReading: 1245,
    currReading: 1282,
    unitsConsumed: 37,
    amount: 1450,
    status: 'unpaid',
    breakdown: { fixed: 120, variable: 1180, taxes: 150, total: 1450 },
  })
);

const getDummyConnections = async (userId) => tryDummy(
  () => axios.get(`${DUMMY_URL}/water/connections/${userId}`, { timeout: 3000 }).then(r => r.data),
  () => [
    { connectionId: '9921-0012-334', label: 'Home',   address: 'Vijay Nagar, Indore' },
    { connectionId: '4432-1109-887', label: 'Office', address: 'Palasia, Indore'     },
  ]
);

const submitDummyPayment = async (connectionId, amount, method) => tryDummy(
  () => axios.post(`${DUMMY_URL}/water/payment`, { connectionId, amount, method }, { timeout: 3000 }).then(r => r.data),
  () => {
    const txnId = `TXN${Date.now().toString().slice(-8)}`;
    return { success: true, transactionId: txnId, message: `Payment of ₹${amount} successful. Transaction ID: ${txnId}` };
  }
);

const submitDummyNewConnection = async (data) => tryDummy(
  () => axios.post(`${DUMMY_URL}/water/new-connection`, data, { timeout: 3000 }).then(r => r.data),
  () => {
    const ticketId = `#NEW-${Date.now().toString().slice(-3)}`;
    return { success: true, ticketId, message: `Application submitted. Ticket: ${ticketId}` };
  }
);

const submitDummyComplaint = async (data) => tryDummy(
  () => axios.post(`${DUMMY_URL}/water/complaint`, data, { timeout: 3000 }).then(r => r.data),
  () => {
    const ticketId = `WTR-CMP-${Date.now().toString().slice(-6)}`;
    return { success: true, ticketId, message: `Complaint registered. Ticket: ${ticketId}` };
  }
);

const getDummyTrackingStatus = async (refId) => tryDummy(
  () => axios.get(`${DUMMY_URL}/water/track/${refId}`, { timeout: 3000 }).then(r => r.data),
  () => ({
    refId, currentStatus: 'in_progress',
    steps: [
      { label: 'Request Registered', status: 'completed', time: '10 min ago' },
      { label: 'Under Review',       status: 'completed', time: '5 min ago'  },
      { label: 'In Progress',        status: 'active',    time: 'Now'        },
      { label: 'Resolved',           status: 'pending',   time: 'Pending'    },
    ],
  })
);

module.exports = { getDummyBill, getDummyConnections, submitDummyPayment, submitDummyNewConnection, submitDummyComplaint, getDummyTrackingStatus };