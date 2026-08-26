import api from "./axios";

export const listUsers = ({ page = 1, limit = 10, search } = {}) =>
  api.get("/api/v1/users", {
    params: { page, limit, ...(search ? { search } : {}) },
  });

export const getUser = (id) => api.get(`/api/v1/users/${id}`);

// Multipart only when an avatar file is attached; the API accepts plain JSON
// otherwise, and expects `address` as a JSON string in the multipart case.
export const updateUser = ({ id, avatar, ...fields }) => {
  if (!avatar) return api.patch(`/api/v1/users/${id}`, fields);

  const form = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    form.append(key, typeof value === "object" ? JSON.stringify(value) : value);
  });
  form.append("avatar", avatar);

  return api.patch(`/api/v1/users/${id}`, form);
};
