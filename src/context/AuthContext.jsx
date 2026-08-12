import { useCallback, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe } from "@/api/auth";
import { setAuthToken } from "@/api/axios";
import { AuthContext } from "./authStore";

const TOKEN_KEY = "token";

export default function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  const { data, isPending } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: Boolean(token),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const login = useCallback((value) => {
    localStorage.setItem(TOKEN_KEY, value);
    setAuthToken(value);
    setToken(value);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setAuthToken(null);
    setToken(null);
    queryClient.clear();
  }, [queryClient]);

  const value = useMemo(
    () => ({
      user: data?.data ?? null,
      isLoading: Boolean(token) && isPending,
      login,
      logout,
    }),
    [data, token, isPending, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
