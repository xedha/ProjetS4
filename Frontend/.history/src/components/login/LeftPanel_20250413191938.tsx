import type React from "react"
import styles from "./LeftPanel.module.css"

function LeftPanel {
  return (
    <div className={styles.leftpanal}>
      <div className={styles.leftpanelcontent}>
        <h1 className={styles.leftpaneltitle}>Welcome Back!</h1>

        <p className={styles.leftpaneltext}>
          Access all your faculty management tools and information by logging into your account. Manage courses, track
          student performance, and access important details—all in one place.
        </p>

      
      </div>
    </div>
  )
}

