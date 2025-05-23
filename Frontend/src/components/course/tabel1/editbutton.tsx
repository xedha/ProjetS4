import React from "react"
import styles from "./Tabel.module.css"

interface EditButtonProps {
  onClick: () => void
  className?: string
}

const EditButton: React.FC<EditButtonProps> = ({ onClick, className }) => {
  return (
    <button
    className={styles.modifybutton}
    
      onClick={onClick}
      title="Edit"
    >
     
    </button>
  )
}

export default EditButton