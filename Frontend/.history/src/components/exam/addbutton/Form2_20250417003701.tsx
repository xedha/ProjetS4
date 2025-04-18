import styles from './Form2.module.css';
import { useState } from 'react';

interface FormProps {
  setShowPopup: (show: boolean) => void;
}

function Form2({ setShowPopup }: FormProps) {
  const [year, setYear] = useState<string>('');
  const [formation, setFormation] = useState<string>('');
  const [section, setSection] = useState<string>('');
  const [period, setPeriod] = useState<string>('');
  const [professors, setProfessors] = useState<string[]>([]);
  const [modules, setModules] = useState<string[]>([]);

  // Handle the generation of the exam schedule
  const generateSchedule = () => {
    // Logic to generate schedule based on selected values
    console.log("Generating schedule for:", { year, formation, section, period });
    // Fetch professors and modules based on section and other inputs
    setProfessors(["Prof. A", "Prof. B", "Prof. C"]); // Example professors
    setModules(["Module 1", "Module 2", "Module 3"]); // Example modules
  };

  return (
    <>
      {/* Overlay for the blur effect */}
      <div className={styles.blurOverlay}></div>

      {/* Registration form container */}
      <div className={styles.container}>
        {/* Close Button */}
        <button className={styles.close} onClick={() => setShowPopup(false)}>
          <svg className={styles.svg} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z"
              fill="currentColor"
            />
          </svg>
        </button>

        {/* Title section */}
        <div className={styles.title}>Generate Exam Schedule</div>
        
        <div className={styles.content}>
          {/* Schedule form */}
          <form action="#">
            <div className={styles.userDetails}>
              {/* Academic Year Dropdown */}
              <div className={styles.inputBox}>
                <span className={styles.details}>Academic Year</span>
                <!-- From Uiverse.io by pathikcomp --> 
<label className="main">
  Menu
  <input class="inp" checked="" type="checkbox" />
  <div classname="bar">
    <span class="top bar-list"></span>
    <span class="middle bar-list"></span>
    <span class="bottom bar-list"></span>
  </div>
  <section class="menu-container">
    <div class="menu-list">Food</div>
    <div class="menu-list">Entertainment</div>
    <div class="menu-list">Blog</div>
    <div class="menu-list">Location</div>
  </section>
</label>

              </div>

              {/* Formation */}
              <div className={styles.inputBox}>
                <span className={styles.details}>Formation</span>
                <input
                  type="text"
                  placeholder="Enter Formation"
                  value={formation}
                  onChange={(e) => setFormation(e.target.value)}
                  required
                />
              </div>

              {/* Section */}
              <div className={styles.inputBox}>
                <span className={styles.details}>Section</span>
                <input
                  type="text"
                  placeholder="Enter Section"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  required
                />
              </div>

              {/* Period */}
              <div className={styles.inputBox}>
                <span className={styles.details}>Period</span>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  required
                >
                  <option value="">Select Period</option>
                  <option value="S1">S1</option>
                  <option value="S2">S2</option>
                  <option value="Resit">Resit</option>
                </select>
              </div>

              {/* Professors List */}
              <div className={styles.inputBox}>
                <span className={styles.details}>Professors</span>
                <select disabled>
                  {professors.map((professor, index) => (
                    <option key={index} value={professor}>
                      {professor}
                    </option>
                  ))}
                </select>
              </div>

              {/* Modules List */}
              <div className={styles.inputBox}>
                <span className={styles.details}>Modules</span>
                <select disabled>
                  {modules.map((module, index) => (
                    <option key={index} value={module}>
                      {module}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Generate button */}
            <div className={styles.button}>
              <input type="button" value="Generate Schedule" onClick={generateSchedule} />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Form2;
