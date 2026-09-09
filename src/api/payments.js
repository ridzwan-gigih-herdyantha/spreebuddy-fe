import api from "./axios";

const BASE = "/api/v1/payments";

// Tax and shipping rules live on the server
export const getPaymentConfig = () => api.get(`${BASE}/config`);

export const createCheckout = ({ orderIds, shippingAddress }) =>
  api.post(`${BASE}/checkout`, { orderIds, shippingAddress });

export const getPayment = (id) => api.get(`${BASE}/${id}`);

// The Stripe return URL carries the session id.
export const getPaymentBySession = (session) =>
  api.get(`${BASE}/by-session/${session}`);

export const listPayments = ({ page = 1, limit = 10 } = {}) =>
  api.get(BASE, { params: { page, limit } });
