import api from "./axios";

export const loginUser = ({ identifier, password }) =>
  api.post("/api/v1/auth/login", { identifier, password });

export const registerUser = ({
  name,
  username,
  email,
  phone,
  password,
  avatar,
}) => {
  const fields = { name, username, email, phone, password };

  if (!avatar) return api.post("/api/v1/auth/register", fields);

  const form = new FormData();
  Object.entries(fields).forEach(([key, value]) => form.append(key, value));
  form.append("avatar", avatar);

  return api.post("/api/v1/auth/register", form);
};

export const getMe = () => api.get("/api/v1/auth/me");

export const logoutUser = () => api.post("/api/v1/auth/logout");
