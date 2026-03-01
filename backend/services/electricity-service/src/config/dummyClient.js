const axios = require('axios');

const DUMMY_URL = process.env.DUMMY_SERVER_URL || 'http://localhost:3001';
const USE_DUMMY = process.env.USE_DUMMY_SERVER === 'true';

/**
 * Call dummy server with automatic fallback to local DB data.
 * When friend's server is ready: set USE_DUMMY_SERVER=true in .env
 * Until then: returns realistic mock data so frontend works immediately
 */

const getDummyBill = async (connectionId) => {
  if (USE_DUMMY) {
    try {
      const res = await axios.get(`${DUMMY_URL}/electricity/bill/${connectionId}`, {
        timeout: 15000,
      });
      return res.data;
    } catch (err) {
      console.warn('[DUMMY] Dummy server unavailable, using fallback data');
    }
  }

  // ── Fallback mock data ──
  return {
    connectionId,
    consumerName:    'Ramesh Kumar',
    address:         'B-42, Vijay Nagar, Indore, MP',
    connectionType:  'Domestic',
    billingMonth:    'Feb 2026',
    unitsConsumed:   342,
    amount:          4250.00,
    dueDate:         '2026-03-15',
    lateFee:         150.00,
    status:          'unpaid',
    breakdown: {
      fixedCharges:   250.00,
      energyCharges:  3450.00,
      stateDuty:      333.00,
      total:          4250.00,
    },
    paymentHistory: [
      { month: 'Jan 2026', amount: 3840, paidOn: '12 Jan 2026', status: 'paid' },
      { month: 'Dec 2025', amount: 4120, paidOn: '10 Dec 2025', status: 'paid' },
      { month: 'Nov 2025', amount: 3650, paidOn: '08 Nov 2025', status: 'paid' },
    ],
  };
};

const getDummyConnections = async (userId) => {
  if (USE_DUMMY) {
    try {
      const res = await axios.get(`${DUMMY_URL}/electricity/connections/${userId}`, {
        timeout: 15000,
      });
      return res.data;
    } catch (err) {
      console.warn('[DUMMY] Dummy server unavailable, using fallback data');
    }
  }

  return [
    { connectionId: 'EL-2024-00123', label: 'Home', address: 'Vijay Nagar, Indore' },
    { connectionId: 'EL-2024-00456', label: 'Office', address: 'Palasia, Indore' },
  ];
};

const submitDummyPayment = async (connectionId, amount, paymentMethod) => {
  if (USE_DUMMY) {
    try {
      const res = await axios.post(`${DUMMY_URL}/electricity/payment`, {
        connectionId, amount, paymentMethod,
      }, { timeout: 3000 });
      return res.data;
    } catch (err) {
      console.warn('[DUMMY] Dummy server unavailable, using fallback');
    }
  }

  // Mock successful payment response
  const txnId = `TXN-${Date.now().toString().slice(-8)}`;
  return {
    success:       true,
    transactionId: txnId,
    message:       `Payment of ₹${amount} successful.`,
    receiptId:     `RCP-${txnId}`,
  };
};

const submitDummyComplaint = async (data) => {
  if (USE_DUMMY) {
    try {
      const res = await axios.post(`${DUMMY_URL}/electricity/complaint`, data, {
        timeout: 3000,
      });
      return res.data;
    } catch (err) {
      console.warn('[DUMMY] Dummy server unavailable, using fallback');
    }
  }

  const ticketId = `TKT-${Date.now().toString().slice(-6)}`;
  return {
    success:  true,
    ticketId,
    message:  `Complaint registered. Ticket ID: ${ticketId}. Technician will visit in 24-48 hours.`,
  };
};

const submitDummyNewConnection = async (data) => {
  if (USE_DUMMY) {
    try {
      const res = await axios.post(`${DUMMY_URL}/electricity/new-connection`, data, {
        timeout: 3000,
      });
      return res.data;
    } catch (err) {
      console.warn('[DUMMY] Dummy server unavailable, using fallback');
    }
  }

  const appId = `APP-${Date.now().toString().slice(-6)}`;
  return {
    success:       true,
    applicationId: appId,
    message:       `Application submitted successfully. Ref ID: ${appId}. Verification pending.`,
  };
};

const getDummyTrackingStatus = async (refId) => {
  if (USE_DUMMY) {
    try {
      const res = await axios.get(`${DUMMY_URL}/electricity/track/${refId}`, {
        timeout: 3000,
      });
      return res.data;
    } catch (err) {
      console.warn('[DUMMY] Dummy server unavailable, using fallback');
    }
  }

  // Realistic tracking steps
  return {
    refId,
    currentStatus: 'in_progress',
    steps: [
      { label: 'Request Registered',  status: 'completed', time: '10 min ago' },
      { label: 'Under Review',         status: 'completed', time: '5 min ago'  },
      { label: 'In Progress',          status: 'active',    time: 'Now'        },
      { label: 'Resolved',             status: 'pending',   time: 'Pending'    },
    ],
  };
};

module.exports = {
  getDummyBill,
  getDummyConnections,
  submitDummyPayment,
  submitDummyComplaint,
  submitDummyNewConnection,
  getDummyTrackingStatus,
};