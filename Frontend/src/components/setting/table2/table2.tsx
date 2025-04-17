import React, { useState } from "react";
import styles from "./table2.module.css"
const Mangetable = () => {
  const [maxSupervisors, setMaxSupervisors] = useState(3);
  const [autoAssign, setAutoAssign] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [semesterStartDate, setSemesterStartDate] = useState("2025-08-01");
  const [examDuration, setExamDuration] = useState("2 hours");

  const toggleStyle = (enabled: boolean) => ({
    padding: "6px 12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: enabled ? "#c6f6d5" : "#fed7d7",
    color: enabled ? "#22543d" : "#742a2a",
    cursor: "pointer",
    fontWeight: "bold",
  });

  const cellStyle: React.CSSProperties = {
    border: "1px solid #ddd",
    padding: "12px",
    textAlign: "left",
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr className={styles.head}>
          <th style={cellStyle}>Setting Name</th>
          <th style={cellStyle}>Value</th>
          <th style={cellStyle}>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={cellStyle}>Max Supervisors per Exam</td>
          <td style={cellStyle}>
            <select className={styles.selectBox}
              value={maxSupervisors}
              onChange={(e) => setMaxSupervisors(parseInt(e.target.value))}
            >
              {[...Array(8)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </td>
          <td style={cellStyle}>Defines the maximum number of supervisors</td>
        </tr>

        <tr>
          <td style={cellStyle}>Auto-Assign Supervisions</td>
          <td style={cellStyle}>
            <button className={styles.semster}
              onClick={() => setAutoAssign(!autoAssign)}
              style={toggleStyle(autoAssign)}
            >
              {autoAssign ? "Enabled" : "Disabled"}
            </button>
          </td>
          <td style={cellStyle}>Automatically assigns available supervisors</td>
        </tr>

        <tr>
          <td style={cellStyle}>Email Notifications</td>
          <td style={cellStyle}>
            <button className={styles.semster}
              onClick={() => setEmailNotifications(!emailNotifications)}
              style={toggleStyle(emailNotifications)}
            >
              {emailNotifications ? "Enabled" : "Disabled"}
            </button>
          </td>
          <td style={cellStyle}>Sends email details for the new schedule</td>
        </tr>

        <tr>
          <td style={cellStyle}>Semester Start Date</td>
          <td style={cellStyle}>
            <input className={styles.selectBox}
              type="date"
              value={semesterStartDate}
              onChange={(e) => setSemesterStartDate(e.target.value)}
            />
          </td>
          <td style={cellStyle}>Official start date for the semester</td>
        </tr>

        <tr>
          <td style={cellStyle}>Default Exam Duration</td>
          <td style={cellStyle}>
            <input className={styles.semster}
              type="text"
              value={examDuration}
              onChange={(e) => setExamDuration(e.target.value)}
              placeholder="e.g. 2 hours"
            />
          </td>
          <td style={cellStyle}>Standard duration for all exams</td>
        </tr>
      </tbody>
    </table>
  );
};

export default Mangetable;
