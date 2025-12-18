import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, authLoading, refreshUser, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  // ✅ On first mount, ensure navbar has correct user (covers hard refresh)
  useEffect(() => {
    // AuthProvider already calls refreshUser() on mount,
    // but calling it here is harmless and helps in edge cases.
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dashboardPath =
    !user ? "/login" : user.role === "admin" ? "/admin" : "/dashboard";

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout(); // ✅ calls /auth/logout + clears user
      navigate("/login");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar__logo" onClick={() => navigate("/")}>
        Motion<span>Media</span>
        {user?.role === "admin" && <span className="navbar__badge">ADMIN</span>}
      </div>

      <nav className="navbar__nav">
        <NavLink to="/" end>
          Home
        </NavLink>

        <NavLink to={dashboardPath}>Dashboard</NavLink>

        {authLoading ? null : !user ? (
          <>
            <NavLink to="/login">Client Login</NavLink>
            <NavLink to="/signup">Create Account</NavLink>
          </>
        ) : (
          <button
            type="button"
            className="navbar__logout-btn"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        )}

        <button className="navbar__contact-btn" type="button">
          Contact
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
