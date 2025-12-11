import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="portal__sidebar">
      <h2 className="portal__sidebar-title">Client Portal</h2>

      <nav className="portal__nav">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/requests/new">New Request</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
