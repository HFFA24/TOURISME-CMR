"use client";

export default function CarteAnnonce({ annonce, onReserver }) {
  const imageDefaut =
    "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=600";

  // Si l'objet est complètement absent, on affiche le squelette de chargement
  if (!annonce) {
    return (
      <div className="animate-pulse bg-neutral-100 rounded-3xl h-80 w-full" />
    );
  }

  // Double vérification des propriétés (Table annonce VS Table site_touristique)
  const titreAnnonce =
    annonce.titre || annonce.nom || "Escapade Écotouristique";
  const descriptionAnnonce =
    annonce.description || "Découvrez ce lieu magnifique au cœur du Cameroun.";
  const prixAnnonce = annonce.prix_unitaire || annonce.prix || 15000;
  const imageAnnonce =
    annonce.image_principale_url || annonce.image_url || imageDefaut;
  const villeAnnonce = annonce.site_ville || annonce.ville || "Cameroun";
  const regionAnnonce = annonce.region || "Littoral";

  return (
    <div className="bg-white rounded-3xl border border-neutral-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col group hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-all duration-300 font-sans">
      {/* Zone Image */}
      <div className="relative h-48 w-full overflow-hidden bg-neutral-100">
        <img
          src={imageAnnonce}
          alt={titreAnnonce}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = imageDefaut;
          }} // Sécurité si l'URL dans la DB est cassée
        />
        <div className="absolute top-4 left-4">
          <span className="bg-[#0b3c26] text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
            {annonce.categorie || "Écotourisme"}
          </span>
        </div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-neutral-800 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
          ⭐ 4.8
        </div>
      </div>

      {/* Corps du texte */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide block mb-1">
            🏙️ {villeAnnonce} ({regionAnnonce})
          </span>
          <h3 className="font-serif font-extrabold text-neutral-800 text-base line-clamp-1 group-hover:text-[#0b3c26] transition-colors">
            {titreAnnonce}
          </h3>
          <p className="text-neutral-500 text-xs font-medium line-clamp-2 mt-1.5 leading-relaxed">
            {descriptionAnnonce}
          </p>
        </div>

        {/* Prix et Bouton */}
        <div className="border-t border-neutral-50 pt-4 flex items-center justify-between gap-2">
          <div>
            <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">
              Tarif unique
            </span>
            <span className="text-sm font-black text-[#d65a1a]">
              {Number(prixAnnonce).toLocaleString()} FCFA
            </span>
          </div>

          <button
            onClick={() => onReserver(annonce)}
            className="bg-[#0b3c26] hover:bg-[#e77a3d] text-white text-[10px] font-black uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all duration-300"
          >
            Réserver
          </button>
        </div>
      </div>
    </div>
  );
}
