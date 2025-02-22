import Image from "next/image";
import styles from "./sections.module.css";

export const TextImageSection = () => {
  return (
    <section className={styles.textImageSection}>
      <div className={styles.content}>
        <h2 className={styles.sectionTitle}>Build faster</h2>
        <p className={styles.sectionText}>
          Streamline your development workflow with our preconfigured setup.
          Start building remarkable applications right away.
        </p>
      </div>
      <div className={styles.imageWrapper}>
        <Image
          src="/assets/images/blank.webp"
          alt="Development process"
          width={600}
          height={400}
          className={styles.sectionImage}
        />
      </div>
    </section>
  );
};

export const ImageTextSection = () => {
  return (
    <section className={styles.imageTextSection}>
      <div className={styles.imageWrapper}>
        <Image
          src="/assets/images/blank.webp"
          alt="Design process"
          width={600}
          height={400}
          className={styles.sectionImage}
        />
      </div>
      <div className={styles.content}>
        <h2 className={styles.sectionTitle}>Design with purpose</h2>
        <p className={styles.sectionText}>
          Create engaging user experiences with modern design patterns and
          responsive layouts that work across all devices.
        </p>
      </div>
    </section>
  );
};

export const FullscreenVideo = () => {
  return (
    <section className={styles.videoSection}>
      <video autoPlay muted loop playsInline className={styles.backgroundVideo}>
        <source src="assets/videos/test.mp4" type="video/mp4" />
      </video>
      <div className={styles.videoOverlay}>
        <h2 className={styles.videoTitle}>Immersive Experiences</h2>
      </div>
    </section>
  );
};

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>Contact</h3>
          <p>Email: hello@example.com</p>
          <p>Phone: +1 234 567 890</p>
        </div>
        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>Follow</h3>
          <div className={styles.socialLinks}>
            <a href="#" className={styles.socialLink}>
              Twitter
            </a>
            <a href="#" className={styles.socialLink}>
              LinkedIn
            </a>
            <a href="#" className={styles.socialLink}>
              GitHub
            </a>
          </div>
        </div>
        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>Legal</h3>
          <a href="#" className={styles.footerLink}>
            Privacy Policy
          </a>
          <a href="#" className={styles.footerLink}>
            Terms of Service
          </a>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>&copy; 2024 Next.js Boilerplate. All rights reserved.</p>
      </div>
    </footer>
  );
};
