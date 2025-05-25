import React, { useState, useEffect } from 'react';
import { examApi } from '../../../services/ExamApi';
import styles from './ConflictChecker.module.css';

// Import the fixed types
interface WorkloadResponse {
  global_metrics: {
    total_charges_enseignement: number;
    total_plannings: number;
    total_surveillances: number;
    global_nbrss: number | 'N/A';
    status: 'NEED_MORE_SURVEILLANCES' | 'TOO_MANY_SURVEILLANCES' | 'BALANCED' | 'PERFECTLY_BALANCED';
    recommendation: string;
    target_surveillances?: number | null;
    surveillance_gap?: number | null;
  };
  teacher_distribution: {
    total_teachers: number;
    total_surveillances: number;
    average_per_teacher: number;
    below_target?: number;
    on_target?: number;
    above_target?: number;
    no_surveillance?: number;
    overloaded?: number;
    underutilized?: number;
    normal?: number;
  };
  teacher_analysis: Array<{
    teacher_info: {
      code: string;
      name: string;
      email: string;
      department: string;
    };
    statistics: {
      surveillance_count: number;
      courses_count: number;
      average_surveillances: number;
      target_surveillances?: number;
      deviation: number;
      deviation_percentage: number;
      status: string;
      severity: 'high' | 'medium' | 'low' | 'none';
    };
    recommendation: string;
  }>;
  message: string;
  error?: boolean;
  errorMessage?: string;
}

interface DateConflict {
  planning1_id: number;
  planning2_id: number;
  date_1: string;
  time_1: string;
  date_2: string;
  time_2: string;
}

interface ModuleConflict {
  Module: string;
  conflicts: DateConflict[];
}

interface TeacherConflict {
  code_enseignant: string;
  conflicts: {
    surveillance1_id: number;
    planning1_id: number;
    surveillance2_id: number;
    planning2_id: number;
    date: string;
    time: string;
  }[];
}

interface ConflictCheckerProps {
  maxSupervisorsPerMonitoring?: number;
}

function ConflictChecker({ maxSupervisorsPerMonitoring = 3 }: ConflictCheckerProps) {
  const [dateConflicts, setDateConflicts] = useState<ModuleConflict[]>([]);
  const [teacherConflicts, setTeacherConflicts] = useState<TeacherConflict[]>([]);
  const [workloadData, setWorkloadData] = useState<WorkloadResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'date' | 'teacher' | 'workload'>('date');
  const [showModal, setShowModal] = useState(false);
  const [targetSurveillances, setTargetSurveillances] = useState<number | undefined>(undefined);
  const [useMaxSupervisorsAsSetting, setUseMaxSupervisorsAsSetting] = useState(true);

  // Initialize target surveillances based on max supervisors setting
  useEffect(() => {
    if (useMaxSupervisorsAsSetting && maxSupervisorsPerMonitoring) {
      setTargetSurveillances(maxSupervisorsPerMonitoring);
    }
  }, [maxSupervisorsPerMonitoring, useMaxSupervisorsAsSetting]);

  const checkDateConflicts = async () => {
    console.log('🔥 checkDateConflicts - STARTING');
    try {
      setLoading(true);
      const response = await examApi.checkExamDate({});
      if (response.conflicts) {
        setDateConflicts(response.conflicts);
      } else {
        setDateConflicts([]);
      }
      console.log('✅ checkDateConflicts - COMPLETED');
    } catch (error) {
      console.error('❌ Error checking date conflicts:', error);
      alert('Failed to check date conflicts');
    } finally {
      setLoading(false);
    }
  };

  const checkTeacherConflicts = async () => {
    console.log('🔥 checkTeacherConflicts - STARTING');
    try {
      setLoading(true);
      const response = await examApi.checkEnseignantScheduleConflict({});
      if (response.conflicts) {
        setTeacherConflicts(response.conflicts);
      } else {
        setTeacherConflicts([]);
      }
      console.log('✅ checkTeacherConflicts - COMPLETED');
    } catch (error) {
      console.error('❌ Error checking teacher conflicts:', error);
      alert('Failed to check teacher conflicts');
    } finally {
      setLoading(false);
    }
  };

  const checkWorkloadBalance = async () => {
    console.log('🔥 checkWorkloadBalance - FUNCTION CALLED');
    
    try {
      console.log('🔥 Setting loading state...');
      setLoading(true);
      
      console.log('🔥 Setting active tab to workload...');
      setActiveTab('workload');
      
      console.log('🔥 Calculating target...');
      const effectiveTarget = useMaxSupervisorsAsSetting ? maxSupervisorsPerMonitoring : targetSurveillances;
      console.log('🔥 Effective target calculated:', effectiveTarget);
      
      console.log('🚀 About to call examApi.checkSurveillanceWorkload...');
      
      // Direct API call without extra checks
      const response = await examApi.checkSurveillanceWorkload(effectiveTarget);
      
      console.log('✅ API response received:', response);
      setWorkloadData(response);
      console.log('✅ Workload data set successfully');
      
    } catch (error: any) {
      console.error('❌ checkWorkloadBalance FAILED:', error);
      console.error('❌ Error message:', error?.message);
      console.error('❌ Full error:', error);
      
      alert(`Workload check failed: ${error?.message || 'Unknown error'}`);
    } finally {
      console.log('🔥 Setting loading to false...');
      setLoading(false);
    }
  };

  const checkAllConflicts = async () => {
    setShowModal(true);
    
    console.log('🚀 checkAllConflicts - Starting all checks...');
    
    // Run checks sequentially to avoid interference
    try {
      console.log('1️⃣ Starting date conflicts check...');
      await checkDateConflicts();
      console.log('✅ Date conflicts check completed');
      
      console.log('2️⃣ Starting teacher conflicts check...');
      await checkTeacherConflicts();
      console.log('✅ Teacher conflicts check completed');
      
      console.log('3️⃣ Starting workload balance check...');
      await checkWorkloadBalance();
      console.log('✅ Workload balance check completed');
      
      console.log('✅ ALL CHECKS COMPLETED SUCCESSFULLY');
    } catch (error) {
      console.error('❌ Error in checkAllConflicts:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'BELOW_TARGET':
      case 'NO_SURVEILLANCE':
      case 'UNDERUTILIZED':
        return styles.belowTarget;
      case 'ABOVE_TARGET':
      case 'OVERLOADED':
        return styles.aboveTarget;
      case 'ON_TARGET':
      case 'NORMAL':
        return styles.onTarget;
      default:
        return '';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      case 'none': return '#6b7280';
      default: return '#6b7280';
    }
  };

  return (
    <>
      {/* Check Conflicts Button */}
      <button 
        className={styles.checkButton}
        onClick={() => {
          console.log('🚨 BUTTON CLICKED - Check Conflicts & Workload');
          checkAllConflicts();
        }}
        disabled={loading}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7V12C2 16.5 4.23 20.68 7.62 23.15L12 24L16.38 23.15C19.77 20.68 22 16.5 22 12V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Check Conflicts & Workload
      </button>

      {/* Conflicts Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Scheduling Conflicts & Workload Analysis</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            {/* Tab Navigation */}
            <div className={styles.tabContainer}>
              <button 
                className={`${styles.tab} ${activeTab === 'date' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('date')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Date/Time Conflicts ({dateConflicts.length})
              </button>
              <button 
                className={`${styles.tab} ${activeTab === 'teacher' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('teacher')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Teacher Conflicts ({teacherConflicts.length})
              </button>
              <button 
                className={`${styles.tab} ${activeTab === 'workload' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('workload')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M3 12H7L10 3L14 21L17 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Workload Balance
                {useMaxSupervisorsAsSetting && (
                  <span style={{ fontSize: '12px', backgroundColor: '#0B8FAC', color: 'white', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px' }}>
                    Target: {maxSupervisorsPerMonitoring}
                  </span>
                )}
              </button>
            </div>

            {/* Content */}
            <div className={styles.modalContent}>
              {loading ? (
                <div className={styles.loading}>
                  <div className={styles.spinner}></div>
                  <p>Analyzing conflicts and workload distribution...</p>
                </div>
              ) : (
                <>
                  {/* Date/Time Conflicts Tab */}
                  {activeTab === 'date' && (
                    <div className={styles.conflictsList}>
                      {dateConflicts.length === 0 ? (
                        <div className={styles.noConflicts}>
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                            <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49704C5.79935 3.85777 7.69279 2.71535 9.79619 2.24006C11.8996 1.76477 14.1003 1.98225 16.07 2.86" stroke="#10B981" strokeWidth="2"/>
                            <path d="M22 4L12 14.01L9 11.01" stroke="#10B981" strokeWidth="2"/>
                          </svg>
                          <p>No date/time conflicts found!</p>
                          <span>All modules have consistent exam schedules.</span>
                        </div>
                      ) : (
                        dateConflicts.map((moduleConflict, idx) => (
                          <div key={idx} className={styles.conflictCard}>
                            <h3 className={styles.moduleTitle}>
                              <span className={styles.moduleIcon}>📚</span>
                              {moduleConflict.Module}
                            </h3>
                            {moduleConflict.conflicts.map((conflict, cIdx) => (
                              <div key={cIdx} className={styles.conflictDetail}>
                                <div className={styles.conflictRow}>
                                  <span className={styles.planningBadge}>
                                    Planning #{conflict.planning1_id}
                                  </span>
                                  <span className={styles.dateTime}>
                                    📅 {conflict.date_1} at {conflict.time_1}
                                  </span>
                                </div>
                                <div className={styles.vsText}>VS</div>
                                <div className={styles.conflictRow}>
                                  <span className={styles.planningBadge}>
                                    Planning #{conflict.planning2_id}
                                  </span>
                                  <span className={styles.dateTime}>
                                    📅 {conflict.date_2} at {conflict.time_2}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Teacher Conflicts Tab */}
                  {activeTab === 'teacher' && (
                    <div className={styles.conflictsList}>
                      {teacherConflicts.length === 0 ? (
                        <div className={styles.noConflicts}>
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                            <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49704C5.79935 3.85777 7.69279 2.71535 9.79619 2.24006C11.8996 1.76477 14.1003 1.98225 16.07 2.86" stroke="#10B981" strokeWidth="2"/>
                            <path d="M22 4L12 14.01L9 11.01" stroke="#10B981" strokeWidth="2"/>
                          </svg>
                          <p>No teacher conflicts found!</p>
                          <span>All teachers have non-overlapping schedules.</span>
                        </div>
                      ) : (
                        teacherConflicts.map((teacherConflict, idx) => (
                          <div key={idx} className={styles.conflictCard}>
                            <h3 className={styles.teacherTitle}>
                              <span className={styles.teacherIcon}>👨‍🏫</span>
                              Teacher: {teacherConflict.code_enseignant}
                            </h3>
                            <p className={styles.conflictCount}>
                              {teacherConflict.conflicts.length} scheduling conflict{teacherConflict.conflicts.length > 1 ? 's' : ''}
                            </p>
                            {teacherConflict.conflicts.map((conflict, cIdx) => (
                              <div key={cIdx} className={styles.conflictDetail}>
                                <div className={styles.timeConflict}>
                                  <span className={styles.conflictTime}>
                                    ⏰ {conflict.date} at {conflict.time}
                                  </span>
                                </div>
                                <div className={styles.planningsConflict}>
                                  <span className={styles.surveillanceBadge}>
                                    Surveillance #{conflict.surveillance1_id} (Planning #{conflict.planning1_id})
                                  </span>
                                  <span className={styles.conflictSeparator}>conflicts with</span>
                                  <span className={styles.surveillanceBadge}>
                                    Surveillance #{conflict.surveillance2_id} (Planning #{conflict.planning2_id})
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Workload Balance Tab */}
                  {activeTab === 'workload' && (
                    <div className={styles.workloadContent}>
                      {/* Settings Integration Notice */}
                      <div className={styles.settingsNotice}>
                        <div className={styles.settingsHeader}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2"/>
                            <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5842 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6642 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.2579 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6642 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.01127 9.77251C4.28054 9.5799 4.48571 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          <span>Using Settings Configuration</span>
                        </div>
                        <p>Analysis based on your configured maximum of <strong>{maxSupervisorsPerMonitoring} supervisors per monitoring session</strong>.</p>
                      </div>

                      {/* Target Surveillances Control */}
                      <div className={styles.targetInputCard}>
                        <h3>Surveillance Target Configuration</h3>
                        <div className={styles.targetOptions}>
                          <label className={styles.targetOption}>
                            <input
                              type="radio"
                              checked={useMaxSupervisorsAsSetting}
                              onChange={() => setUseMaxSupervisorsAsSetting(true)}
                            />
                            <span>Use Max Supervisors Setting ({maxSupervisorsPerMonitoring})</span>
                          </label>
                          <label className={styles.targetOption}>
                            <input
                              type="radio"
                              checked={!useMaxSupervisorsAsSetting}
                              onChange={() => setUseMaxSupervisorsAsSetting(false)}
                            />
                            <span>Custom Target</span>
                          </label>
                        </div>
                        
                        {!useMaxSupervisorsAsSetting && (
                          <div className={styles.targetInputGroup}>
                            <label>Custom target surveillances per teacher:</label>
                            <input
                              type="number"
                              min="0"
                              value={targetSurveillances || ''}
                              onChange={(e) => setTargetSurveillances(e.target.value ? parseInt(e.target.value) : undefined)}
                              placeholder="e.g., 3"
                              className={styles.targetInput}
                            />
                          </div>
                        )}
                        
                        <button
                          onClick={checkWorkloadBalance}
                          className={styles.applyButton}
                          disabled={loading}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M1 4V10H1.582M23 20V14H22.418M21.721 9.506C20.969 6.218 18.167 3.5 14.672 3.042C10.6 2.507 6.782 4.736 5.062 8.293M2.279 14.494C3.031 17.782 5.833 20.5 9.328 20.958C13.4 21.493 17.218 19.264 18.938 15.707" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          Recalculate with {useMaxSupervisorsAsSetting ? 'Settings' : 'Custom'} Target
                        </button>
                        
                        <p className={styles.targetHint}>
                          {useMaxSupervisorsAsSetting 
                            ? `Using the configured maximum of ${maxSupervisorsPerMonitoring} supervisors as the target per teacher.`
                            : 'Leave custom target empty to use the calculated average as baseline.'
                          }
                        </p>
                      </div>

                      {workloadData && (
                        <>
                          {/* Global Metrics Card */}
                          <div className={styles.globalMetricsCard}>
                            <h3>Global Workload Analysis</h3>
                            <div className={styles.metricsGrid}>
                              <div className={styles.metricItem}>
                                <span className={styles.metricLabel}>Total Courses</span>
                                <span className={styles.metricValue}>{workloadData.global_metrics.total_charges_enseignement}</span>
                              </div>
                              <div className={styles.metricItem}>
                                <span className={styles.metricLabel}>Total Plannings</span>
                                <span className={styles.metricValue}>{workloadData.global_metrics.total_plannings}</span>
                              </div>
                              <div className={styles.metricItem}>
                                <span className={styles.metricLabel}>Total Surveillances</span>
                                <span className={styles.metricValue}>{workloadData.global_metrics.total_surveillances || workloadData.teacher_distribution.total_surveillances}</span>
                              </div>
                              <div className={styles.metricItem}>
                                <span className={styles.metricLabel}>NbrSS Ratio</span>
                                <span className={styles.metricValue}>{workloadData.global_metrics.global_nbrss}</span>
                              </div>
                              {workloadData.global_metrics.target_surveillances !== null && workloadData.global_metrics.target_surveillances !== undefined && (
                                <div className={styles.metricItem}>
                                  <span className={styles.metricLabel}>Target/Teacher</span>
                                  <span className={styles.metricValue}>{workloadData.global_metrics.target_surveillances}</span>
                                </div>
                              )}
                            </div>
                            <div className={`${styles.statusBadge} ${styles[workloadData.global_metrics.status.toLowerCase().replace(/_/g, '-')]}`}>
                              {workloadData.global_metrics.status.replace(/_/g, ' ')}
                            </div>
                            <p className={styles.recommendation}>{workloadData.global_metrics.recommendation}</p>
                            {workloadData.global_metrics.surveillance_gap !== null && workloadData.global_metrics.surveillance_gap !== undefined && (
                              <p className={styles.gapInfo}>
                                Gap: {workloadData.global_metrics.surveillance_gap > 0 ? '+' : ''}{workloadData.global_metrics.surveillance_gap} surveillances
                              </p>
                            )}
                          </div>

                          {/* Teacher Distribution */}
                          <div className={styles.distributionCard}>
                            <h3>Teacher Distribution</h3>
                            <div className={styles.distributionGrid}>
                              <div className={styles.distItem}>
                                <span className={styles.distNumber}>{workloadData.teacher_distribution.total_teachers}</span>
                                <span className={styles.distLabel}>Total Teachers</span>
                              </div>
                              <div className={styles.distItem}>
                                <span className={styles.distNumber}>{workloadData.teacher_distribution.average_per_teacher}</span>
                                <span className={styles.distLabel}>Avg. Surveillances</span>
                              </div>
                              {workloadData.global_metrics.target_surveillances !== null && workloadData.global_metrics.target_surveillances !== undefined ? (
                                <>
                                  <div className={styles.distItem}>
                                    <span className={styles.distNumber}>{workloadData.teacher_distribution.below_target || 0}</span>
                                    <span className={styles.distLabel}>Below Target</span>
                                  </div>
                                  <div className={styles.distItem}>
                                    <span className={styles.distNumber}>{workloadData.teacher_distribution.on_target || 0}</span>
                                    <span className={styles.distLabel}>On Target</span>
                                  </div>
                                  <div className={styles.distItem}>
                                    <span className={styles.distNumber}>{workloadData.teacher_distribution.above_target || 0}</span>
                                    <span className={styles.distLabel}>Above Target</span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className={styles.distItem}>
                                    <span className={styles.distNumber}>{workloadData.teacher_distribution.no_surveillance || 0}</span>
                                    <span className={styles.distLabel}>No Surveillance</span>
                                  </div>
                                  <div className={styles.distItem}>
                                    <span className={styles.distNumber}>{workloadData.teacher_distribution.underutilized || 0}</span>
                                    <span className={styles.distLabel}>Underutilized</span>
                                  </div>
                                  <div className={styles.distItem}>
                                    <span className={styles.distNumber}>{workloadData.teacher_distribution.normal || 0}</span>
                                    <span className={styles.distLabel}>Normal</span>
                                  </div>
                                  <div className={styles.distItem}>
                                    <span className={styles.distNumber}>{workloadData.teacher_distribution.overloaded || 0}</span>
                                    <span className={styles.distLabel}>Overloaded</span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Teacher Analysis List */}
                          <div className={styles.teacherAnalysisList}>
                            <h3>Individual Teacher Analysis</h3>
                            <div style={{ marginBottom: '16px', fontSize: '14px', color: '#6b7280' }}>
                              {workloadData.message}
                            </div>
                            {workloadData.teacher_analysis && workloadData.teacher_analysis.length > 0 ? (
                              workloadData.teacher_analysis.map((teacher, idx) => (
                                <div key={idx} className={`${styles.teacherAnalysisCard} ${styles[teacher.statistics.severity]}`}>
                                  <div className={styles.teacherHeader}>
                                    <div className={styles.teacherInfo}>
                                      <h4>{teacher.teacher_info.name}</h4>
                                      <span className={styles.teacherCode}>{teacher.teacher_info.code}</span>
                                      <span className={styles.teacherDept}>{teacher.teacher_info.department}</span>
                                    </div>
                                    <div className={`${styles.statusIndicator} ${getStatusColor(teacher.statistics.status)}`}>
                                      {teacher.statistics.status.replace(/_/g, ' ')}
                                    </div>
                                  </div>
                                  <div className={styles.teacherStats}>
                                    <div className={styles.statItem}>
                                      <span className={styles.statLabel}>Surveillances</span>
                                      <span className={styles.statValue}>{teacher.statistics.surveillance_count}</span>
                                    </div>
                                    <div className={styles.statItem}>
                                      <span className={styles.statLabel}>Courses</span>
                                      <span className={styles.statValue}>{teacher.statistics.courses_count}</span>
                                    </div>
                                    <div className={styles.statItem}>
                                      <span className={styles.statLabel}>
                                        {workloadData.global_metrics.target_surveillances !== null && workloadData.global_metrics.target_surveillances !== undefined ? 'Difference' : 'Deviation'}
                                      </span>
                                      <span className={styles.statValue} style={{
                                        color: teacher.statistics.deviation > 0 ? '#ef4444' : teacher.statistics.deviation < 0 ? '#f59e0b' : '#10b981'
                                      }}>
                                        {teacher.statistics.deviation > 0 ? '+' : ''}{teacher.statistics.deviation.toFixed(1)}
                                        {(workloadData.global_metrics.target_surveillances === null || workloadData.global_metrics.target_surveillances === undefined) 
                                          ? ` (${teacher.statistics.deviation_percentage.toFixed(1)}%)` 
                                          : ''}
                                      </span>
                                    </div>
                                    <div className={styles.statItem}>
                                      <span className={styles.statLabel}>Email</span>
                                      <span className={styles.statValue} style={{ 
                                        fontSize: '12px',
                                        wordBreak: 'break-all'
                                      }}>
                                        {teacher.teacher_info.email !== 'No email' ? teacher.teacher_info.email : 'None'}
                                      </span>
                                    </div>
                                  </div>
                                  <p className={styles.teacherRecommendation}>{teacher.recommendation}</p>
                                  
                                  {/* Contact info for issues */}
                                  {teacher.statistics.severity === 'high' && teacher.teacher_info.email !== 'No email' && (
                                    <div style={{
                                      marginTop: '12px',
                                      padding: '8px',
                                      backgroundColor: '#fef3c7',
                                      borderRadius: '6px',
                                      fontSize: '12px',
                                      color: '#92400e'
                                    }}>
                                      <strong>⚠️ High Priority:</strong> Contact {teacher.teacher_info.email} to resolve workload issue
                                    </div>
                                  )}
                                </div>
                              ))
                            ) : (
                              <p className={styles.noData}>No teacher analysis data available.</p>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Summary Footer */}
            <div className={styles.modalFooter}>
              <div className={styles.summary}>
                <span className={styles.summaryItem}>
                  <strong>{dateConflicts.reduce((acc, m) => acc + m.conflicts.length, 0)}</strong> date conflicts
                </span>
                <span className={styles.separator}>•</span>
                <span className={styles.summaryItem}>
                  <strong>{teacherConflicts.reduce((acc, t) => acc + t.conflicts.length, 0)}</strong> teacher conflicts
                </span>
                {workloadData && (
                  <>
                    <span className={styles.separator}>•</span>
                    <span className={styles.summaryItem}>
                      <strong>
                        {workloadData.global_metrics.target_surveillances !== null && workloadData.global_metrics.target_surveillances !== undefined
                          ? (workloadData.teacher_distribution.below_target || 0) + (workloadData.teacher_distribution.above_target || 0)
                          : (workloadData.teacher_distribution.no_surveillance || 0) + 
                            (workloadData.teacher_distribution.overloaded || 0) + 
                            (workloadData.teacher_distribution.underutilized || 0)
                        }
                      </strong> workload issues
                    </span>
                    <span className={styles.separator}>•</span>
                    <span className={styles.summaryItem}>
                      <strong>{workloadData.teacher_distribution.total_teachers}</strong> teachers analyzed
                    </span>
                  </>
                )}
              </div>
              <button 
                className={styles.refreshButton}
                onClick={checkAllConflicts}
                disabled={loading}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M1 4V10H1.582M23 20V14H22.418M21.721 9.506C20.969 6.218 18.167 3.5 14.672 3.042C10.6 2.507 6.782 4.736 5.062 8.293M2.279 14.494C3.031 17.782 5.833 20.5 9.328 20.958C13.4 21.493 17.218 19.264 18.938 15.707" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Refresh Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ConflictChecker;