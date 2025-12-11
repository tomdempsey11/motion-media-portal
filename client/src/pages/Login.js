import React from "react";
import { Link } from "react-router-dom";

function Login() {
  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Client Login</h1>
        <p className="auth-page__subtitle">
          Log in to view your projects, submit new requests, and track delivery.
        </p>

        <form className="auth-form">
          <label>
            Email
            <input type="email" placeholder="you@example.com" />
          </label>

          <label>
            Password
            <input type="password" placeholder="••••••••" />
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
