import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const onChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/api/auth/signup", form);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Signup failed");
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p className="auth-page__subtitle">
          Set up your client portal so you can easily manage all your projects.
        </p>

        {error && (
          <p style={{ color: "crimson", marginBottom: "1rem" }}>
            {error}
          </p>
        )}

        <form className="auth-form" onSubmit={onSubmit}>
          <label>
            Name
            <input
              type="text"
              name="name"
              placeholder="Full name"
              value={form.name}
              onChange={onChange}
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={onChange}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={form.password}
              onChange={onChange}
            />
          </label>

          <button type="submit" className="btn btn-primary auth-form__submit">
            Create Account
          </button>
        </form>

        <p className="auth-page__fine-print">
          By creating an account, you agree to our Terms of Service and Privacy
          Policy.
        </p>

        <p className="auth-page__footer">
          Already have an account? <Link to="/login">Log in</Link>.
        </p>
      </div>
    </section>
  );
}

export default Signup;
