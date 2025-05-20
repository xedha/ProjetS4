import React from 'react';
import styles from './Tabel.module.css';

interface ButtonProps {
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ onClick }) => {
  return (
    <div className={styles.uiverse} onClick={onClick}>
      <span className={styles.tooltip}>are you sure !</span>
      <span>
    
      </span>
    </div>
  );
};

export default Button;