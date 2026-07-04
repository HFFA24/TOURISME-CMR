import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

// On importe la carte de manière sécurisée pour Next.js
const CarteTouristique = dynamic(
  () => import("../components/CarteTouristique"),
  // Vérifie bien que le nom correspond à ton fichier dans components
  { ssr: false },
);

export default function Accueil() {
  const [recherche, setRecherche] = useState("");
  const [sites, setSites] = useState([]);
  const [chargement, setChargement] = useState(true);

  // Charger les sites dynamiquement depuis l'API
  useEffect(() => {
    async function chargerSites() {
      try {
        const reponse = await fetch("/api/sites/liste");
        if (reponse.ok) {
          const donnees = await reponse.json();
          setSites(donnees);
        }
      } catch (erreur) {
        console.error("Impossible de récupérer les sites", erreur);
      } finally {
        setChargement(false);
      }
    }
    chargerSites();
  }, []);

  // Filtrer les sites selon la recherche de l'utilisateur (par ville ou nom)
  const sitesFiltres = sites.filter(
    (site) =>
      site.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      site.ville.toLowerCase().includes(recherche.toLowerCase()),
  );

  //barre de recherche

  const [afficherFlottant, setAfficherFlottant] = useState(false);
  const barreRef = typeof window !== "undefined" ? useRef(null) : null;

  // Filtrage des suggestions basé sur le tableau global de tes sites (ex: sitesTous)
  const terme = recherche.toLowerCase().trim();
  const suggestions = [];
  const clesUniques = new Set();

  if (terme.length >= 1 && typeof sitesTous !== "undefined") {
    sitesTous.forEach((site) => {
      if (
        site.nom?.toLowerCase().includes(terme) &&
        !clesUniques.has(`nom-${site.nom}`)
      ) {
        clesUniques.add(`nom-${site.nom}`);
        suggestions.push({ type: "Lieu", texte: site.nom });
      }
      if (
        site.ville?.toLowerCase().includes(terme) &&
        !clesUniques.has(`ville-${site.ville}`)
      ) {
        clesUniques.add(`ville-${site.ville}`);
        suggestions.push({ type: "Ville", texte: site.ville });
      }
      if (
        site.region?.toLowerCase().includes(terme) &&
        !clesUniques.has(`region-${site.region}`)
      ) {
        clesUniques.add(`region-${site.region}`);
        suggestions.push({ type: "Région", texte: site.region });
      }
    });
  }

  // Fermeture au clic extérieur
  useEffect(() => {
    function cliquerDehors(event) {
      if (barreRef?.current && !barreRef.current.contains(event.target)) {
        setAfficherFlottant(false);
      }
    }
    document.addEventListener("mousedown", cliquerDehors);
    return () => document.removeEventListener("mousedown", cliquerDehors);
  }, [barreRef]);

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-800">
      {/* SECTION HÉRO */}
      <header className="relative bg-neutral-900 text-white py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-lineair-to-r from-black/80 via-black/50 to-transparent z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80')`,
          }}
        />

        <div className="relative z-20 max-w-4xl mx-auto text-center md:text-left">
          <span className="bg-[#d65a1a] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full text-white shadow-sm">
            Explorez le Cameroun comme jamais auparavant
          </span>
          <h1 className="text-4xl md:text-6xl font-black mt-6 tracking-tight leading-tight">
            Découvrez l {"'"} Afrique en miniature
          </h1>
          <p className="text-lg text-neutral-300 mt-4 max-w-xl font-light">
            Trouvez les meilleurs gîtes éco-responsables, monuments historiques
            et espaces culturels.
          </p>

          {/* BARRE DE RECHERCHE DYNAMIQUE AVEC FENÊTRE FLOTTANTE */}
          <div ref={barreRef} className="relative mt-10 w-full max-w-2xl z-50">
            <div className="bg-white p-2 rounded-2xl md:rounded-3xl shadow-2xl flex flex-col md:flex-row gap-2 border border-neutral-100 transition-all focus-within:border-[#0b3c26]">
              <div className="flex-1 flex items-center gap-3 px-4 py-2">
                <span className="text-neutral-400">🔍</span>
                <input
                  type="text"
                  placeholder="Où voulez-vous aller ? (Kribi, Douala, Yaoundé...)"
                  className="w-full bg-transparent text-neutral-800 text-sm focus:outline-none"
                  value={recherche}
                  onChange={(e) => {
                    setRecherche(e.target.value);
                    setAfficherFlottant(true);
                  }}
                  onFocus={() => setAfficherFlottant(true)}
                />
                {recherche && (
                  <button
                    onClick={() => {
                      setRecherche("");
                      setAfficherFlottant(false);
                    }}
                    className="text-xs font-bold text-neutral-400 hover:text-neutral-600 px-1"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* FENÊTRE FLOTTANTE DE RETOUR */}
            {afficherFlottant && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl md:rounded-3xl border border-neutral-100 shadow-[0_15px_40px_rgba(0,0,0,0.08)] overflow-hidden max-h-64 overflow-y-auto">
                <div className="py-1.5">
                  {suggestions.slice(0, 5).map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setRecherche(item.texte);
                        setAfficherFlottant(false);
                      }}
                      className="w-full text-left px-5 py-3 hover:bg-neutral-50 flex items-center justify-between transition-colors duration-150 border-b border-neutral-50 last:border-0"
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
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 text-neutral-400">
                        {item.type}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* SECTION AFFICHAGE DES SITES TOURISTIQUES */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12 text-center md:text-left">
          <h2 className="text-3xl font-black tracking-tight text-neutral-900">
            Sites touristiques à la une
          </h2>
          <p className="text-neutral-500 text-sm mt-2">
            Les plus belles merveilles du Cameroun publiées par nos
            administrateurs.
          </p>
        </div>

        {chargement ? (
          <div className="text-center py-12 text-neutral-500 text-sm font-medium">
            Chargement des merveilles...
          </div>
        ) : sitesFiltres.length === 0 ? (
          <div className="text-center py-12 text-neutral-400 text-sm border border-dashed border-neutral-200 rounded-3xl bg-white">
            Aucun site touristique ne correspond à votre recherche pour le
            moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {sitesFiltres.map((site) => (
              <div
                key={site.id}
                className="bg-white rounded-3xl overflow-hidden shadow-xl border border-neutral-100 hover:scale-[1.02] transition-all group cursor-pointer flex flex-col"
              >
                {/* Image Cloudinary dynamique */}
                <div className="h-48 w-full bg-neutral-200 relative overflow-hidden">
                  <img
                    src={
                      site.image_url ||
                      "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=600&q=80"
                    }
                    alt={site.nom}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#d65a1a] text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                    {site.categorie}
                  </span>
                </div>

                {/* Infos du Site */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                      {site.ville} ({site.region})
                    </div>
                    <h3 className="text-lg font-bold text-neutral-800 mt-2 group-hover:text-[#d65a1a] transition-colors leading-snug">
                      {site.nom}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-3 leading-relaxed line-clamp-3">
                      {site.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="max-w-6xl mx-auto px-6 py-16">
          {" "}
          {/* C'est ici qu'on affiche la carte */}
          <section className="flex justify-center px-4">
            <CarteTouristique />
          </section>
        </div>
      </main>
    </div>
  );
}
