import React from "react"
import styles from "./Tabel.module.css"

interface EditButtonProps {
  onClick: () => void
  className?: string
}

const EditButton: React.FC<EditButtonProps> = ({ onClick, className }) => {
  return (
    <button
      className={`${styles.editButton} ${className || ''}`}
      onClick={onClick}
      title="Edit"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

export default EditButton