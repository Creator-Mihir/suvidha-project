import API from './api';

export const getGasBill        = async (connectionId) => (await API.get(`/gas/bill/${connectionId}`)).data;
export const getGasConnections  = async () => (await API.get('/gas/connections')).data;
export const getGasConsumption  = async (connectionId) => (await API.get(`/gas/consumption/${connectionId}`)).data;
export const payGasBill         = async (connectionId, amount) => (await API.post('/gas/payment', { connectionId, amount })).data;
export const bookCylinder       = async (connectionId) => (await API.post('/gas/cylinder-booking', { connectionId })).data;
export const submitGasComplaint = async (connectionId, category, description) => (await API.post('/gas/complaint', { connectionId, category, description })).data;
export const applyGasConnection = async (data) => (await API.post('/gas/new-connection', data)).data;
export const trackGasStatus     = async (refId) => (await API.get(`/gas/track/${refId}`)).data;