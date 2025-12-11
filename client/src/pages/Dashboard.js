import React from "react";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  return (
    <section className="portal">
      <Sidebar />

      <div className="portal__content">
        <div className="portal__content-header">
          <h1>My Video Requests</h1>
          <button className="btn btn-primary portal__new-btn">
            New Request +
          </button>
        </div>

        <table className="requests-table">
          <thead>
            <tr>
              <th>Project ID</th>
              <th>Package</th>
              <th>Event Date</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {/* Placeholder row until backend is wired */}
            <tr>
              <td>–</td>
              <td>–</td>
              <td>–</td>
              <td>–</td>
              <td>
                <button className="btn btn-outline btn-sm">
                  View Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Dashboard;
