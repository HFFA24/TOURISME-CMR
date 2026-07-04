// AJOUTE CETTE LIGNE TOUT EN HAUT :
import { useState } from "react";

// 1. Modifie la première ligne pour inclure "idTouriste" dans les paramètres (props)
export default function FormulaireAvis({
  idAnnonce,
  idTouriste,
  onAvisAjoute,
}) {
  const [note, setNote] = useState(5);
  const [commentaire, setCommentaire] = useState("");
  const [enCours, setEnCours] = useState(false);

  const soumettreAvis = async (e) => {
    e.preventDefault();
    setEnCours(true);

    try {
      const reponse = await fetch("/api/avis/ajouter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_annonce: idAnnonce,
          id_touriste: idTouriste, // 2. CORRECTION ICI : On envoie la prop reçue au lieu d'une variable inconnue
          note: note,
          commentaire_texte: commentaire,
        }),
      });

      if (reponse.ok) {
        alert("Merci d'avoir partagé votre expérience !");
        setCommentaire("");
        setNote(5);
        if (onAvisAjoute) onAvisAjoute();
      } else {
        const errData = await reponse.json();
        alert(`Erreur : ${errData.error || "Impossible d'enregistrer l'avis"}`);
      }
    } catch (erreur) {
      console.error("Erreur lors de l'envoi :", erreur);
      alert("Une erreur réseau est survenue.");
    } finally {
      setEnCours(false);
    }
  };

  // ... (le reste de ton code de rendu du formulaire reste identique)

  return (
    <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm max-w-lg mx-auto">
      <h3 className="text-lg font-black text-neutral-900 mb-2">
        Partagez votre avis
      </h3>
      <p className="text-neutral-500 text-xs mb-4">
        Votre retour aide la communauté TourismeCMR et permet aux prestataires d{" "}
        {"'"} améliorer leurs services.
      </p>

      <form onSubmit={soumettreAvis} className="space-y-4">
        {/* Sélection de la note par étoiles */}
        <div>
          <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
            Note de l {"'"} expérience
          </label>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((etoile) => (
              <button
                key={etoile}
                type="button"
                onClick={() => setNote(etoile)}
                className="text-2xl transition-transform active:scale-90 focus:outline-none"
              >
                {etoile <= note ? "⭐" : "☆"}
              </button>
            ))}
          </div>
        </div>

        {/* Zone de texte pour le commentaire */}
        <div>
          <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
            Votre commentaire
          </label>
          <textarea
            rows="4"
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            placeholder="Qu'avez-vous pensé de l'accueil, de la propreté, du service ?"
            className="w-full text-sm px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:border-[#d65a1a] transition-colors resize-none"
            required
          />
        </div>

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={enCours}
          className="w-full bg-neutral-950 hover:bg-[#d65a1a] text-white font-bold text-xs tracking-wider uppercase py-3.5 rounded-xl transition-all shadow-sm disabled:opacity-50"
        >
          {enCours ? "Envoi de votre note..." : "Publier mon avis"}
        </button>
      </form>
    </div>
  );
}
