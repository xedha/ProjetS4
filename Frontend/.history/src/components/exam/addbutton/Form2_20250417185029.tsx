import styles from './Form2.module.css';
import { useState } from 'react';
import Select from 'react-select';

interface FormProps {
  setShowPopup: (show: boolean) => void;
}

const yearOptions = ["1", "2", "3", "4", "5"].map((y) => ({ value: y, label: `Year ${y}` }));
const periodOptions = ["S1", "S2", "Resit"].map((p) => ({ value: p, label: p }));

const Form2 = ({ setShowPopup }: FormProps) => {
  const [year, setYear] = useState<string>('');
  const [formation, setFormation] = useState<string>('');
  const [section, setSection] = useState<string>('');
  const [period, setPeriod] = useState<string>('');
  const [level, setLevel] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [nbrSE, setNbrSE] = useState<number>(0);
  const [nbrSS, setNbrSS] = useState<number>(0);
  const [examRoom, setExamRoom] = useState('');
  const [moduleName, setModuleName] = useState('');
  const [moduleAbbreviation, setModuleAbbreviation] = useState('');
  const [supervisor, setSupervisor] = useState('');
  const [order, setOrder] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const [supervisorEmail, setSupervisorEmail] = useState('');
  const [professors, setProfessors] = useState<string[]>([]);
  const [modules, setModules] = useState<string[]>([]);

  const handleEmailChange = (index: number, value: string) => {
    const updatedEmails = [...emails];
    updatedEmails[index] = value;
    setEmails(updatedEmails);
  };

  const handleCustomSelectChange = (setter: (val: string) => void) => (option: any) => {
    setter(option?.value || '');
  };

  const handleCustomInput = (setter: (val: string) => void) => (inputValue: string) => {
    setter(inputValue);
  };

  const toOption = (value: string) => (value ? [{ label: value, value }] : []);

  const generateSchedule = () => {
    console.log("Generating schedule for:", { year, formation, section, period });
    setProfessors(["Prof. A", "Prof. B", "Prof. C"]);
    setModules(["Module 1", "Module 2", "Module 3"]);
  };

  return (
    <>
      <div className={styles.blurOverlay}></div>
      <div className={styles.container}>
        <button className={styles.close} onClick={() => setShowPopup(false)}>X</button>

        <div className={styles.title}>Generate Exam Schedule</div>

        <div className={styles.content}>
          <form action="#">
            <div className={styles.userDetails}>

              <div className={styles.inputBox}>
                <span className={styles.details}>Academic Year</span>
                <Select
                  options={yearOptions}
                  onChange={(o) => setYear(o?.value || '')}
                  value={year ? { label: `Year ${year}`, value: year } : null}
                  isClearable
                  isSearchable
                  placeholder="Select or type..."
                  menuPlacement="top"
                />
              </div>

              {[['Formation', formation, setFormation],
                ['Section', section, setSection],
                ['Level', level, setLevel],
                ['Specialty', specialty, setSpecialty]]
                .map(([label, value, setter]: [string, string, (val: string) => void], i) => (
                  <div className={styles.inputBox} key={i}>
                    <span className={styles.details}>{label}</span>
                    <Select
                      options={toOption(value)}
                      onInputChange={handleCustomInput(setter)}
                      onChange={handleCustomSelectChange(setter)}
                      value={value ? { label: value, value } : null}
                      isClearable
                      isSearchable
                      placeholder="Type to enter..."
                      menuPlacement="top"
                    />
                  </div>
              ))}

              <div className={styles.inputBox}>
                <span className={styles.details}>Period</span>
                <Select
                  options={periodOptions}
                  onChange={(o) => setPeriod(o?.value || '')}
                  value={period ? { label: period, value: period } : null}
                  isClearable
                  isSearchable
                  placeholder="Select or type..."
                  menuPlacement="top"
                />
              </div>

              {[['Date', date, setDate], ['Time', time, setTime]].map(([label, value, setter], i) => (
                <div className={styles.inputBox} key={i}>
                  <span className={styles.details}>{label}</span>
                  <input type={label.toLowerCase()} value={value} onChange={(e) => setter(e.target.value)} required />
                </div>
              ))}

              {[['NbrSE', nbrSE, setNbrSE], ['NbrSS', nbrSS, setNbrSS]].map(([label, value, setter], i) => (
                <div className={styles.inputBox} key={i}>
                  <span className={styles.details}>{label}</span>
                  <input type="number" value={value} onChange={(e) => setter(Number(e.target.value))} required />
                </div>
              ))}

              {[['Exam Room', examRoom, setExamRoom],
                ['Module Name', moduleName, setModuleName],
                ['Module Abbreviation', moduleAbbreviation, setModuleAbbreviation],
                ['Supervisor', supervisor, setSupervisor],
                ['Order', order, setOrder]]
                .map(([label, value, setter], i) => (
                  <div className={styles.inputBox} key={i}>
                    <span className={styles.details}>{label}</span>
                    <input type="text" value={value} onChange={(e) => setter(e.target.value)} required />
                  </div>
              ))}

              <div className={styles.inputBox}>
                <span className={styles.details}>Supervisor Email</span>
                <input
                  type="email"
                  value={supervisorEmail}
                  onChange={(e) => setSupervisorEmail(e.target.value)}
                  required
                />
              </div>

              {Array.from({ length: nbrSS - 1 }).map((_, i) => (
                <div className={styles.inputBox} key={i}>
                  <span className={styles.details}>Email #{i + 1}</span>
                  <input
                    type="email"
                    value={emails[i] || ''}
                    onChange={(e) => handleEmailChange(i, e.target.value)}
                    required
                  />
                </div>
              ))}

              <div className={styles.inputBox}>
                <span className={styles.details}>Professors</span>
                <select disabled>{professors.map((p, i) => <option key={i}>{p}</option>)}</select>
              </div>

              <div className={styles.inputBox}>
                <span className={styles.details}>Modules</span>
                <select disabled>{modules.map((m, i) => <option key={i}>{m}</option>)}</select>
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
};

export default Form2;
