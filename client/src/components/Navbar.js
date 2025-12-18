import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import api from "../api"; // ✅ use the axios instance (baseURL + cookies)

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const loadMe = async () => {
    try {
      // api baseURL already includes /api, so DO NOT add /api here
      const res = await api.get("/auth/me");
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    }
  };

  // Refresh on route changes so navbar updates after login/logout
  useEffect(() => {
    loadMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const dashboardPath = !user
    ? "/login"
    : user.role === "admin"
    ? "/admin"
    : "/dashboard";

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await api.post("/auth/logout");
      setUser(null);
      navigate("/login");
    } catch (err) {
      setUser(null);
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

        {!user ? (
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

        <button className="navbar__contact-btn">Contact</button>
      </nav>
    </header>
  );
}

export default Navbar;
