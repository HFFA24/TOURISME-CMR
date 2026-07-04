"use client";

import { useState, useEffect, useRef, useMemo } from "react";

export default function BarreRecherche({
  valeur,
  onRecherche,
  sitesDisponibles,
}) {
  const [afficherFlottant, setAfficherFlottant] = useState(false);
  const conteneurRef = useRef(null);

  // Correction : Calcul direct (dérivé) sans useEffect ni état superflu
  const suggestions = useMemo(() => {
    const terme = valeur.toLowerCase().trim();
    if (terme.length < 1) return [];

    const listeFiltree = [];
    const clesUniques = new Set();

    sitesDisponibles.forEach((site) => {
      const options = [
        { type: "Lieu", texte: site.nom, cle: `nom-${site.nom}` },
        { type: "Ville", texte: site.ville, cle: `ville-${site.ville}` },
        { type: "Région", texte: site.region, cle: `region-${site.region}` },
      ];

      options.forEach((opt) => {
        if (
          opt.texte?.toLowerCase().includes(terme) &&
          !clesUniques.has(opt.cle)
        ) {
          clesUniques.add(opt.cle);
          listeFiltree.push({
            type: opt.type,
            texte: opt.texte,
            valeurRecherche: opt.texte,
          });
        }
      });
    });

    return listeFiltree.slice(0, 6);
  }, [valeur, sitesDisponibles]);

  // Fermer la fenêtre flottante si l'utilisateur clique en dehors
  useEffect(() => {
    function cliquerDehors(event) {
      if (
        conteneurRef.current &&
        !conteneurRef.current.contains(event.target)
      ) {
        setAfficherFlottant(false);
      }
    }
    document.addEventListener("mousedown", cliquerDehors);
    return () => document.removeEventListener("mousedown", cliquerDehors);
  }, []);

  const selectionnerSuggestion = (item) => {
    onRecherche(item.valeurRecherche);
    setAfficherFlottant(false);
  };

  return (
    <div
      ref={conteneurRef}
      className="max-w-2xl mx-auto px-4 mb-8 relative z-50"
    >
      <div className="relative flex items-center bg-white rounded-full border border-neutral-200 shadow-sm focus-within:border-[#0b3c26] focus-within:shadow-md transition-all duration-300 p-1">
        <span className="pl-4 text-lg">🔍</span>
        <input
          type="text"
          value={valeur}
          onChange={(e) => {
            onRecherche(e.target.value);
            setAfficherFlottant(true);
          }}
          onFocus={() => setAfficherFlottant(true)}
          placeholder="Où voulez-vous aller ? (Kribi, Douala, Yaoundé...)"
          className="w-full bg-transparent py-3 pl-3 pr-4 rounded-full text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none"
        />
        {valeur && (
          <button
            onClick={() => {
              onRecherche("");
              setAfficherFlottant(false);
            }}
            className="w-8 h-8 flex items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors mr-2 text-xs font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {afficherFlottant && suggestions.length > 0 && (
        <div className="absolute left-4 right-4 mt-2 bg-white rounded-3xl border border-neutral-100 shadow-[0_15px_40px_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="py-2">
            {suggestions.map((item, index) => (
              <button
                key={index}
                onClick={() => selectionnerSuggestion(item)}
                className="w-full text-left px-6 py-3.5 hover:bg-neutral-50 flex items-center justify-between transition-colors duration-150 border-b border-neutral-50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm">
                    {item.type === "Lieu"
                      ? "📍"
                      : item.type === "Ville"
                        ? "🏙️"
                        : "🗺️"}
                  </span>
                  <span className="text-sm font-medium text-neutral-700">
                    {item.texte}
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-400">
                  {item.type}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
