import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import CarteAnnonce from "@/components/CarteAnnonce";
import FormulaireAvis from "@/components/FormulaireAvis"; // Importation du formulaire créé au point 4
import Chatbot from "@/components/ChatBot";
import Image from "next/image";

const CarteTouristique = dynamic(
  () => import("@/components/CarteTouristique"),
  { ssr: false },
);

export default function Accueil() {
  const router = useRouter();
  const [recherche, setRecherche] = useState("");
  const [annoncesToutes, setAnnoncesToutes] = useState([]);
  const [sitesTous, setSitesTous] = useState([]);
  const [chargement, setChargement] = useState(true);

  //AJOUTE CET ÉTAT POUR LE TOURISTE CONNECTÉ
  const [idTouristeConnecte] = useState(() => {
    if (typeof window === "undefined") return null;

    const id =
      localStorage.getItem("id_utilisateur") ||
      localStorage.getItem("userId") ||
      localStorage.getItem("id");

    return id ? Number(id) : null;
  });
  // États pour la gestion de la fenêtre modale des avis
  const [annonceSelectionnee, setAnnonceSelectionnee] = useState(null);
  const [avisAnnonce, setAvisAnnonce] = useState([]);

  // Charger les données initiales
  useEffect(() => {
    async function chargerDonnees() {
      try {
        const [resAnnonces, resSites] = await Promise.all([
          fetch("/api/annonces/liste"),
          fetch("/api/sites/liste"), // <-- AJOUTE "/liste" ICI POUR ÉVITER LA 404
        ]);
        if (resAnnonces.ok) setAnnoncesToutes(await resAnnonces.json());
        if (resSites.ok) setSitesTous(await resSites.json());
      } catch (erreur) {
        console.error("Erreur chargement données :", erreur);
      } finally {
        setChargement(false);
      }
    }
    chargerDonnees();
  }, []);
  // Charger les avis dès qu'une annonce est sélectionnée/ouverte
  const chargerAvisAnnonce = async (idAnnonce) => {
    try {
      const res = await fetch(`/api/avis/liste?id_annonce=${idAnnonce}`);
      if (res.ok) {
        const donnees = await res.json();
        setAvisAnnonce(donnees);
      }
    } catch (err) {
      console.error("Erreur chargement avis :", err);
    }
  };

  const ouvrirModaleAvis = (annonce) => {
    setAnnonceSelectionnee(annonce);
    chargerAvisAnnonce(annonce.id_annonce || annonce.id);
  };

  const fermerModaleAvis = () => {
    setAnnonceSelectionnee(null);
    setAvisAnnonce([]);
  };

  // Filtres
  const annoncesFiltrees = annoncesToutes.filter((a) => {
    const terme = recherche.toLowerCase().trim();
    return (
      (a.titre || "").toLowerCase().includes(terme) ||
      (a.site_ville || "").toLowerCase().includes(terme) ||
      (a.region || "").toLowerCase().includes(terme)
    );
  });

  const sitesFiltres = sitesTous.filter((s) => {
    const terme = recherche.toLowerCase().trim();
    return (
      (s.nom || "").toLowerCase().includes(terme) ||
      (s.ville || "").toLowerCase().includes(terme)
    );
  });
  //genere les reservations
  const gererReservation = (annonce) => {
    const idAnnonce = annonce.id_annonce || annonce.id;
    // Redirige vers la nouvelle page de réservation avec l'ID en paramètre URL
    router.push(`/touriste/reserver/${idAnnonce}`);
  };

  // 2. AJOUTE CE EFFECT POUR LIRE LA CLÉ AU CHARGEMENT

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-800">
      {/* HEADER */}
      <header className="bg-white border-b border-neutral-100 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">Le Continant</span>
            <span className="font-black text-lg tracking-tight text-neutral-900">
              L {"'"} Afrique en{" "}
              <span className="text-[#d65a1a]"> Miniature</span>
            </span>
          </div>
          <button
            onClick={() => router.push("/connexion")}
            className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs px-4 py-2 rounded-full border border-red-200"
          >
            Se déconnecter
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <Hero
          recherche={recherche}
          setRecherche={setRecherche}
          suggestions={[]}
        />

        {chargement ? (
          <div className="text-center py-12 text-neutral-500 animate-pulse">
            Chargement de l {"'"} univers TourismeCMR...
          </div>
        ) : (
          <div className="flex flex-col gap-16 mt-12">
            {/* SECTION 1 : ANNONCES RÉSERVABLES */}

            <section>
              <h2 className="text-3xl font-black tracking-tight text-neutral-900 mb-2">
                Escapades et Services Disponibles
              </h2>
              <p className="text-neutral-500 text-sm mb-8">
                Réservez directement des hébergements et formules ou consultez
                les retours d {"'"} expérience.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {annoncesFiltrees.map((item) => (
                  <div
                    key={item.id_annonce || item.id}
                    className="flex flex-col bg-white rounded-3xl p-4 shadow-sm border border-neutral-100"
                  >
                    <CarteAnnonce
                      annonce={item}
                      onReserver={gererReservation}
                    />

                    {/* BOUTON D'ACCÈS AUX AVIS AJOUTÉ ICI */}
                    <button
                      onClick={() => ouvrirModaleAvis(item)}
                      className="mt-3 w-full text-center bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs py-2.5 rounded-xl transition-colors"
                    >
                      Voir les détails & avis
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 2 : CARTE */}
            <div className="w-full relative z-20">
              <h3 className="text-xl font-black text-neutral-800 mb-4">
                Localiser sur la carte
              </h3>
              <div className="rounded-3xl overflow-hidden shadow-md">
                <CarteTouristique sites={sitesFiltres} />
              </div>
            </div>

            {/* SECTION 3 : SITES TOURISTIQUES 360° */}
            <section className="border-t border-neutral-100 pt-12">
              <h2 className="text-2xl font-black text-neutral-800 mb-8">
                Découvrez les merveilles à la une (Vues 360°)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {sitesFiltres.map((site) => (
                  <div
                    key={site.id}
                    className="bg-white rounded-3xl overflow-hidden shadow-sm border border-neutral-100 group"
                  >
                    <Image
                      src={
                        site.image_url ||
                        "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=600&q=80"
                      }
                      alt={site.nom}
                      width={600}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <div className="text-[10px] font-bold text-neutral-400 uppercase">
                        {site.ville}
                      </div>
                      <h3 className="text-lg font-bold text-neutral-800 mt-1">
                        {site.nom}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
      {/* --- AJOUTE LE CHATBOT ICI --- */}

      {/* ================= FENÊTRE MODALE DÉTAILS & AVIS (POINT 4) ================= */}
      {annonceSelectionnee && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-4xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200">
            {/* Partie Gauche : Détails de l'annonce & Formulaire */}
            <div className="p-8 md:w-1/2 border-r border-neutral-100 overflow-y-auto max-h-[45vh] md:max-h-none">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] bg-amber-50 text-[#d65a1a] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {annonceSelectionnee.categorie || "Offre"}
                  </span>
                  <h3 className="text-xl font-black text-neutral-900 mt-2">
                    {annonceSelectionnee.titre}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {annonceSelectionnee.site_ville} —{" "}
                    {annonceSelectionnee.region}
                  </p>
                </div>
                <button
                  onClick={fermerModaleAvis}
                  className="text-neutral-400 hover:text-neutral-600 text-xl font-bold p-1"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm text-neutral-600 mb-6 leading-relaxed">
                {annonceSelectionnee.description}
              </p>

              {/* Le Formulaire d'avis */}
              <FormulaireAvis
                idAnnonce={
                  annonceSelectionnee.id_annonce || annonceSelectionnee.id
                }
                idTouriste={idTouristeConnecte} // <-- AJOUTE CETTE LIGNE ICI
                onAvisAjoute={() =>
                  chargerAvisAnnonce(
                    annonceSelectionnee.id_annonce || annonceSelectionnee.id,
                  )
                }
              />
            </div>

            {/* Partie Droite : Liste des commentaires existants */}
            <div className="p-8 md:w-1/2 bg-neutral-50 flex flex-col overflow-y-auto max-h-[45vh] md:max-h-none">
              <h4 className="text-sm font-black text-neutral-800 mb-4 flex items-center gap-2">
                Commentaires de la communauté ({avisAnnonce.length})
              </h4>

              {avisAnnonce.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-neutral-400 py-12">
                  <p className="text-xs font-medium">
                    Aucun avis pour le moment.
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Soyez le premier à donner votre note !
                  </p>
                </div>
              ) : (
                <div className="space-y-3 overflow-y-auto pr-1">
                  {avisAnnonce.map((av) => (
                    <div
                      key={av.id_avis}
                      className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm"
                    >
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-bold text-neutral-700">
                          Voyageur Anonyme
                        </span>
                        <div className="text-xs text-amber-500">
                          {"".repeat(av.note)}
                        </div>
                      </div>
                      <p className="text-xs text-neutral-600 italic leading-relaxed">
                        {" "}
                        {'"'} {av.commentaire_texte} {'"'}{" "}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Chatbot />
    </div>
  );
}
