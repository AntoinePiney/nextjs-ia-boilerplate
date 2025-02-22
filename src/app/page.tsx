import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.logo}>NB</div>
        <div className={styles.menu}>
          <span className={styles.menuLine}></span>
          <span className={styles.menuLine}></span>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.heroSection}>
          <h1 className={styles.title}>
            <span className={styles.titleLine}>Next.js</span>
            <span className={styles.titleLine}>Boilerplate</span>
          </h1>
          <p className={styles.subtitle}>
            A minimalist foundation for building modern web applications
          </p>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerLeft}>@2024</div>
        <div className={styles.socialLinks}>
          <a
            href="https://github.com"
            className={styles.socialLink}
            target="_blank"
            rel="noopener noreferrer">
            GitHub
          </a>
          <a
            href="https://nextjs.org/docs"
            className={styles.socialLink}
            target="_blank"
            rel="noopener noreferrer">
            Docs
          </a>
          <a
            href="https://vercel.com"
            className={styles.socialLink}
            target="_blank"
            rel="noopener noreferrer">
            Deploy
          </a>
        </div>
      </footer>
    </div>
  );
}
