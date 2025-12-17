import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
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
      await api.post("/api/auth/login", form);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Client Login</h1>
        <p className="auth-page__subtitle">
          Log in to view your projects, submit new requests, and track delivery.
        </p>

        {error && (
          <p style={{ color: "crimson", marginBottom: "1rem" }}>
            {error}
          </p>
        )}

        <form className="auth-form" onSubmit={onSubmit}>
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
              placeholder="••••••••"
              value={form.password}
              onChange={onChange}
            />
          </label>

          <button type="submit" className="btn btn-primary auth-form__submit">
            Log In
          </button>
        </form>

        <p className="auth-page__footer">
          Don&apos;t have an account?{" "}
          <Link to="/signup">Create one here</Link>.
        </p>
      </div>
    </section>
  );
}

export default Login;
