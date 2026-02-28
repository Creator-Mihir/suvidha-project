const axios = require('axios');
const DUMMY_URL = process.env.DUMMY_SERVER_URL || 'http://localhost:4004';
const USE_DUMMY = process.env.USE_DUMMY_SERVER === 'true';

const tryDummy = async (fn, fallback) => {
  if (USE_DUMMY) {
    try { return await fn(); }
    catch { console.warn('[MUNI-DUMMY] Unavailable, using fallback'); }
  }
  return fallback();
};

const getDummyProperties = async (userId) => tryDummy(
  () => axios.get(`${DUMMY_URL}/municipality/properties/${userId}`, { timeout: 3000 }).then(r => r.data),
  () => [
    { id: 'PROP-4421-A', label: 'Flat 402, Vijay Nagar, Indore', tax: 4800  },
    { id: 'PROP-8821-B', label: 'Shop 12, Palasia, Indore',      tax: 12500 },
    { id: 'PROP-1132-C', label: 'Plot 7, Scheme 54, Indore',     tax: 8200  },
  ]
);

const submitDummyPropertyTax = async (data) => tryDummy(
  () => axios.post(`${DUMMY_URL}/municipality/property-tax`, data, { timeout: 3000 }).then(r => r.data),
  () => {
    const id = `TAX-${Date.now().toString().slice(-6)}`;
    return { success: true, receiptId: id, message: `Tax paid. Receipt ID: ${id}` };
  }
);

const submitDummyCertificate = async (data) => tryDummy(
  () => axios.post(`${DUMMY_URL}/municipality/certificate`, data, { timeout: 3000 }).then(r => r.data),
  () => {
    const id = `CERT-${Date.now().toString().slice(-6)}`;
    return { success: true, applicationId: id, message: `Certificate ID: ${id}. Processing: 7 working days.` };
  }
);

const submitDummyComplaint = async (data) => tryDummy(
  () => axios.post(`${DUMMY_URL}/municipality/complaint`, data, { timeout: 3000 }).then(r => r.data),
  () => {
    const id = `CMP-${Date.now().toString().slice(-6)}`;
    return { success: true, ticketId: id, message: `Ticket ID: ${id}. Resolution in 48 hours.` };
  }
);

const submitDummyBuildingApproval = async (data) => tryDummy(
  () => axios.post(`${DUMMY_URL}/municipality/building-approval`, data, { timeout: 3000 }).then(r => r.data),
  () => {
    const id = `BLD-${Date.now().toString().slice(-6)}`;
    return { success: true, applicationId: id, message: `Building Approval ID: ${id}. Site inspection in 7 days.` };
  }
);

const submitDummyTradeLicense = async (data) => tryDummy(
  () => axios.post(`${DUMMY_URL}/municipality/trade-license`, data, { timeout: 3000 }).then(r => r.data),
  () => {
    const id = `TRD-${Date.now().toString().slice(-6)}`;
    return { success: true, applicationId: id, message: `Trade License ID: ${id}. Inspection in 5 working days.` };
  }
);

const getDummyTrackingStatus = async (refId) => tryDummy(
  () => axios.get(`${DUMMY_URL}/municipality/track/${refId}`, { timeout: 3000 }).then(r => r.data),
  () => {
    const getSteps = (id) => {
      if (id.startsWith('TAX'))  return ['Payment Received', 'Receipt Generated', 'Records Updated'];
      if (id.startsWith('CERT')) return ['Application Received', 'Documents Verification', 'Processing'];
      if (id.startsWith('CMP'))  return ['Complaint Registered', 'Assigned to Department', 'In Progress'];
      if (id.startsWith('BLD'))  return ['Application Received', 'Site Inspection Scheduled', 'Under Review'];
      if (id.startsWith('TRD'))  return ['Application Received', 'Inspection Scheduled', 'Under Review'];
      return ['Request Received', 'Processing', 'In Progress'];
    };
    const steps = getSteps(refId);
    return {
      refId, currentStatus: 'in_progress',
      steps: steps.map((label, i) => ({
        label,
        status: i < steps.length - 1 ? 'completed' : 'active',
        time: i < steps.length - 1 ? 'Completed' : 'In Progress...',
      })),
    };
  }
);

module.exports = {
  getDummyProperties, submitDummyPropertyTax, submitDummyCertificate,
  submitDummyComplaint, submitDummyBuildingApproval, submitDummyTradeLicense,
  getDummyTrackingStatus,
};