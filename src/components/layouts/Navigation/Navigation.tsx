import styles from "./Navigation.module.css";

export const Navigation = () => {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>NB</div>
      <div className={styles.menu}>
        <span className={styles.menuLine}></span>
        <span className={styles.menuLine}></span>
      </div>
    </nav>
  );
};
