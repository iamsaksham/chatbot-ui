"use client";

import { useEffect, useRef, useState } from "react";
// import { getChatCompletion } from "@/lib/openai";
import styles from "./ChatUI.module.css";

function roleLabel(role) {
  if (role === "user") return "You";
  if (role === "assistant") return "Assistant";
  return role;
}

export default function ChatUI() {
  const [userText, setUserText] = useState("");
  const [messagesList, setMessagesList] = useState([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "Hi — ask anything and I will reply using OpenAI.",
    },
  ]);
  const listRef = useRef(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messagesList]);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = userText.trim();
    if (!trimmed) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };
    const updatedMessagesList = [...messagesList, userMessage];
    setMessagesList(updatedMessagesList);
    setUserText("");

    const apiMessages = updatedMessagesList.map(({ role, content }) => ({ role, content }));

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: apiMessages }),
    });

    const payload = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg =
        typeof payload.error === "string"
          ? payload.error
          : `Chat request failed (${res.status}).`;
      throw new Error(msg);
    }

    const assistantText = payload?.response?.output_text;
    if (typeof assistantText !== "string") {
      throw new Error("Unexpected response from chat API.");
    }

    setMessagesList((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: assistantText.trim(),
      },
    ]);
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
                  <p className={styles.content}>{message.content}</p>
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
