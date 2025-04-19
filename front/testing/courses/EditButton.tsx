"use client"

import type React from "react"
import { useState, useEffect } from "react"
import ModuleForm from "./ModuleForm"
import styles from "./Tabel.module.css"

type ModalProps = {
  isOpen: boolean
  onClose: () => void
}

const EditButton: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (isOpen) setShowForm(true)
  }, [isOpen])

  const closeAll = () => {
    onClose()
    setShowForm(false)
  }

  if (!showForm) {
    // Render a styled button that can be clicked
    return <button className={styles.modifybutton} onClick={() => setShowForm(true)} />
  }

  return <ModuleForm setShowPopup={setShowForm} />
}

export default EditButton
