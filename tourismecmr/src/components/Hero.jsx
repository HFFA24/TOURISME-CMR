"use client";

import { useState, useRef } from "react";

export default function Hero() {
  // 1. Déclaration de tous les états nécessaires localement
  const [afficherFlottant, setAfficherFlottant] = useState(false);
  const [recherche, setRecherche] = useState("");
  const [suggestions] = useState([
    { texte: "Kribi", type: "Ville" },
    { texte: "Mont Cameroun", type: "Lieu" },
    { texte: "Parc de Waza", type: "Lieu" },
  ]);
  const barreRef = useRef(null);

  // Dans src/components/Hero.jsx
  const handleSearch = async (vibe) => {
    const response = await fetch(
      `http://localhost:8000/recommend-vibe?preference=${vibe}`,
    );
    const data = await response.json();
    console.log(data.recommended_site); // Affiche la recommandation de l'IA
  };

  return (
    <div className="relative min-h-[75vh] w-full flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-neutral-900">
      {/* Arrière-plan */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 scale-105 transition-transform duration-1000"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1920')",
        }}
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/50 via-transparent to-[#faf9f6]" />

      {/* Contenu */}
      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-4">
        <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-white/20">
          Écotourisme Solidaire au Cameroun
        </span>

        <h1 className="font-serif text-3xl md:text-5xl font-extrabold text-white leading-tight">
          Découvrez les merveilles au cœur de l {"'"} Afrique
        </h1>

        <div
          ref={barreRef}
          className="relative mt-8 w-full max-w-2xl z-50 px-2 md:px-0"
        >
          <div className="bg-white p-2 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center gap-3 px-4 py-2">
              <span className="text-neutral-400">🔍</span>
              <input
                type="text"
                placeholder="Où voulez-vous aller ?"
                className="w-full bg-transparent text-neutral-800 text-sm font-medium focus:outline-none"
                value={recherche}
                onChange={(e) => {
                  setRecherche(e.target.value);
                  setAfficherFlottant(true);
                }}
                onFocus={() => setAfficherFlottant(true)}
              />
            </div>
            <button className="bg-[#0b3c26] text-white text-xs font-bold uppercase px-6 py-3 rounded-xl md:rounded-full">
              Explorer
            </button>
          </div>

          {/* Fenêtre flottante */}
          {afficherFlottant && suggestions.length > 0 && (
            <div className="absolute left-2 right-2 md:left-0 md:right-0 mt-2 bg-white rounded-2xl border shadow-xl max-h-64 overflow-y-auto">
              {suggestions.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setRecherche(item.texte);
                    setAfficherFlottant(false);
                  }}
                  className="w-full text-left px-5 py-3 hover:bg-neutral-50 flex justify-between"
                >
                  <span className="text-sm font-semibold text-neutral-700">
                    {item.texte}
                  </span>
                  <span className="text-[9px] font-bold bg-neutral-100 px-2 py-0.5 rounded">
                    {item.type}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
