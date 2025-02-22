import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.logo}>NS.</div>
        <div className={styles.menu}>
          <span className={styles.menuLine}></span>
          <span className={styles.menuLine}></span>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.heroSection}>
          <h1 className={styles.title}>
            <span className={styles.titleLine}>Next.js Boilerplate</span>
            <span className={styles.titleLine}>IA process</span>
          </h1>
          <p className={styles.subtitle}>
            Crafting digital experiences with clean code and bold design
          </p>
        </div>

        <div className={styles.projectsGrid}>
          <div className={`${styles.projectCard} ${styles.featured}`}>
            <div className={styles.projectContent}>
              <span className={styles.projectNumber}>01</span>
              <h3>Portfolio</h3>
              <p>Design & Development</p>
            </div>
          </div>
          <div className={styles.projectCard}>
            <div className={styles.projectContent}>
              <span className={styles.projectNumber}>02</span>
              <h3>E-commerce</h3>
              <p>Web Application</p>
            </div>
          </div>
          <div className={styles.projectCard}>
            <div className={styles.projectContent}>
              <span className={styles.projectNumber}>03</span>
              <h3>Dashboard</h3>
              <p>UX/UI Design</p>
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          <p>Available for freelance work</p>
          <a href="mailto:contact@example.com" className={styles.contactLink}>
            contact@example.com
          </a>
        </div>
        <div className={styles.footerRight}>
          <div className={styles.socialLinks}>
            <a href="#" className={styles.socialLink}>
              GitHub
            </a>
            <a href="#" className={styles.socialLink}>
              LinkedIn
            </a>
            <a href="#" className={styles.socialLink}>
              Twitter
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
