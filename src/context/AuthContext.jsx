import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/api/auth";
import { AuthContext } from "./authStore";

export default function AuthProvider({ children }) {
  const hasToken = Boolean(localStorage.getItem("token"));

  const { data, isPending } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: hasToken,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const value = useMemo(
    () => ({ user: data?.data ?? null, isLoading: hasToken && isPending }),
    [data, hasToken, isPending],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
