import api from "./axios";

// Public: no auth, returns 503 when a dependency is down.
export const getHealth = () => api.get("/api/v1/health");
