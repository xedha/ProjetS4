import styles from "./Tabel.module.css"

function DeleteButton() {
  return (
    <div className={styles.uiverse}>
      <span className={styles.tooltip}>are you sure !</span>
      <span></span>
    </div>
  )
}

export default DeleteButton
