import type React from "react"
import styles from "./LeftPanel.module.css"

export const LeftPanel: React.FC = () => {
  return (
    <div className={styles.leftpanal}>
      <div className={styles.left-panel-content}>
        <h1 className="left-panel-title">Welcome Back!</h1>

        <p className="left-panel-text">
          Access all your faculty management tools and information by logging into your account. Manage courses, track
          student performance, and access important details—all in one place.
        </p>

      
      </div>
    </div>
  )
}

