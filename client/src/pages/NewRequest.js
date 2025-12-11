import React from "react";
import Sidebar from "../components/Sidebar";

function NewRequest() {
  return (
    <section className="portal">
      <Sidebar />

      <div className="portal__content">
        <h1>New Request Form</h1>
        <p className="portal__subtitle">
          Share the details of your event so we can create the perfect reel.
        </p>

        <form className="request-form">
          <label>
            Package Type
            <select>
              <option value="">Select a package</option>
              <option value="single-match">Single Match Highlight</option>
              <option value="day-pass">Day Pass / Tournament</option>
              <option value="team-package">Team Package</option>
            </select>
          </label>

          <label>
            Event Name / Match Number(s)
            <input type="text" placeholder="e.g. Apex vs 626 – Court 12" />
          </label>

          <label>
            Event Date
            <input type="date" />
          </label>

          <label>
            Event Location
            <input type="text" placeholder="Venue / City" />
          </label>

          <label>
            Extra Info
            <textarea
              rows="4"
              placeholder="Any specific players, moments, or angles you want captured?"
            />
          </label>

          <button type="submit" className="btn btn-primary request-form__submit">
            Submit Request
          </button>
        </form>
      </div>
    </section>
  );
}

export default NewRequest;
