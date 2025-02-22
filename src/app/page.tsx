import { Navigation } from "@/components/layouts/Navigation/Navigation";
import { Hero } from "@/components/layouts/Hero/Hero";
import { Footer } from "@/components/layouts/Footer/Footer";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Navigation />
      <main className={styles.main}>
        <Hero
          title={{
            line1: "Next.js",
            line2: "Boilerplate",
          }}
          subtitle="A minimalist foundation for building modern web applications"
        />
      </main>
      <Footer />
    </div>
  );
}
