import React from "react";
import { Link } from "react-router-dom";

function Signup() {
  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p className="auth-page__subtitle">
          Set up your client portal so you can easily manage all your projects.
        </p>

        <form className="auth-form">
          <label>
            Name
            <input type="text" placeholder="Full name" />
          </label>

          <label>
            Email
            <input type="email" placeholder="you@example.com" />
          </label>

          <label>
            Password
            <input type="password" placeholder="Create a password" />
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
