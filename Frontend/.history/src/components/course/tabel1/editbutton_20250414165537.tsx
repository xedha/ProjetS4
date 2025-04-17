import styles from './Tabel.module.css'
import modify from './src/assets/edit.svg'
import React, { useState } from "react"
import Form2 from './'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
}

const Editbutton: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [showForm2, setShowForm2] = useState(false)

  if (!isOpen) return null

  return (
    <>
      {/* Modal background */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div
          className="bg-white p-6 rounded-lg shadow-md w-80"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Options</h2>
            <button onClick={onClose} className="text-xl font-bold">
              &times;
            </button>
          </div>

          <label className="block mb-2">
            <input type="checkbox" className="mr-2" /> Option 1
          </label>
          <label className="block mb-2">
            <input type="checkbox" className="mr-2" /> Option 2
          </label>

          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => setShowForm2(true)}
          >
            Edit Specialty
          </button>
        </div>
      </div>

      {/* Show Form2 when triggered */}
      {showForm2 && <Form2 setShowPopup={setShowForm2} />}
    </>
  )
}

export default Editbutton
