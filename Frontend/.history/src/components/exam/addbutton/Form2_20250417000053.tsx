import React, { useState } from "react";
import "./ExamPlannerModal.css"; // your styles here

function ExamPlannerModal({ setShowModal }) {
  const [year, setYear] = useState("");
  const [formation, setFormation] = useState("");
  const [section, setSection] = useState("");
  const [period, setPeriod] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!year || !formation || !section || !period) {
      alert("Please fill all fields");
      return;
    }

    console.log("Selected:", { year, formation, section, period });

    // Continue to next view (like list of professors/modules) here
    // Example: setView("moduleAssignment")

    setShowModal(false); // close modal after submit if needed
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={() => setShowModal(false)}>X</button>
        <h2>Plan Exam</h2>

        <form onSubmit={handleSubmit}>
          <label>Academic Year:</label>
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">Select Year</option>
            <option value="1st">1st Year</option>
            <option value="2nd">2nd Year</option>
            <option value="3rd">3rd Year</option>
          </select>

          <label>Formation:</label>
          <input
            type="text"
            placeholder="Ex: CS, AI, etc."
            value={formation}
            onChange={(e) => setFormation(e.target.value)}
          />

          <label>Section:</label>
          <input
            type="text"
            placeholder="Ex: A, B, etc."
            value={section}
            onChange={(e) => setSection(e.target.value)}
          />

          <label>Period:</label>
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="">Select Period</option>
            <option value="S1">S1</option>
            <option value="S2">S2</option>
            <option value="Rattrapage">Rattrapage</option>
          </select>

          <button type="submit">Continue</button>
        </form>
      </div>
    </div>
  );
}

export default ExamPlannerModal;
