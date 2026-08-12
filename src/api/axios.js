import axios from "axios";

const TOKEN_KEY = "token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

setAuthToken(localStorage.getItem(TOKEN_KEY));

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const body = err.response?.data;
    return Promise.reject({
      status: err.response?.status ?? 0,
      code: body?.error?.code,
      url: err.config?.url,
      message: body?.message ?? "Something went wrong. Please try again.",
      fieldErrors: body?.error?.details ?? [],
    });
  },
);

export default api;
