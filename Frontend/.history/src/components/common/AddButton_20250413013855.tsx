"use client"

import styles from "./addbutton.module.css"

interface AddButtonProps {
  text: string
  onClick?: () => void
}

function AddButton({ text, onClick }: AddButtonProps) {
  return (
    <button className={styles.addbuttongreen} onClick={onClick}>
      <span className={styles.add}>+</span> {text}
    </button>
  )
}

export default AddButton
