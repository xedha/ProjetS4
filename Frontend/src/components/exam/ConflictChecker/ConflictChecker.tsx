import React, { useState } from 'react';
import { examApi, WorkloadResponse } from '../../../services/ExamApi';
import styles from './ConflictChecker.module.css';

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

function ConflictChecker() {
  const [dateConflicts, setDateConflicts] = useState<ModuleConflict[]>([]);
  const [teacherConflicts, setTeacherConflicts] = useState<TeacherConflict[]>([]);
  const [workloadData, setWorkloadData] = useState<WorkloadResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'date' | 'teacher' | 'workload'>('date');
  const [showModal, setShowModal] = useState(false);
  const [targetSurveillances, setTargetSurveillances] = useState<number | undefined>(undefined);

  const checkDateConflicts = async () => {
    try {
      setLoading(true);
      const response = await examApi.checkExamDate({});
      if (response.conflicts) {
        setDateConflicts(response.conflicts);
      } else {
        setDateConflicts([]);
      }
      setActiveTab('date');
    } catch (error) {
      console.error('Error checking date conflicts:', error);
      alert('Failed to check date conflicts');
    } finally {
      setLoading(false);
    }
  };

  const checkTeacherConflicts = async () => {
    try {
      setLoading(true);
      const response = await examApi.checkEnseignantScheduleConflict({});
      if (response.conflicts) {
        setTeacherConflicts(response.conflicts);
      } else {
        setTeacherConflicts([]);
      }
      setActiveTab('teacher');
    } catch (error) {
      console.error('Error checking teacher conflicts:', error);
      alert('Failed to check teacher conflicts');
    } finally {
      setLoading(false);
    }
  };

  const checkWorkloadBalance = async () => {
    try {
      setLoading(true);
      const response = await examApi.checkSurveillanceWorkload(targetSurveillances);
      setWorkloadData(response);
      setActiveTab('workload');
    } catch (error) {
      console.error('Error checking workload balance:', error);
      alert('Failed to check workload balance');
    } finally {
      setLoading(false);
    }
  };

  const checkAllConflicts = async () => {
    setShowModal(true);
    await Promise.all([
      checkDateConflicts(), 
      checkTeacherConflicts(),
      checkWorkloadBalance()
    ]);
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

  return (
    <>
      {/* Check Conflicts Button */}
      <button 
        className={styles.checkButton}
        onClick={checkAllConflicts}
        disabled={loading}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7V12C2 16.5 4.23 20.68 7.62 23.15L12 24L16.38 23.15C19.77 20.68 22 16.5 22 12V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Check Conflicts
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
              </button>
            </div>

            {/* Content */}
            <div className={styles.modalContent}>
              {loading ? (
                <div className={styles.loading}>
                  <div className={styles.spinner}></div>
                  <p>Checking for conflicts...</p>
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
                      {/* Target Surveillances Input */}
                      <div className={styles.targetInputCard}>
                        <h3>Set Target Surveillances</h3>
                        <div className={styles.targetInputGroup}>
                          <label>Target surveillances per teacher:</label>
                          <input
                            type="number"
                            min="0"
                            value={targetSurveillances || ''}
                            onChange={(e) => setTargetSurveillances(e.target.value ? parseInt(e.target.value) : undefined)}
                            placeholder="e.g., 3"
                            className={styles.targetInput}
                          />
                          <button
                            onClick={checkWorkloadBalance}
                            className={styles.applyButton}
                            disabled={loading}
                          >
                            Apply Target
                          </button>
                        </div>
                        <p className={styles.targetHint}>
                          Leave empty to use the calculated average as baseline
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
                                <span className={styles.metricValue}>{workloadData.global_metrics.global_nbrss}</span>
                              </div>
                              {'target_surveillances' in workloadData.global_metrics && workloadData.global_metrics.target_surveillances !== null && (
                                <div className={styles.metricItem}>
                                  <span className={styles.metricLabel}>Target/Teacher</span>
                                  <span className={styles.metricValue}>{(workloadData.global_metrics as any).target_surveillances}</span>
                                </div>
                              )}
                            </div>
                            <div className={`${styles.statusBadge} ${styles[workloadData.global_metrics.status.toLowerCase().replace(/_/g, '-')]}`}>
                              {workloadData.global_metrics.status.replace(/_/g, ' ')}
                            </div>
                            <p className={styles.recommendation}>{workloadData.global_metrics.recommendation}</p>
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
                              {'target_surveillances' in workloadData.global_metrics && workloadData.global_metrics.target_surveillances !== null ? (
                                <>
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
                              ) : (
                                <>
                                  <div className={styles.distItem}>
                                    <span className={styles.distNumber}>{workloadData.teacher_distribution.no_surveillance}</span>
                                    <span className={styles.distLabel}>No Surveillance</span>
                                  </div>
                                  <div className={styles.distItem}>
                                    <span className={styles.distNumber}>{workloadData.teacher_distribution.overloaded}</span>
                                    <span className={styles.distLabel}>Overloaded</span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Teacher Analysis List */}
                          <div className={styles.teacherAnalysisList}>
                            <h3>Individual Teacher Analysis</h3>
                            {workloadData.teacher_analysis.length > 0 ? (
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
                                        {'target_surveillances' in workloadData.global_metrics && (workloadData.global_metrics as any).target_surveillances !== null ? 'Difference' : 'Deviation'}
                                      </span>
                                      <span className={styles.statValue}>
                                        {'deviation' in teacher.statistics
                                          ? ((teacher.statistics as any).deviation > 0 ? '+' : '') + ((teacher.statistics as any).deviation.toFixed(0))
                                          : ''}
                                        {('target_surveillances' in workloadData.global_metrics && (workloadData.global_metrics as any).target_surveillances === null) && ` (${teacher.statistics.deviation_percentage}%)`}
                                      </span>
                                    </div>
                                  </div>
                                  <p className={styles.teacherRecommendation}>{teacher.recommendation}</p>
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
                        {'target_surveillances' in workloadData.global_metrics && (workloadData.global_metrics as any).target_surveillances !== null
                          ? (workloadData.teacher_distribution.underutilized || 0) + (workloadData.teacher_distribution.overloaded || 0)
                          : (workloadData.teacher_distribution.no_surveillance || 0) + (workloadData.teacher_distribution.overloaded || 0)
                        }
                      </strong> workload issues
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
                Refresh
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ConflictChecker;