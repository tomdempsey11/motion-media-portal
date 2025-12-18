import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../api"; // ✅ use shared axios instance

function Dashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRequests = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get("/requests"); // ✅ /api/requests via proxy
        setRequests(res.data?.requests || []);
      } catch (err) {
        if (err?.response?.status === 401) {
          navigate("/login");
          return;
        }
        setError(err?.response?.data?.message || err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, [navigate]);

  const formatDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString();
  };

  const statusSlug = (s) =>
    String(s || "Pending")
      .toLowerCase()
      .replaceAll("_", "-")
      .replace(/\s+/g, "-");

  return (
    <section className="portal">
      <Sidebar />

      <div className="portal__content">
        <div className="portal__content-header">
          <h1>My Video Requests</h1>
          <button
            className="btn btn-primary portal__new-btn"
            onClick={() => navigate("/requests/new")}
            type="button"
          >
            New Request +
          </button>
        </div>

        {loading && <p>Loading requests…</p>}
        {error && <p style={{ marginTop: 12 }}>{error}</p>}

        {!loading && !error && (
          <table className="requests-table">
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Package</th>
                <th>Event Date</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="5">No requests yet. Click “New Request +”.</td>
                </tr>
              ) : (
                requests.map((r) => (
                  <tr key={r._id}>
                    <td>{r._id.slice(-6).toUpperCase()}</td>
                    <td>{r.serviceType || "—"}</td>
                    <td>{formatDate(r.dueDate)}</td>

                    <td>
                      <span className={`status-badge status-${statusSlug(r.status || "Pending")}`}>
                        {r.status || "Pending"}
                      </span>
                    </td>

                    <td>
                      <button
                        className="btn btn-outline btn-sm"
                        type="button"
                        onClick={() => navigate(`/requests/${r._id}`)}
                      >
                        View Details
                      </button>
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

export default Dashboard;
