import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import ConflictChecker from './ConflictChecker'; // Import the enhanced ConflictChecker
import styles from "./table2.module.css";

// Component that combines settings management with conflict checking
const SettingsWithConflictChecker = () => {
  const { t } = useTranslation();
  
  // Settings state
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
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Settings Configuration Table */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ 
          marginBottom: "20px", 
          fontSize: "24px", 
          fontWeight: "600", 
          color: "#1f2937",
          borderBottom: "2px solid #0B8FAC",
          paddingBottom: "8px"
        }}>
          📋 Exam Monitoring Settings
        </h2>
        
        <table className={styles.table} style={{ width: "100%", marginBottom: "20px" }}>
          <thead>
            <tr className={styles.head}>
              <th style={cellStyle}>{t('settings.settingName')}</th>
              <th style={cellStyle}>{t('settings.value')}</th>
              <th style={cellStyle}>{t('settings.description')}</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ backgroundColor: maxSupervisors > 2 ? "#f0f9ff" : "#fff7ed" }}>
              <td style={cellStyle}>
                <strong>{t('settings.maxSupervisorsPerMonitoring')}</strong>
                <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                  🎯 Used in conflict analysis
                </div>
              </td>
              <td style={cellStyle}>
                <select 
                  className={styles.selectBox}
                  value={maxSupervisors}
                  onChange={(e) => setMaxSupervisors(parseInt(e.target.value))}
                  style={{
                    border: "2px solid #0B8FAC",
                    boxShadow: "0 2px 4px rgba(11, 143, 172, 0.1)"
                  }}
                >
                  {[...Array(8)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i + 1 === 1 ? 'supervisor' : 'supervisors'}
                    </option>
                  ))}
                </select>
              </td>
              <td style={cellStyle}>
                {t('settings.maxSupervisorsPerMonitoringDesc')}
                <div style={{ 
                  fontSize: "12px", 
                  color: "#0B8FAC", 
                  marginTop: "4px",
                  fontWeight: "500"
                }}>
                  ⚡ This value will be used as the target in workload analysis
                </div>
              </td>
            </tr>

            <tr>
              <td style={cellStyle}>{t('settings.autoAssign')}</td>
              <td style={cellStyle}>
                <button 
                  className={styles.semster}
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
                <button 
                  className={styles.semster}
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
                <input 
                  className={styles.semster}
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
      </div>

      {/* Conflict Analysis Section */}
      <div>
        <h2 style={{ 
          marginBottom: "20px", 
          fontSize: "24px", 
          fontWeight: "600", 
          color: "#1f2937",
          borderBottom: "2px solid #F59E0B",
          paddingBottom: "8px"
        }}>
          🔍 Conflict Analysis & Workload Balance
        </h2>
        
        <div style={{
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          marginBottom: "20px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{
              background: "#0B8FAC",
              color: "white",
              padding: "8px",
              borderRadius: "8px",
              fontSize: "20px"
            }}>
              🎯
            </div>
            <div>
              <h3 style={{ margin: "0", fontSize: "18px", fontWeight: "600", color: "#1f2937" }}>
                Smart Analysis with Your Settings
              </h3>
              <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#64748b" }}>
                Analyzing workload balance using your configured maximum of <strong>{maxSupervisors} supervisors</strong> per monitoring session
              </p>
            </div>
          </div>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "20px"
          }}>
            <div style={{
              background: "white",
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>📅</div>
              <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>Check for</div>
              <div style={{ fontSize: "16px", fontWeight: "600", color: "#1f2937" }}>Date/Time Conflicts</div>
            </div>
            
            <div style={{
              background: "white",
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>👨‍🏫</div>
              <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>Detect</div>
              <div style={{ fontSize: "16px", fontWeight: "600", color: "#1f2937" }}>Teacher Conflicts</div>
            </div>
            
            <div style={{
              background: "white",
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>⚖️</div>
              <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>Balance</div>
              <div style={{ fontSize: "16px", fontWeight: "600", color: "#1f2937" }}>Workload Distribution</div>
            </div>
          </div>
          
          {/* Pass the maxSupervisors setting to ConflictChecker */}
          <ConflictChecker maxSupervisorsPerMonitoring={maxSupervisors} />
        </div>
      </div>

      {/* Settings Summary */}
      <div style={{
        background: "#f8fafc",
        padding: "20px",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        marginTop: "20px"
      }}>
        <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: "600", color: "#1f2937" }}>
          📊 Current Configuration Summary
        </h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "16px"
        }}>
          <div style={{ background: "white", padding: "16px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>Max Supervisors</div>
            <div style={{ fontSize: "20px", fontWeight: "700", color: "#0B8FAC" }}>{maxSupervisors}</div>
            <div style={{ fontSize: "12px", color: "#64748b" }}>per monitoring session</div>
          </div>
          
          <div style={{ background: "white", padding: "16px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>Auto Assignment</div>
            <div style={{ 
              fontSize: "16px", 
              fontWeight: "600", 
              color: autoAssign ? "#059669" : "#dc2626" 
            }}>
              {autoAssign ? "✅ Enabled" : "❌ Disabled"}
            </div>
          </div>
          
          <div style={{ background: "white", padding: "16px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>Email Notifications</div>
            <div style={{ 
              fontSize: "16px", 
              fontWeight: "600", 
              color: emailNotifications ? "#059669" : "#dc2626" 
            }}>
              {emailNotifications ? "✅ Enabled" : "❌ Disabled"}
            </div>
          </div>
          
          <div style={{ background: "white", padding: "16px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>Default Duration</div>
            <div style={{ fontSize: "16px", fontWeight: "600", color: "#1f2937" }}>{examDuration}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsWithConflictChecker;