import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import api from "../api";

const STATUS_OPTIONS = ["Pending", "In Progress", "Delivered"];

function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, authLoading } = useAuth();

  const [request, setRequest] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusDraft, setStatusDraft] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    if (authLoading) return;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const path = isAdmin ? `/admin/requests/${id}` : `/requests/${id}`;
        const res = await api.get(path);

        const req = res.data?.request || res.data;
        setRequest(req);
        setStatusDraft(req?.status || "");
      } catch (err) {
        if (err?.response?.status === 401) {
          navigate("/login");
          return;
        }
        setError(err?.response?.data?.message || err.message || "Failed to load request");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, navigate, isAdmin, authLoading]);

  const handleSaveStatus = async () => {
    if (!request?._id) return;

    try {
      setSavingStatus(true);
      setStatusError("");

      const path = isAdmin
        ? `/admin/requests/${request._id}/status`
        : `/requests/${request._id}/status`;

      const res = await api.patch(path, { status: statusDraft });

      const updated = res.data?.request || res.data?.updatedRequest || res.data;
      setRequest(updated);
      setStatusDraft(updated?.status || statusDraft);
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate("/login");
        return;
      }
      setStatusError(err?.response?.data?.message || err.message || "Could not update status");
    } finally {
      setSavingStatus(false);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString();
  };

  const statusSlug = (s) =>
    String(s || "")
      .toLowerCase()
      .replaceAll("_", "-")
      .replace(/\s+/g, "-");

  if (authLoading) {
    return (
      <section className="portal">
        <Sidebar />
        <div className="portal__content">
          <p style={{ marginTop: 12 }}>Loading…</p>
        </div>
      </section>
    );
  }

  return (
    <section className="portal">
      <Sidebar />

      <div className="portal__content">
        <button
          className="btn btn-outline"
          type="button"
          onClick={() => navigate(isAdmin ? "/admin" : "/dashboard")}
        >
          ← Back
        </button>

        {loading && <p style={{ marginTop: 12 }}>Loading…</p>}
        {error && <p style={{ marginTop: 12 }}>{error}</p>}

        {!loading && !error && request && (
          <div style={{ marginTop: 16 }}>
            <h1>{request.title}</h1>
            <p className="portal__subtitle">Request ID: {request._id}</p>

            <div style={{ marginTop: 16 }}>
              <p>
                <strong>Status:</strong>{" "}
                {isAdmin ? (
                  <>
                    <select
                      value={statusDraft}
                      onChange={(e) => setStatusDraft(e.target.value)}
                      disabled={savingStatus}
                      style={{ marginLeft: 8 }}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>

                    <button
                      className="btn"
                      type="button"
                      onClick={handleSaveStatus}
                      disabled={savingStatus || statusDraft === request.status}
                      style={{ marginLeft: 10 }}
                    >
                      {savingStatus ? "Saving..." : "Save"}
                    </button>

                    {statusError && <span style={{ marginLeft: 10 }}>{statusError}</span>}
                  </>
                ) : (
                  <span
                    className={`status-badge status-${statusSlug(request.status)}`}
                    style={{ marginLeft: 8 }}
                  >
                    {request.status}
                  </span>
                )}
              </p>

              <p>
                <strong>Package:</strong> {request.serviceType || "—"}
              </p>

              <p>
                <strong>Event Date:</strong> {formatDate(request.dueDate)}
              </p>

              <p style={{ whiteSpace: "pre-wrap" }}>
                <strong>Details:</strong>
                {"\n"}
                {request.details}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default RequestDetails;
