import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function PageReservation() {
  const router = useRouter();
  const { id } = router.query; // Récupère l'ID de l'annonce depuis l'URL

  const [annonce, setAnnonce] = useState(null);
  const [avisList, setAvisList] = useState([]);
  const [nbParticipants, setNbParticipants] = useState(1);
  const [dateReservation, setDateReservation] = useState("2026-07-17");
  const [chargement, setChargement] = useState(true);

  // LE HOOK DOIT ÊTRE ICI !
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Charger les détails de l'annonce et ses avis
  useEffect(() => {
    if (!id) return;

    async function chargerDetails() {
      try {
        const resAnnonces = await fetch("/api/annonces/liste");
        const resAvis = await fetch(`/api/avis/liste?id_annonce=${id}`);

        // --- SUPPRIME LA LIGNE QUI ÉTAIT ICI ---
        // const [isModalOpen, setIsModalOpen] = useState(false); // <--- C'EST CELA QUI BLOQUAIT TOUT

        if (resAnnonces.ok) {
          const annonces = await resAnnonces.json();
          const trouvee = annonces.find(
            (a) => (a.id_annonce || a.id) === parseInt(id, 10),
          );
          setAnnonce(trouvee);
        }
        if (resAvis.ok) {
          setAvisList(await resAvis.json());
        }
      } catch (err) {
        console.error("Erreur lors du chargement des détails :", err);
      } finally {
        setChargement(false);
      }
    }

    chargerDetails();
  }, [id]);

  if (chargement) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 text-neutral-500 animate-pulse">
        Chargement de votre espace de réservation...
      </div>
    );
  }

  if (!annonce) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 gap-4">
        <p className="text-sm font-medium text-neutral-600">
          Escapade introuvable.
        </p>
        <button
          onClick={() => router.push("/touriste")}
          className="text-xs bg-neutral-900 text-white px-4 py-2 rounded-xl"
        >
          Retour à l {"'"} accueil
        </button>
      </div>
    );
  }

  // Calculs dynamiques basés sur ton modèle d'image
  const prixUnitaire = parseInt(annonce.prix_unitaire || 40000, 10);
  const totalProvisoire = prixUnitaire * nbParticipants;

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-800 pb-12">
      {/* Barre de navigation simplifiée */}
      <header className="bg-white border-b border-neutral-100 px-6 py-4 mb-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button
            onClick={() => router.push("/touriste")}
            className="text-xs font-bold text-neutral-500 hover:text-neutral-800 flex items-center gap-1"
          >
            ← Retour aux escapades
          </button>
          <span className="font-black text-sm tracking-tight">
            Tourisme<span className="text-[#d65a1a]">CMR</span>
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* ================= COLONNE GAUCHE : INFOS & AVIS VÉRIFIÉS ================= */}
        <div className="md:col-span-2 bg-white rounded-[32px] p-8 border border-neutral-100 shadow-sm space-y-6">
          <div>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              EXPLORATION ACTIVE • {annonce.region || "SUD"}
            </span>
            <h1 className="text-3xl font-black text-neutral-900 mt-2 leading-tight">
              {annonce.titre}
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              {annonce.site_ville} — Cameroun
            </p>
          </div>

          <p className="text-sm text-neutral-600 leading-relaxed bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
            {annonce.description}
          </p>

          <hr className="border-neutral-100" />

          {/* Section Avis de la communauté (image_c5a44c.png) */}
          <div>
            <h3 className="text-lg font-black text-neutral-800 mb-2 flex items-center gap-2">
              📂 Avis vérifiés de la communauté ({avisList.length})
            </h3>
            <p className="text-xs text-neutral-400 mb-6">
              Consultez les retours d{"'"}expérience rédigés par notre
              communauté.
            </p>

            {avisList.length === 0 ? (
              <div className="text-center py-10 text-neutral-400 border border-dashed rounded-2xl bg-neutral-50 text-xs">
                Aucun avis n {"'"} a encore été laissé pour cette offre.
              </div>
            ) : (
              <div className="space-y-4">
                {avisList.map((av) => (
                  <div
                    key={av.id_avis}
                    className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-neutral-700">
                        Voyageur Éthique
                      </span>
                      <div className="text-xs text-amber-500">
                        {"⭐".repeat(av.note)}
                      </div>
                    </div>
                    <p className="text-xs text-neutral-600 italic">
                      {"'"}
                      {av.commentaire_texte}
                      {"'"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ================= COLONNE DROITE : TICKET DE RÉSERVATION (STICKY) ================= */}
        <div className="bg-white rounded-[32px] p-8 border border-neutral-100 shadow-sm h-fit sticky top-24 flex flex-col gap-6">
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-black text-neutral-900">
              {prixUnitaire.toLocaleString()} FCFA
            </span>
            <span className="text-xs text-neutral-400">/ par jour</span>
          </div>
          <div className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-2 rounded-xl w-fit">
            ⭐ Note : 4.8 • {avisList.length} avis
          </div>
          <hr className="border-neutral-100" />
          {/* Configuration du voyage */}
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                ★ Calendrier de disponibilité
              </label>
              <input
                type="date"
                value={dateReservation}
                onChange={(e) => setDateReservation(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 text-xs p-3.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                ★ Nombre de participants
              </label>
              <div className="flex items-center justify-between bg-neutral-50 border border-neutral-200 rounded-xl p-1.5">
                <button
                  onClick={() =>
                    setNbParticipants((prev) => Math.max(1, prev - 1))
                  }
                  className="w-9 h-9 font-bold text-neutral-500 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                >
                  -
                </button>
                <span className="text-sm font-black text-neutral-800">
                  {nbParticipants}
                </span>
                <button
                  onClick={() => setNbParticipants((prev) => prev + 1)}
                  className="w-9 h-9 font-bold text-neutral-500 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          {/* Ticket Provisoire Dynamique */}
          <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4 space-y-2.5 text-xs">
            <div className="flex justify-between text-neutral-500">
              <span>Base tarif ({nbParticipants} pers)</span>
              <span>{totalProvisoire.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between text-emerald-600 font-medium">
              <span>Taxe d {"'"} éco-séjour</span>
              <span className="uppercase text-[9px] font-black bg-emerald-100/60 px-1.5 py-0.5 rounded text-emerald-800">
                Offerte
              </span>
            </div>
            <hr className="border-neutral-200/60 my-1" />
            <div className="flex justify-between font-black text-neutral-900 text-sm">
              <span>TOTAL PROVISOIRE</span>
              <span>{totalProvisoire.toLocaleString()} FCFA</span>
            </div>
          </div>
          {/* Bouton d'action final */}
          <button
            onClick={() => setIsModalOpen(true)} // Ouvre la fenêtre de paiement
            className="w-full bg-[#0d3b26] hover:bg-[#072416] active:scale-[0.99] text-white font-bold text-xs py-4 rounded-xl shadow-md transition-all uppercase tracking-wider"
          >
            🧳 Réserver cette expérience
          </button>
          {/*Ajoute la modale conditionnelle en bas du JSX*/}
          {/* ========================================================================= */}
          {/* 💳 MODALE DE PAIEMENT SÉCURISÉ (Copie fidèle du design image_c6e817.png)  */}
          {/* ========================================================================= */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="bg-white rounded-[28px] w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-150">
                {/* COLONNE GAUCHE : RÉCAPITULATIF BEIGE (DESIGN IMAGE_C6E817.PNG) */}
                <div className="md:w-[42%] bg-[#f7f5f0] p-7 flex flex-col justify-between border-r border-neutral-100">
                  <div className="space-y-5">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] bg-neutral-200/70 text-neutral-700 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        RÉCAPITULATIF
                      </span>
                      <span className="text-[11px] text-[#d65a1a] font-bold flex items-center gap-1">
                        🛡️ Sécurisé
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-neutral-900 leading-snug">
                        {annonce.titre}
                      </h3>
                      <p className="text-xs text-neutral-500 flex items-center gap-1 mt-1">
                        📍 {annonce.site_ville || "Cameroun"}
                      </p>
                    </div>

                    <div className="space-y-2.5 pt-2 text-xs border-t border-neutral-200/60">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Date</span>
                        <span className="font-bold text-neutral-800">
                          {dateReservation}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Voyageurs</span>
                        <span className="font-bold text-neutral-800">
                          {nbParticipants} pers.
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Prix unitaire</span>
                        <span className="font-bold text-neutral-800">
                          {prixUnitaire.toLocaleString("fr-FR")} F CFA
                        </span>
                      </div>
                    </div>

                    <div className="bg-neutral-200/40 rounded-xl p-3.5 space-y-1.5 text-[11px]">
                      <div className="flex justify-between text-neutral-500">
                        <span>💼 Commission (10%)</span>
                        <span className="font-medium">
                          {(totalProvisoire * 0.1).toLocaleString("fr-FR")} FCFA
                        </span>
                      </div>
                      <div className="flex justify-between text-neutral-400 border-t border-neutral-200/50 pt-1.5">
                        <span>Part prestataire :</span>
                        <span>
                          {(totalProvisoire * 0.9).toLocaleString("fr-FR")} FCFA
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-neutral-200/60 mt-6">
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-xs font-black text-neutral-800 max-w-[140px] leading-tight">
                        Montant total éco-solidaire
                      </span>
                      <span className="text-2xl font-black text-[#d65a1a]">
                        {totalProvisoire.toLocaleString("fr-FR")} FCFA
                      </span>
                    </div>
                  </div>
                </div>

                {/* COLONNE DROITE : SÉLECTION PAIEMENT */}
                <div className="md:w-[58%] p-8 flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-base font-black text-neutral-900 tracking-tight">
                      Mode de paiement sécurisé
                    </h2>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="text-xs font-bold text-neutral-400 hover:text-neutral-700 bg-neutral-100 px-3 py-1.5 rounded-xl"
                    >
                      Fermer
                    </button>
                  </div>

                  {/* Formulaire de paiement simplifié */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-3">
                      <button className="py-3 rounded-xl border-2 border-orange-500 bg-orange-50 text-orange-600 font-bold text-xs">
                        Orange Money
                      </button>
                      <button className="py-3 rounded-xl border-2 border-neutral-200 text-neutral-500 font-bold text-xs">
                        MTN MoMo
                      </button>
                    </div>

                    <input
                      type="tel"
                      placeholder="677xxxxxx"
                      className="w-full text-xs px-4 py-3 border border-neutral-200 rounded-xl outline-none"
                    />

                    <button
                      onClick={async () => {
                        try {
                          const response = await fetch(
                            "/api/paiement/simuler",
                            {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                id_reservation: annonce.id, // ou l'ID généré de ta réservation
                                methode_paiement: "Orange Money",
                                montant_paye: totalProvisoire,
                                commission_plateforme: totalProvisoire * 0.1,
                                statut: "succès",
                              }),
                            },
                          );

                          if (response.ok) {
                            alert(
                              "Paiement simulé et transaction enregistrée !",
                            );
                            setIsModalOpen(false);
                          }
                        } catch (e) {
                          alert("Erreur lors de la simulation");
                        }
                      }}
                      className="w-full bg-[#d65a1a] text-white font-black py-4 rounded-xl uppercase"
                    >
                      Confirmer le règlement ({totalProvisoire.toLocaleString()}{" "}
                      FCFA)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <p className="text-[10px] text-neutral-400 text-center leading-relaxed">
            Annulation gratuite jusqu {"'"} à 48h à l {"'"} avance.
            <br />
            Paiement sécurisé via Orange Money & MTN MoMo.
          </p>
        </div>
      </main>
    </div>
  );
}
