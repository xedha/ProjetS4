import styles from './Tabel.module.css'

interface ButtonProps {
  className?: string;
  onClick?: () => void;
}

function Button({ className, onClick }: ButtonProps) {
  return (
    <div className={`${styles.uiverse} ${className || ''}`} onClick={onClick}>
      <span className={styles.tooltip}>are you sure !</span>
      <span></span>
    </div>
  )
}

export default Button