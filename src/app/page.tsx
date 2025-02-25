import styles from "./page.module.css";
import Architecture from "@/components/Architecture";

export default function Home() {
  return (
    <div className={styles.container}>
      <Architecture />
    </div>
  );
}
