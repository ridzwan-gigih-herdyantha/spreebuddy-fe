import api from "./axios";

const BASE = "/api/v1/sessions";

export const listSessions = () => api.get(BASE);

export const createSession = (title) => api.post(BASE, title ? { title } : {});

export const getSession = (id) => api.get(`${BASE}/${id}`);

export const deleteSession = (id) => api.delete(`${BASE}/${id}`);

export const sendMessage = ({ id, message }) =>
  api.post(`${BASE}/${id}/messages`, { message });
