import React, { useState, useEffect } from "react";
import Form from "../addbutton/form"; // adjust the path if needed
import styles from "./Tabel.module.css";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Editbutton: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [showForm2, setShowForm2] = useState(false);

  useEffect(() => {
    if (isOpen) setShowForm2(true);
  }, [isOpen]);

  const closeAll = () => {
    onClose();
    setShowForm2(false);
  };

  if (!showForm2) {
    // Render a styled button that can be clicked
    return (
      <button
        className={styles.modifybutton}
        onClick={() => setShowForm2(true)}
      />
    );
  }

  return <Form setShowPopup={setShowForm2} />;
};

export default Editbutton;
