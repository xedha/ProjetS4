import type React from "react"
import { Header } from "../common/Header"
import { Sidebar } from "../common/Sidebar"
import "./DashboardPage.css"

export const DashboardPage: React.FC = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <Header title="Dashboard" />
        <main className="dashboard-content">
          <div className="dashboard-grid">
            {/* Status of Students Chart */}
            <div className="dashboard-card">
              <h3 className="card-title">Status of Students</h3>
              <div className="chart-container">
                <div className="chart-circle blue">
                  <div className="chart-value">75%</div>
                </div>
              </div>
            </div>

            {/* Attendance Chart */}
            <div className="dashboard-card">
              <h3 className="card-title">Attendance</h3>
              <div className="chart-container">
                <div className="chart-circle red">
                  <div className="chart-value">65%</div>
                </div>
              </div>
            </div>

            {/* Grades Chart */}
            <div className="dashboard-card">
              <h3 className="card-title">Grades</h3>
              <div className="chart-container">
                <div className="chart-circle teal">
                  <div className="chart-value">78%</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

