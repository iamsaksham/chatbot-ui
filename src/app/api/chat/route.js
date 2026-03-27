import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const OPEN_AI_KEY = process.env.OPEN_AI_KEY;
    if (!OPEN_AI_KEY) {
      return NextResponse.json(
        {
          error:
            "Missing OPEN_AI_KEY. Set OPEN_AI_KEY in .env.local at the project root, then restart `next dev`.",
        },
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey: OPEN_AI_KEY });

    // The 'messages' variable is the user's input from the frontend
    const body = await req.json();
    const { messages } = body;

    // Here is where we communicate with the OpenAI API to create our chatbot.
    // We store the chatbot's response in the 'response' variable
    const response = await client.responses.create({
      model: "gpt-4o-mini",
      // reasoning: { effort: "low" },
      instructions: "Talk like a pirate.",
      temperature: 0.7,
      // We add a value for max_tokens to ensure the response won't exceed 300 tokens
      // This is to make sure the responses aren't too long
      // max_tokens: 300,
      input: messages,
    });
    // Then we return the response we receive from OpenAI
    // Note: This will only work once we set up our frontend logic
    return NextResponse.json({ response: response });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
