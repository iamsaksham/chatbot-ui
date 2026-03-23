"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ChatUI.module.css";

function messageBody(m) {
  return m.text ?? m.content ?? "";
}

function roleLabel(role) {
  if (role === "user") return "You";
  if (role === "assistant") return "Assistant";
  return role;
}

export default function ChatUI() {
  const [userText, setUserText] = useState("");
  const [messagesList, setMessagesList] = useState([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi — ask anything and I will reply using OpenAI.",
    },
  ]);
  const listRef = useRef(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messagesList]);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = userText.trim();
    if (!trimmed) return;

    setMessagesList((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", text: trimmed },
    ]);
    setUserText("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <div className={styles.chatContainer}>
      <div ref={listRef} className={styles.messagesList} aria-live="polite">
        {messagesList.map((message) => {
          const isUser = message.role === "user";
          return (
            <div
              key={message.id}
              className={isUser ? styles.messageRowUser : styles.messageRowAssistant}
            >
              <div
                className={
                  isUser ? styles.messageStackUser : styles.messageStackAssistant
                }
              >
                <span className={styles.role}>{roleLabel(message.role)}</span>
                <div
                  className={isUser ? styles.bubbleUser : styles.bubbleAssistant}
                >
                  <p className={styles.content}>{messageBody(message)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.composerDock}>
        <form className={styles.composer} onSubmit={handleSubmit} noValidate>
          <input
            className={styles.input}
            type="text"
            value={userText}
            onChange={(e) => setUserText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message the AI…"
            aria-label="Chat message"
            autoComplete="off"
          />
          <button
            className={styles.send}
            type="submit"
            disabled={!userText.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
