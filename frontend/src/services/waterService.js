import API from './api';

export const getWaterBill          = async (connectionId) => (await API.get(`/water/bill/${connectionId}`)).data;
export const getWaterConnections   = async () => (await API.get('/water/connections')).data;
export const payWaterBill          = async (connectionId, amount, paymentMethod) => (await API.post('/water/payment', { connectionId, amount, paymentMethod })).data;
export const submitWaterComplaint  = async (connectionId, category, description) => (await API.post('/water/complaint', { connectionId, category, description })).data;
export const applyWaterConnection  = async (data) => (await API.post('/water/new-connection', data)).data;
export const trackWaterStatus      = async (refId) => (await API.get(`/water/track/${refId}`)).data;