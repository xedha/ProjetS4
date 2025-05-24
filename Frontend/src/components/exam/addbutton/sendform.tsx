import styles from './sendform.module.css';
import { useState, useEffect } from 'react';
import { examApi } from '../../../services/ExamApi';

interface FormProps {
  setShowPopup: (show: boolean) => void;
  planningId?: number;
}

function SendForm({ setShowPopup, planningId }: FormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailType, setEmailType] = useState<'convocations' | 'pv'>('convocations');
  const [sendResults, setSendResults] = useState<{
    convocations?: any;
    pv?: any;
  }>({});
  const [progress, setProgress] = useState<{
    status: string;
    percentage: number;
    currentAction: string;
  }>({
    status: '',
    percentage: 0,
    currentAction: ''
  });
  const [elapsedTime, setElapsedTime] = useState(0);

  // Timer to show elapsed time during sending
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      setElapsedTime(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const simulateProgress = (action: string, estimatedDuration: number = 30) => {
    let currentProgress = 0;
    const increment = 100 / (estimatedDuration * 10); // Update every 100ms
    
    const progressInterval = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= 90) {
        // Keep at 90% until actual completion
        currentProgress = 90;
        clearInterval(progressInterval);
      }
      setProgress({
        status: 'sending',
        percentage: Math.min(currentProgress, 90),
        currentAction: action
      });
    }, 100);

    return progressInterval;
  };

  const handleSend = async () => {
    // No validation needed - both email types can be sent without planning ID

    try {
      setLoading(true);
      setError(null);
      setSendResults({});
      
      let progressInterval: NodeJS.Timeout;

      if (emailType === 'convocations') {
        console.log("Sending convocations to all surveillants");
        setProgress({
          status: 'preparing',
          percentage: 10,
          currentAction: 'Préparation des convocations pour tous les surveillants...'
        });
        
        progressInterval = simulateProgress('Envoi des convocations à tous les surveillants...', 45);
        
        // Always send empty object - the backend will fetch all surveillants from DB
        const result = await examApi.sendBulkConvocations({});

        clearInterval(progressInterval);
        
        // Check if the response indicates success
        if (result && (result.success || result.message)) {
          setProgress({
            status: 'completed',
            percentage: 100,
            currentAction: result.message || 'Convocations envoyées avec succès!'
          });
          
          console.log("Convocations sent successfully:", result);
          setSendResults({ convocations: result });
          
          setTimeout(() => {
            setShowPopup(false);
          }, 2000);
        } else {
          throw new Error(result.error || 'Échec de l\'envoi des convocations');
        }
      } else if (emailType === 'pv') {
        console.log("Sending PV emails...");
        setProgress({
          status: 'preparing',
          percentage: 10,
          currentAction: "Préparation des PV d'examen..."
        });
        
        progressInterval = simulateProgress("Envoi des PV d'examen en cours...", 60);
        
        const result = await examApi.sendBulkPV();
        
        clearInterval(progressInterval);
        setProgress({
          status: 'completed',
          percentage: 100,
          currentAction: 'PV envoyés avec succès!'
        });

        console.log("PV emails sent successfully:", result);
        setSendResults({ pv: result });
        
        setTimeout(() => {
          setShowPopup(false);
        }, 2000);
      }
    } catch (err: any) {
      console.error(`Error sending ${emailType}:`, err);
      setError(err instanceof Error ? err.message : `Failed to send ${emailType}`);
      setProgress({
        status: 'error',
        percentage: 0,
        currentAction: 'Erreur lors de l\'envoi'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendBoth = async () => {
    try {
      setLoading(true);
      setError(null);
      setSendResults({});
      
      const results: any = {};
      let progressInterval: NodeJS.Timeout;
      
      // Send convocations
      try {
        setProgress({
          status: 'preparing',
          percentage: 5,
          currentAction: 'Préparation des convocations de surveillance...'
        });
        
        progressInterval = simulateProgress('Envoi des convocations en cours...', 45);
        
        console.log("Sending convocations to all surveillants...");
        // The backend will fetch all convocations from the database
        const convocationResult = await examApi.sendBulkConvocations({});
        
        clearInterval(progressInterval);
        
        results.convocations = convocationResult;
        console.log("Convocations sent successfully:", convocationResult);
        
        setProgress({
          status: 'progress',
          percentage: 50,
          currentAction: 'Convocations envoyées, préparation des PV...'
        });
      } catch (err) {
        console.error("Error sending convocations:", err);
        results.convocationsError = err;
      }
      
      // Send PV emails
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Brief pause between operations
        
        progressInterval = simulateProgress("Envoi des PV d'examen en cours...", 60);
        
        console.log("Sending PV emails...");
        const pvResult = await examApi.sendBulkPV();
        
        clearInterval(progressInterval!);
        
        results.pv = pvResult;
        console.log("PV emails sent successfully:", pvResult);
        
        setProgress({
          status: 'completed',
          percentage: 100,
          currentAction: 'Tous les emails ont été envoyés avec succès!'
        });
      } catch (err) {
        console.error("Error sending PV emails:", err);
        results.pvError = err;
      }
      
      setSendResults(results);
      
      // Check if both succeeded
      if (results.convocations && results.pv && !results.convocationsError && !results.pvError) {
        setTimeout(() => {
          setShowPopup(false);
        }, 2000);
      } else if (results.convocationsError || results.pvError) {
        setError("Certains emails n'ont pas pu être envoyés. Consultez la console pour plus de détails.");
        setProgress({
          status: 'error',
          percentage: 0,
          currentAction: 'Erreur lors de l\'envoi'
        });
      }
      
    } catch (err: any) {
      console.error('Error sending emails:', err);
      setError(err instanceof Error ? err.message : 'Failed to send emails');
      setProgress({
        status: 'error',
        percentage: 0,
        currentAction: 'Erreur lors de l\'envoi'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.blurOverlay}></div>
      <div className={styles.container}>
        <button 
          className={styles.close} 
          onClick={() => setShowPopup(false)}
          disabled={loading}
          style={{ opacity: loading ? 0.5 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          <svg className={styles.svg} width="24" height="24" viewBox="0 0 24 24" fill="none"
               xmlns="http://www.w3.org/2000/svg">
            <path d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z" fill="currentColor"/>
          </svg>
        </button>

        <div className={styles.title}>Envoi des Notifications par Email</div>
        
        {!loading && (
          <>
            <div className={styles.userDetails}>
              <div className={styles.inputBox}>
                <span className={styles.details}>Type d'Email</span>
                <select 
                  value={emailType} 
                  onChange={(e) => setEmailType(e.target.value as 'convocations' | 'pv')}
                  disabled={loading}
                >
                  <option value="convocations">Convocations de surveillance</option>
                  <option value="pv">PV d'examen</option>
                </select>
              </div>
            </div>

            <p className={styles.subtitle}>
              {emailType === 'convocations' 
                ? "Envoyer les convocations de surveillance à tous les surveillants assignés dans la base de données"
                : "Envoyer les procès-verbaux d'examen à tous les chargés de cours"}
            </p>
          </>
        )}

        {loading && (
          <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <div className={styles.loader} style={{
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #0B8FAC',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                animation: 'spin 1s linear infinite'
              }}></div>
              <span style={{ marginLeft: '15px', fontSize: '14px', color: '#666' }}>
                Temps écoulé: {formatTime(elapsedTime)}
              </span>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '5px',
                fontSize: '14px'
              }}>
                <span>{progress.currentAction}</span>
                <span>{Math.round(progress.percentage)}%</span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: '#e0e0e0',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${progress.percentage}%`,
                  height: '100%',
                  backgroundColor: progress.status === 'error' ? '#ff4444' : 
                                   progress.status === 'completed' ? '#45D699' : '#0B8FAC',
                  transition: 'width 0.3s ease',
                  borderRadius: '4px'
                }}></div>
              </div>
            </div>

            <p style={{ 
              fontSize: '12px', 
              color: '#666', 
              textAlign: 'center',
              fontStyle: 'italic' 
            }}>
              ⚠️ Cette opération peut prendre plusieurs minutes. Veuillez patienter...
            </p>
          </div>
        )}

        {error && (
          <div className={styles.error} style={{ 
            color: '#ff4444', 
            marginBottom: '10px',
            padding: '10px',
            backgroundColor: '#ffe6e6',
            borderRadius: '5px',
            fontSize: '14px'
          }}>
            ❌ {error}
          </div>
        )}
        
        {sendResults.convocations && (
          <div className={styles.success} style={{ 
            color: '#45D699', 
            marginBottom: '10px',
            padding: '10px',
            backgroundColor: '#e6ffe6',
            borderRadius: '5px',
            fontSize: '14px'
          }}>
            ✓ Convocations envoyées avec succès
          </div>
        )}
        
        {sendResults.pv && (
          <div className={styles.success} style={{ 
            color: '#45D699', 
            marginBottom: '10px',
            padding: '10px',
            backgroundColor: '#e6ffe6',
            borderRadius: '5px',
            fontSize: '14px'
          }}>
            ✓ PV d'examen envoyés avec succès
          </div>
        )}

        <div className={styles.content}>
          <div className={styles.buttonGroup} style={{ 
            display: 'flex', 
            gap: '10px', 
            justifyContent: 'flex-end',
            marginTop: '20px'
          }}>
            <button 
              className={styles.cancelButton} 
              onClick={() => setShowPopup(false)}
              disabled={loading}
              style={{
                padding: '10px 20px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                background: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Fermer après envoi' : 'Annuler'}
            </button>
            {!loading && (
              <>
                <button 
                  className={styles.confirmButton} 
                  onClick={handleSend}
                  disabled={loading}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    background: 'linear-gradient(90deg, #0B8FAC 0%, #043A46 100%)',
                    color: 'white',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1
                  }}
                >
                  Envoyer {emailType === 'convocations' ? 'Convocations' : 'PV'}
                </button>
                <button 
                  className={styles.confirmButton} 
                  onClick={handleSendBoth}
                  disabled={loading}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    background: 'linear-gradient(90deg, #45D699 0%, #2A8B5F 100%)',
                    color: 'white',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1
                  }}
                  title="Envoyer les deux types d\'emails"
                >
                  Envoyer les Deux
                </button>
              </>
            )}
          </div>
        </div>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </>
  );
}

export default SendForm;