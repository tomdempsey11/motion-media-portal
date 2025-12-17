import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const refreshUser = async () => {
    try {
      setAuthLoading(true);

      // ✅ uses axios baseURL + withCredentials automatically
      const res = await api.get("/auth/me");

      setUser(res.data.user);
    } catch (err) {
      // 401 or any error -> treat as logged out
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      authLoading,
      refreshUser,
      isAdmin: user?.role === "admin",
      isLoggedIn: !!user,
    }),
    [user, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
