import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api";

function AdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await api.get("/auth/me"); // ✅ no /api here
        setIsAdmin(res.data?.user?.role === "admin");
      } catch (err) {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  if (loading) return <p style={{ padding: 16 }}>Loading…</p>;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return children;
}

export default AdminRoute;
