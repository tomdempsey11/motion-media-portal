import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="navbar__logo" onClick={() => navigate("/")}>
        Motion<span>Media</span>
      </div>

      <nav className="navbar__nav">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>

        <NavLink to="/login">Client Login</NavLink>
        
        <NavLink to="/signup">Create Account</NavLink>
        <button className="navbar__contact-btn">Contact</button>
      </nav>
    </header>
  );
}

export default Navbar;
