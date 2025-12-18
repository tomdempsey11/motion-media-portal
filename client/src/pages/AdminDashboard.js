import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function AdminDashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        // Ensure logged in + admin
        const meRes = await fetch("http://localhost:5001/api/auth/me", {
          credentials: "include",
        });

        if (meRes.status === 401) {
          navigate("/login");
          return;
        }

        const meData = await meRes.json();
        if (meData?.user?.role !== "admin") {
          navigate("/dashboard");
          return;
        }

        // Load all requests
        const res = await fetch("http://localhost:5001/api/admin/requests", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to load admin requests");

        const data = await res.json();
        setRequests(data.requests || []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [navigate]);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(
        `http://localhost:5001/api/admin/requests/${id}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to update status");

      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString();
  };

  const getUserName = (userId) => {
    if (userId && typeof userId === "object") {
      const fullName =
        userId.name ||
        [userId.firstName, userId.lastName].filter(Boolean).join(" ");
      return fullName || "Unnamed User";
    }
    return String(userId || "").slice(-6).toUpperCase() || "—";
  };

  const getUserEmail = (userId) => {
    if (userId && typeof userId === "object") {
      return userId.email || "";
    }
    return "";
  };

  return (
    <section className="portal">
      <Sidebar />

      <div className="portal__content">
        <h1>Admin Dashboard</h1>
        <p className="portal__subtitle">Manage all client requests</p>

        {loading && <p>Loading…</p>}
        {error && <p style={{ marginTop: 12 }}>{error}</p>}

        {!loading && !error && (
          <table className="requests-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>User</th>
                <th>Package</th>
                <th>Event Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="6">No requests found.</td>
                </tr>
              ) : (
                requests.map((r) => (
                  <tr key={r._id}>
                    <td>{r.title}</td>

                    <td>
                      <div className="user-cell">
                        <div className="user-name">{getUserName(r.userId)}</div>
                        {getUserEmail(r.userId) && (
                          <div className="user-email">{getUserEmail(r.userId)}</div>
                        )}
                      </div>
                    </td>

                    <td>{r.serviceType || "—"}</td>
                    <td>{formatDate(r.dueDate)}</td>

                    <td>
                        <select
                        className={`status-select status-${r.status
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        value={r.status}
                        onChange={(e) => updateStatus(r._id, e.target.value)}
                        >

                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>

                    <td>
                      <Link className="btn btn-outline" to={`/requests/${r._id}`}>
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

export default AdminDashboard;
