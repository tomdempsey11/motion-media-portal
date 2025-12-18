import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const res = await api.get("/auth/me"); // baseURL already includes /api
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      setUser(null);
      return null;
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      authLoading,
      refreshUser,
      logout,
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
