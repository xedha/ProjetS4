import React, { useState, useEffect } from "react";
import Form2 from "../addbutton/Form2"; 
import styles from "./Tabel.module.css";

interface EditButtonProps {
  isOpen: boolean;
  onClose: () => void;
  onClick: () => void;
  planningData?: any; // Pass the planning data directly from parent
  onUpdateSuccess?: () => void;
}

const Editbutton: React.FC<EditButtonProps> = ({ 
  isOpen, 
  onClose, 
  onClick,
  planningData,
  onUpdateSuccess
}) => {
  const [showForm2, setShowForm2] = useState(false);
  const [loading, setLoading] = useState(false);

  // Process planning data for the form when modal is opened
  useEffect(() => {
    if (isOpen && planningData) {
      setLoading(true);
      // Form will use the data directly
      setLoading(false);
    }
  }, [isOpen, planningData]);

  useEffect(() => {
    if (isOpen) setShowForm2(true);
  }, [isOpen]);

  const closeAll = () => {
    onClose();
    setShowForm2(false);
  };

  const handleUpdateSuccess = () => {
    closeAll();
    if (onUpdateSuccess) {
      onUpdateSuccess();
    }
  };

  // If the button is not clicked yet, render the button
  if (!showForm2) {
    return (
      <button
        className={styles.modifybutton}
        onClick={onClick}
        aria-label="Edit"
      />
    );
  }

  // Show loading state when fetching data
  if (loading) {
    return <div className={styles.loadingIndicator}>Loading...</div>;
  }

  // Render form when data is available
  return (
    <Form2 
      setShowPopup={closeAll} 
      editData={planningData} 
      onUpdateSuccess={handleUpdateSuccess}
    />
  );
};

export default Editbutton;