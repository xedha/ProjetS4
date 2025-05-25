import React, { useState } from "react";
import styles from "./table2.module.css"
import { useTranslation } from 'react-i18next';

const Mangetable = () => {
  const { t } = useTranslation();
  const [maxSupervisors, setMaxSupervisors] = useState(3);
  const [autoAssign, setAutoAssign] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
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
          <th style={cellStyle}>{t('settings.settingName')}</th>
          <th style={cellStyle}>{t('settings.value')}</th>
          <th style={cellStyle}>{t('settings.description')}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={cellStyle}>{t('settings.maxSupervisorsPerMonitoring')}</td>
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
          <td style={cellStyle}>{t('settings.maxSupervisorsPerMonitoringDesc')}</td>
        </tr>

        <tr>
          <td style={cellStyle}>{t('settings.autoAssign')}</td>
          <td style={cellStyle}>
            <button className={styles.semster}
              onClick={() => setAutoAssign(!autoAssign)}
              style={toggleStyle(autoAssign)}
            >
              {autoAssign ? t('settings.enabled') : t('settings.disabled')}
            </button>
          </td>
          <td style={cellStyle}>{t('settings.autoAssignDesc')}</td>
        </tr>

        <tr>
          <td style={cellStyle}>{t('settings.emailNotifications')}</td>
          <td style={cellStyle}>
            <button className={styles.semster}
              onClick={() => setEmailNotifications(!emailNotifications)}
              style={toggleStyle(emailNotifications)}
            >
              {emailNotifications ? t('settings.enabled') : t('settings.disabled')}
            </button>
          </td>
          <td style={cellStyle}>{t('settings.emailNotificationsDesc')}</td>
        </tr>

        <tr>
          <td style={cellStyle}>{t('settings.defaultExamDuration')}</td>
          <td style={cellStyle}>
            <input className={styles.semster}
              type="text"
              value={examDuration}
              onChange={(e) => setExamDuration(e.target.value)}
              placeholder={t('settings.examDurationPlaceholder')}
            />
          </td>
          <td style={cellStyle}>{t('settings.defaultExamDurationDesc')}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default Mangetable;
