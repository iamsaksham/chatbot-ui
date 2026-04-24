import { NextResponse } from "next/server";

import { toBaseMessages, toUIMessageStream } from "@ai-sdk/langchain";
import { ChatOpenAI } from "@langchain/openai";
import { createUIMessageStreamResponse } from "ai";

export const maxDuration = 30;

export async function POST(req) {
  try {
    const apiKey =
      process.env.OPENAI_API_KEY ?? process.env.OPEN_AI_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Missing OPENAI_API_KEY or OPEN_AI_KEY. Set one in .env.local, then restart `next dev`.",
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { messages } = body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Request body must include a non-empty messages array." },
        { status: 400 }
      );
    }

    const model = new ChatOpenAI({
      apiKey,
      model: "gpt-4o-mini",
      temperature: 0,
    });

    const langchainMessages = await toBaseMessages(messages);
    const stream = await model.stream(langchainMessages);

    return createUIMessageStreamResponse({
      stream: toUIMessageStream(stream),
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
