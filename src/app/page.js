import ChatUI from "@/components/ChatUI";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1 className={styles.heading}>chatbot-ui</h1>
        </div>
        <div className={styles.ctas}>
          <ChatUI />
        </div>
      </main>
    </div>
  );
}
