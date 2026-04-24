"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import styles from "./ChatUI.module.css";

function roleLabel(role) {
  if (role === "user") return "You";
  if (role === "assistant") return "Assistant";
  return role;
}

/** Flatten AI SDK UIMessage text parts for display (including while streaming). */
function textFromParts(message) {
  if (!message?.parts?.length) return "";
  return message.parts
    .filter((p) => p.type === "text")
    .map((p) => p.text)
    .join("");
}

export default function ChatUI() {
  const [userText, setUserText] = useState("");
  const listRef = useRef(null);

  const transport = useMemo(() => new DefaultChatTransport({api: "/api/chatstream"}), []);

  const { messages, sendMessage, status, error, clearError } = useChat({
    transport,
    messages: [
      {
        id: "welcome",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "Hi — ask anything and I will stream replies from the model (LangChain → AI SDK).",
          },
        ],
      },
    ],
  });

  useEffect(() => {
    const el = listRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = userText.trim();
    if (!trimmed) return;
    if (status === "submitted" || status === "streaming") return;

    clearError();
    setUserText("");
    await sendMessage({ text: trimmed });
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  const busy = status === "submitted" || status === "streaming";

  return (
    <div className={styles.chatContainer}>
      <div ref={listRef} className={styles.messagesList} aria-live="polite">
        {messages.map((message) => {
          const isUser = message.role === "user";
          const content = textFromParts(message);
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
                  <p className={styles.content}>{content}</p>
                </div>
              </div>
            </div>
          );
        })}
        {error ? (
          <p className={styles.content} role="alert">
            {error.message}
          </p>
        ) : null}
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
            disabled={!userText.trim() || busy}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
