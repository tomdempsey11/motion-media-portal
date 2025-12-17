import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const loadMe = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/auth/me", {
        credentials: "include",
      });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      setUser(null);
    }
  };

  // ✅ Refresh user state when navigation happens (login/logout/redirects)
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

      await fetch("http://localhost:5001/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

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
        {user?.role === "admin" && (
          <span className="navbar__badge">ADMIN</span>
        )}
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
