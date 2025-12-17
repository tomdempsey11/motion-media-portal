import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { user, isAdmin, authLoading } = useAuth();

  return (
    <aside className="portal__sidebar">
      <h2 className="portal__sidebar-title">
        {authLoading ? "Loading..." : isAdmin ? "Admin Portal" : "Client Portal"}
      </h2>

      {/* TEMP DEBUG */}
      <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 10 }}>
        user.role: <b>{user?.role ?? "null"}</b> | isAdmin: <b>{String(isAdmin)}</b>
      </div>

      <nav className="portal__nav">
        {isAdmin ? (
          <>
            <NavLink to="/admin">Admin Dashboard</NavLink>
            <NavLink to="/profile">Profile</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/requests/new">New Request</NavLink>
            <NavLink to="/profile">Profile</NavLink>
          </>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
