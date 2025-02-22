import styles from "./Hero.module.css";

interface HeroProps {
  title: {
    line1: string;
    line2: string;
  };
  subtitle: string;
}

export const Hero = ({
  title = { line1: "Next.js", line2: "Boilerplate" },
  subtitle = "A minimalist foundation for building modern web applications",
}: HeroProps) => {
  return (
    <div className={styles.heroSection}>
      <h1 className={styles.title}>
        <span className={styles.titleLine}>{title.line1}</span>
        <span className={styles.titleLine}>{title.line2}</span>
      </h1>
      <p className={styles.subtitle}>{subtitle}</p>
    </div>
  );
};
