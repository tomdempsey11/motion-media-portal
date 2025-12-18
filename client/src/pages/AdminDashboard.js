import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../api";

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
        const meRes = await api.get("/auth/me");

        if (meRes?.data?.user?.role !== "admin") {
          navigate("/dashboard");
          return;
        }

        // Load all requests
        const res = await api.get("/admin/requests");
        setRequests(res.data?.requests || []);
      } catch (err) {
        const status = err?.response?.status;

        if (status === 401) {
          navigate("/login");
          return;
        }

        setError(err?.response?.data?.message || err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [navigate]);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/requests/${id}/status`, { status });

      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r))
      );
    } catch (err) {
      alert(err?.response?.data?.message || err.message || "Failed to update status");
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

  const statusClass = (s) =>
    String(s || "Pending")
      .toLowerCase()
      .replace(/\s+/g, "-");

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
                        className={`status-select status-${statusClass(r.status)}`}
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
