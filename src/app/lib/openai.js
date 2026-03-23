const OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions";
const OPEN_AI_KEY = "";

export async function getChatCompletion(messages) {
  const apiKey = OPEN_AI_KEY;
  if (!apiKey) {
    throw new Error("Missing OPEN_AI_KEY (define in .env.local).");
  }

  const res = await fetch(OPENAI_CHAT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string") {
    throw new Error("Unexpected response shape from OpenAI.");
  }
  return content.trim();
}
