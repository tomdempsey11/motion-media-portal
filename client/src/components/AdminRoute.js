import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/auth/me", {
          credentials: "include",
        });

        if (!res.ok) {
          setIsAdmin(false);
          return;
        }

        const data = await res.json();
        setIsAdmin(data?.user?.role === "admin");
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
