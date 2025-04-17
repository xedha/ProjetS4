import styles from './Form2.module.css';
import { useState } from 'react';
import Select from 'react-select';

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

  const [level, setLevel] = useState('');
  const [specialty, setSpecialty] = useState('');

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [examRoom, setExamRoom] = useState('');
  const [moduleName, setModuleName] = useState('');
  const [moduleAbbreviation, setModuleAbbreviation] = useState('');
  const [supervisor, setSupervisor] = useState('');
  const [order, setOrder] = useState('');
  const [nbrSE, setNbrSE] = useState<number>(0);
  const [nbrSS, setNbrSS] = useState<number>(0);
  const [emails, setEmails] = useState<string[]>([]);
  const [supervisorEmail, setSupervisorEmail] = useState<string>('');

  const handleEmailChange = (index: number, value: string) => {
    const updatedEmails = [...emails];
    updatedEmails[index] = value;
    setEmails(updatedEmails);
  };

  const generateSchedule = () => {
    console.log("Generating schedule for:", { year, formation, section, period });
    setProfessors(["Prof. A", "Prof. B", "Prof. C"]);
    setModules(["Module 1", "Module 2", "Module 3"]);
  };

  return (
    <>
      <div className={styles.blurOverlay}></div>
      <div className={styles.container}>
        <button className={styles.close} onClick={() => setShowPopup(false)}>
          <svg className={styles.svg} width="24" height="24" viewBox="0 0 24 24" fill="none"
               xmlns="http://www.w3.org/2000/svg">
            <path d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z" fill="currentColor"/>
          </svg>
        </button>

        <div className={styles.title}>Generate Exam Schedule</div>

        <div className={styles.content}>
          <form action="#"> </form>
            <div className={styles.userDetails}>
              {[ 
                {/* Academic Year - regular select */}
                <div className={styles.inputBox}>
                  <span className={styles.details}>Academic Year</span>
                  <select value={year} onChange={(e) => setYear(e.target.value)} required>
                    <option value="" disabled>Select Year</option>
                    <option value="Year 1">Year 1</option>
                    <option value="Year 2">Year 2</option>
                    <option value="Year 3">Year 3</option>
                    <option value="Year 4">Year 4</option>
                    <option value="Year 5">Year 5</option>
                  </select>
                </div>,
                {/* Formation */}
                ['Formation', formation, (e: any) => setFormation(e.target.value), 'text', ['CS', 'AI', 'SE']],
                {/* Section */}
                ['Section', section, (e: any) => setSection(e.target.value), 'text', ['A', 'B', 'C']],
                {/* Period - regular select */}
                <div className={styles.inputBox}>
                  <span className={styles.details}>Period</span>
                  <select value={period} onChange={(e) => setPeriod(e.target.value)} required>
                    <option value="" disabled>Select Period</option>
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                    <option value="Resit">Resit</option>
                    <option value="Rattrapage S1">Rattrapage S1</option>
                    <option value="Rattrapage S2">Rattrapage S2</option>
                  </select>
                </div>,
                {/* Other fields */}
                ['Level', level, (e: any) => setLevel(e.target.value)],
                ['Specialty', specialty, (e: any) => setSpecialty(e.target.value)],
                ['Date', date, (e: any) => setDate(e.target.value), 'date'],
                ['Time', time, (e: any) => setTime(e.target.value), 'time'],
                ['Exam Room', examRoom, (e: any) => setExamRoom(e.target.value)],
                ['Module Name', moduleName, (e: any) => setModuleName(e.target.value)],
                ['Module Abbreviation', moduleAbbreviation, (e: any) => setModuleAbbreviation(e.target.value)],
                ['Supervisor', supervisor, (e: any) => setSupervisor(e.target.value)],
                ['Order', order, (e: any) => setOrder(e.target.value)],
                ['NbrSE', nbrSE.toString(), (e: any) => setNbrSE(Number(e.target.value))],
                ['NbrSS', nbrSS.toString(), (e: any) => setNbrSS(Number(e.target.value))]
              ].map(([label, value, setter, type = 'text', options = []]: any, i) => (
                <div className={styles.inputBox} key={i}>
                  <span className={styles.details}>{label}</span>
                  {options.length > 0 ? (
                    <>
                      <input
                        type="text"
                        list={`options-${i}`}
                        value={value}
                        onChange={setter}
                        placeholder={`Enter ${label}`}
                        required
                      />
                      <datalist id={`options-${i}`}>
                        {options.map((opt: string, j: number) => (
                          <option key={j} value={opt} />
                        ))}
                      </datalist>
                    </>
                  ) : (
                    <input type={type} value={value} onChange={setter} required />
                  )}
                </div>
              ))}

              {/* Supervisor Email */}
              <div className={styles.inputBox}>
                <span className={styles.details}>Supervisor Email</span>
                <input
                  type="email"
                  value={supervisorEmail}
                  onChange={(e) => setSupervisorEmail(e.target.value)}
                  required
                />
              </div>

              {/* Dynamic Email Fields */}
              {Array.from({ length: nbrSS - 1 }).map((_, i) => (
                <div className={styles.inputBox} key={`email-${i}`}>
                  <span className={styles.details}>Email #{i + 1}</span>
                  <input
                    type="email"
                    value={emails[i] || ''}
                    onChange={(e) => handleEmailChange(i, e.target.value)}
                    required
                  />
                </div>
              ))}

              {/* Professors */}
              <div className={styles.inputBox}>
                <span className={styles.details}>Professors</span>
                <select disabled>
                  {professors.map((p, i) => (
                    <option key={i}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Modules */}
              <div className={styles.inputBox}>
                <span className={styles.details}>Modules</span>
                <select disabled>
                  {modules.map((m, i) => (
                    <option key={i}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

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
