import styles from "./Footer.module.css";

interface SocialLink {
  href: string;
  label: string;
}

interface FooterProps {
  copyright?: string;
  socialLinks?: SocialLink[];
}

export const Footer = ({
  copyright = "@2024",
  socialLinks = [
    { href: "https://github.com", label: "GitHub" },
    { href: "https://nextjs.org/docs", label: "Docs" },
    { href: "https://vercel.com", label: "Deploy" },
  ],
}: FooterProps) => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLeft}>{copyright}</div>
      <div className={styles.socialLinks}>
        {socialLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={styles.socialLink}
            target="_blank"
            rel="noopener noreferrer">
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
};
