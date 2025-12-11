import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <section className="home">
      <div className="home__hero">
        <div className="home__text">
          <p className="home__eyebrow">Client Portal</p>
          <h1>Manage Your Highlight Reels in One Place</h1>
          <p className="home__subtext">
            Log in to view your projects, submit new video requests, and track
            delivery status – all in one central hub.
          </p>

          <div className="home__buttons">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/login")}
            >
              Client Login
            </button>
            <button
              className="btn btn-outline"
              onClick={() => navigate("/signup")}
            >
              Create Account
            </button>
          </div>
        </div>

        <div className="home__image-placeholder">
          <div className="home__image-box">
            <p>Project Preview / Screenshot Placeholder</p>
          </div>
        </div>
      </div>

      <div className="home__features">
        <div className="feature-card">
          <h3>Submit Requests Online</h3>
          <p>
            Tell us exactly what you need for each match, event, or highlight
            package.
          </p>
        </div>
        <div className="feature-card">
          <h3>Track Project Status</h3>
          <p>See when your videos are pending, in progress, or delivered.</p>
        </div>
        <div className="feature-card">
          <h3>Access Deliverables</h3>
          <p>View links to finished reels and keep everything organized.</p>
        </div>
      </div>
    </section>
  );
}

export default Home;
