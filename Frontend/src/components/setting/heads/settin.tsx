import styles from "./settin.module.css"
import { useTranslation } from 'react-i18next';

function Settin() {
  const { t } = useTranslation();

  return (
    <>
      <div className={styles.header}>{t('settings.adminTableTitle')}</div>
    </>
  )
}

export default Settin