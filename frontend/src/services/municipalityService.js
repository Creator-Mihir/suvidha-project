import API from './api';

export const getProperties          = async () => (await API.get('/municipality/properties')).data;
export const payPropertyTax         = async (propertyId, amount, period) => (await API.post('/municipality/property-tax', { propertyId, amount, period })).data;
export const applyCertificate       = async (certificateType, fields) => (await API.post('/municipality/certificate', { certificateType, fields })).data;
export const submitMuniComplaint    = async (data) => (await API.post('/municipality/complaint', data)).data;
export const applyBuildingApproval  = async (data) => (await API.post('/municipality/building-approval', data)).data;
export const applyTradeLicense      = async (data) => (await API.post('/municipality/trade-license', data)).data;
export const trackMuniStatus        = async (refId) => (await API.get(`/municipality/track/${refId}`)).data;