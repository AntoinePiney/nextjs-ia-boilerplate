// app/layout.tsx
import "../styles/globals.css";
import "../styles/variables.css";
import styles from "./layout.module.css";

export const metadata = {
  title: "Labs",
  description: "Description de votre projet",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <div className={styles.layoutContainer}>
          <main className={styles.mainContent}>{children}</main>
        </div>
      </body>
    </html>
  );
}
