import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
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
      message: body?.message ?? "Something went wrong. Please try again.",
      fieldErrors: body?.error?.details ?? [],
    });
  },
);

export default api;
