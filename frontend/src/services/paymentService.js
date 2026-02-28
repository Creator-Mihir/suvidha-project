import API from './api';

// Initiate a payment order
export const initiatePayment = async ({ department, connectionId, amount, description }) => {
  const response = await API.post('/payment/initiate', { department, connectionId, amount, description });
  return response.data;
};

// Confirm payment after user completes UI
export const confirmPayment = async ({ txnId, orderId, method, department, connectionId, amount }) => {
  const response = await API.post('/payment/confirm', { txnId, orderId, method, department, connectionId, amount });
  return response.data;
};

// Get full payment history (all depts)
export const getPaymentHistory = async (department = null) => {
  const url = department ? `/payment/history?department=${department}` : '/payment/history';
  const response = await API.get(url);
  return response.data;
};

// Get single receipt
export const getReceipt = async (txnId) => {
  const response = await API.get(`/payment/receipt/${txnId}`);
  return response.data;
};