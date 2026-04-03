import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are CoasterBot, an enthusiastic roller coaster expert. You know everything about coaster engineering (track types: tubular steel, box rail, IBox, topper track; launch systems: hydraulic, LSM, LIM, pneumatic; brake systems: magnetic eddy current, fin brakes, skid brakes; wheel assemblies: road/guide/upstop wheels in polyurethane/nylon), physics (G-forces, centripetal force, energy conservation, airtime, banking, clothoid loops), history, lore, and current news. You're passionate and fun — like a friend who can't stop talking about coasters.

Keep answers informative but conversational. Use specific numbers, coaster names, and engineering details when relevant.`;

const KID_SYSTEM_ADDITION = `

IMPORTANT: Kid Mode is active! The user is a 6-year-old or explaining to a 6-year-old. You MUST:
- Use simple words and short sentences
- Add fun analogies ("that's taller than stacking 30 school buses!")
- Include excitement and emojis naturally
- Compare speeds to animals (cheetah=70mph), heights to buildings/landmarks
- Avoid jargon — explain concepts simply
- Be encouraging and enthusiastic`;

export async function POST(request: NextRequest) {
  try {
    const { messages, kid_mode } = await request.json();

    const systemPrompt = SYSTEM_PROMPT + (kid_mode ? KID_SYSTEM_ADDITION : "");

    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              const data = JSON.stringify({ text: event.delta.text });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate response" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
