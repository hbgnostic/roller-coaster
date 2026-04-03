"use client";

import { useState, useRef, useEffect } from "react";
import { useMode } from "@/lib/ModeContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AiChat() {
  const { kidMode } = useMode();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, kid_mode: kidMode }),
      });

      if (!res.ok) throw new Error("Chat request failed");

      // Streaming
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          // Parse SSE data lines
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  assistantText += parsed.text;
                  setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { role: "assistant", content: assistantText };
                    return updated;
                  });
                }
              } catch {
                // partial JSON, skip
              }
            }
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Oops! I hit a bump on the track. Try again!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="chat" className="py-20 px-4 max-w-2xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-black text-center mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        {kidMode ? "🤖 Ask CoasterBot!" : "AI Coaster Expert"}
      </h2>
      <p className="text-center text-purple-300 mb-8">
        {kidMode
          ? "Ask me ANYTHING about roller coasters!"
          : "Powered by Claude — ask about engineering, physics, history, or lore"}
      </p>

      <div className="bg-gray-900/80 border border-purple-500/20 rounded-2xl overflow-hidden flex flex-col" style={{ height: "500px" }}>
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-purple-400 mt-12">
              <p className="text-4xl mb-3">🎢</p>
              <p className="text-sm">
                {kidMode
                  ? "Hi! I'm CoasterBot! Ask me anything about roller coasters!"
                  : "Ask about track engineering, launch systems, G-forces, coaster history, or anything else."}
              </p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-purple-600 text-white rounded-br-md"
                    : "bg-gray-800 text-purple-100 rounded-bl-md border border-purple-500/10"
                }`}
              >
                {m.role === "assistant" && (
                  <span className="text-xs font-bold text-pink-400 block mb-1">CoasterBot</span>
                )}
                <p className="whitespace-pre-wrap">{m.content}</p>
              </div>
            </div>
          ))}
          {loading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex justify-start">
              <div className="bg-gray-800 rounded-2xl rounded-bl-md px-4 py-3 border border-purple-500/10">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-purple-500/20">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={kidMode ? "Ask me something cool! 🎢" : "Ask about roller coasters..."}
              className="flex-1 bg-gray-800 border border-purple-500/20 rounded-xl px-4 py-3 text-white placeholder-purple-400/50 focus:outline-none focus:border-pink-500/50 text-sm"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold hover:from-pink-400 hover:to-purple-400 disabled:opacity-40 transition-all"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
