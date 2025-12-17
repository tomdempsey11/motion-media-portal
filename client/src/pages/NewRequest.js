import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function NewRequest() {
  const navigate = useNavigate();

  const [serviceType, setServiceType] = useState("");
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // minimal validation
    if (!serviceType || !title || !dueDate) {
      setError("Please select a package, enter an event name, and choose a date.");
      return;
    }

    // Combine fields into the backend's "details"
    const fullDetails = [
      `Event: ${title}`,
      `Location: ${location || "—"}`,
      `Extra Info: ${details || "—"}`,
    ].join("\n");

    try {
      setSubmitting(true);

      const res = await fetch("http://localhost:5001/api/requests", {
        method: "POST",
        credentials: "include", // ✅ session cookie
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,              // required by backend
          details: fullDetails, // required by backend
          serviceType,        // optional
          dueDate,            // optional (ISO string from <input type="date"> works)
        }),
      });

      if (res.status === 401) {
        navigate("/login");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Failed to submit request");
        return;
      }

      // success → back to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="portal">
      <Sidebar />

      <div className="portal__content">
        <h1>New Request Form</h1>
        <p className="portal__subtitle">
          Share the details of your event so we can create the perfect reel.
        </p>

        {error && <p style={{ marginTop: 12 }}>{error}</p>}

        <form className="request-form" onSubmit={handleSubmit}>
          <label>
            Package Type
            <select value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
              <option value="">Select a package</option>
              <option value="Single Match Highlight">Single Match Highlight</option>
              <option value="Day Pass / Tournament">Day Pass / Tournament</option>
              <option value="Team Package">Team Package</option>
            </select>
          </label>

          <label>
            Event Name / Match Number(s)
            <input
              type="text"
              placeholder="e.g. Apex vs 626 – Court 12"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <label>
            Event Date
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </label>

          <label>
            Event Location
            <input
              type="text"
              placeholder="Venue / City"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </label>

          <label>
            Extra Info
            <textarea
              rows="4"
              placeholder="Any specific players, moments, or angles you want captured?"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </label>

          <button
            type="submit"
            className="btn btn-primary request-form__submit"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default NewRequest;
