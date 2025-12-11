import React from "react";
import Sidebar from "../components/Sidebar";

function Profile() {
  return (
    <section className="portal">
      <Sidebar />

      <div className="portal__content">
        <h1>Profile</h1>
        <p className="portal__subtitle">
          Update your contact details so we know where to send your videos.
        </p>

        <form className="profile-form">
          <label>
            Name
            <input type="text" placeholder="Full name" />
          </label>

          <label>
            Email
            <input type="email" placeholder="you@example.com" />
          </label>

          <label>
            Phone
            <input type="tel" placeholder="Optional" />
          </label>

          <button type="submit" className="btn btn-primary profile-form__submit">
            Save Changes
          </button>
        </form>
      </div>
    </section>
  );
}

export default Profile;
