"use client";

import { useState, useRef, useEffect } from "react";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Bonjour 👋 Je suis l'assistant IA de TourismeCMR. Comment puis-je vous aider ?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    const texte = input.trim();
    if (!texte || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: texte }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        `http://127.0.0.1:3005/chat?user_id=visiteur&message=${encodeURIComponent(texte)}`,
      );

      if (!res.ok) throw new Error("Erreur serveur");

      const data = await res.json();

      // Amélioration de l'affichage pour le format itinéraire
      let botText = data.bot_response || "Je n'ai pas compris votre demande.";
      if (data.type === "itinerary" && data.data) {
        const d = data.data;
        botText =
          `🎯 ${d.trip_name || "Itinéraire suggéré"}:\n\n` +
          d.days
            .map((day) => `Jour ${day.day}: ${day.activity} (${day.meal})`)
            .join("\n");
      }

      setMessages((prev) => [...prev, { role: "bot", text: botText }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "❌ Impossible de contacter le serveur IA. Vérifiez qu'il est bien lancé.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-lineair-to-br from-green-800 to-green-600 text-white shadow-xl hover:scale-105 transition-all duration-300 text-2xl"
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-96 h-560px bg-white rounded-3xl shadow-2xl border overflow-hidden flex flex-col animate-slide-up">
          <div className="bg-green-900 text-white p-4">
            <h3 className="font-bold text-lg">Assistant IA TourismeCMR</h3>
            <p className="text-xs opacity-80">
              Posez vos questions sur le Cameroun 🇨🇲
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-neutral-50 space-y-3">
            {messages.map((m, index) => (
              <div
                key={index}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-blue-600 text-white rounded-br-md"
                      : "bg-white border text-neutral-700 rounded-bl-md shadow-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-sm italic text-neutral-500 pl-4">
                L {"'"} IA réfléchit...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={sendMessage}
            className="border-t bg-white p-3 flex gap-2"
          >
            <input
              type="text"
              value={input}
              placeholder={
                loading ? "Veuillez patienter..." : "Écrivez votre message..."
              }
              disabled={loading}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-green-700 disabled:bg-neutral-100"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-green-900 hover:bg-green-800 disabled:opacity-50 text-white px-5 rounded-full font-semibold transition"
            >
              {loading ? "..." : "Envoyer"}
            </button>
          </form>
        </div>
      )}

      <style jsx>{`
        .animate-slide-up {
          animation: slideUp 0.25s ease;
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0px);
          }
        }
      `}</style>
    </div>
  );
}
