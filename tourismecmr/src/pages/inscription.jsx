import { useState } from "react";
import "../app/globals.css";

export default function Inscription() {
  const [role, setRole] = useState("touriste"); // 'touriste' ou 'prestataire'
  const [formData, setFormData] = useState({
    email: "",
    mot_de_passe: "",
    numero_telephone: "",
    nom: "",
    prenom: "",
    nom_entreprise: "",
    categorie_prestation: "Gîte Éco-responsable / Chambre d'hôte",
    zone_geographique: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const donneesAEnvoyer = {
      email: formData.email,
      mot_de_passe: formData.mot_de_passe,
      numero_telephone: formData.numero_telephone,
      role: role === "touriste" ? "touriste" : "prestataire", //  CORRIGÉ : 'prestataire' au lieu de 'prestataire_hebergement'
      nom: role === "touriste" ? formData.nom : null,
      prenom: role === "touriste" ? formData.prenom : null,
      nom_entreprise: role === "prestataire" ? formData.nom_entreprise : null,
      categorie: role === "prestataire" ? formData.categorie_prestation : null,
      region: role === "prestataire" ? formData.zone_geographique : "Littoral",
    };

    const reponse = await fetch("/api/inscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(donneesAEnvoyer),
    });

    const resultat = await reponse.json();

    if (reponse.ok) {
      alert("Inscription réussie sur la plateforme !");

      setFormData({
        email: "",
        mot_de_passe: "",
        numero_telephone: "",
        nom: "",
        prenom: "",
        nom_entreprise: "",
        categorie_prestation: "Gîte Éco-responsable / Chambre d'hôte",
        zone_geographique: "",
      });

      e.target.reset();
    } else {
      alert(`Erreur : ${resultat.error}`);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-neutral-100 w-full max-w-xl">
        <h3 className="text-xs uppercase tracking-widest text-center font-bold text-neutral-500 mb-6">
          Quel est votre profil ?
        </h3>

        {/* Sélecteur de profil */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            type="button"
            onClick={() => setRole("touriste")}
            className={`p-5 rounded-2xl border text-center flex flex-col items-center justify-center transition-all ${
              role === "touriste"
                ? "border-emerald-700 bg-emerald-50/30 ring-2 ring-emerald-700/20 text-emerald-900 font-semibold"
                : "border-neutral-200 hover:border-neutral-300 text-neutral-600"
            }`}
          >
            <span className="text-xs sm:text-sm">
              Je suis un Touriste (Voyageur)
            </span>
          </button>

          <button
            type="button"
            onClick={() => setRole("prestataire")}
            className={`p-5 rounded-2xl border text-center flex flex-col items-center justify-center transition-all ${
              role === "prestataire"
                ? "border-emerald-700 bg-emerald-50/30 ring-2 ring-emerald-700/20 text-emerald-900 font-semibold"
                : "border-neutral-200 hover:border-neutral-300 text-neutral-600"
            }`}
          >
            <span className="text-xl mb-2">🧳</span>
            <span className="text-xs sm:text-sm">
              Je suis un Prestataire Local <br />
              <span className="text-[11px] font-normal text-neutral-500">
                (Guide, Hébergement, Artisan)
              </span>
            </span>
          </button>
        </div>

        {/* Formulaire Principal */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {role === "touriste" ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide mb-1">
                  Nom
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="nom"
                    required
                    value={formData.nom} //  AJOUTÉ
                    onChange={handleChange}
                    placeholder="Ex: Ndoumbe"
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide mb-1">
                  Prénom
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-400">
                    👤
                  </span>
                  <input
                    type="text"
                    name="prenom"
                    required
                    value={formData.prenom} //  AJOUTÉ
                    onChange={handleChange}
                    placeholder="Ex: Armel"
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide mb-1">
                Nom Complet de l{"'"}Établissement / Structure
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-400">
                  🏢
                </span>
                <input
                  type="text"
                  name="nom_entreprise"
                  required
                  value={formData.nom_entreprise} //  AJOUTÉ
                  onChange={handleChange}
                  placeholder="Ex: Kribi Éco-Lodge, Hôtel K-Town"
                  className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* Email et Téléphone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide mb-1">
                Adresse Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-400">
                  ✉️
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email} //  AJOUTÉ
                  onChange={handleChange}
                  placeholder="Adresse Email"
                  className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide mb-1">
                Numéro de Téléphone (Orange / MTN)
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="numero_telephone"
                  required
                  value={formData.numero_telephone} //  AJOUTÉ
                  onChange={handleChange}
                  placeholder="Ex: 699112233"
                  className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Options spécifiques pour Prestataires */}
          {role === "prestataire" && (
            <div className="p-4 bg-neutral-50 border border-neutral-100 rounded-2xl space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide mb-1">
                  Catégorie de Prestation
                </label>
                <select
                  name="categorie_prestation"
                  value={formData.categorie_prestation}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                >
                  <option value="Guide-touristique">Guide touristique</option>
                  <option value="prestataire_hebergement">
                    prestataire_hebergement
                  </option>
                  <option value="Hotel">Hotel</option>
                  <option value="Artisanat">
                    Boutique d{"'"}Artisanat local
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide mb-1">
                  Zone Géographique Administrative (Localisation)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-400"></span>
                  <input
                    type="text"
                    name="zone_geographique"
                    required
                    value={formData.zone_geographique} // AJOUTÉ
                    onChange={handleChange}
                    placeholder="Ex: Kribi, Buea, Foumban, Douala"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Mot de Passe */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type="password"
                name="mot_de_passe"
                required
                value={formData.mot_de_passe} //  AJOUTÉ
                onChange={handleChange}
                placeholder="•••••••• (6 caractères minimum)"
                className="w-full pl-9 pr-10 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#d65a1a] text-white py-3 rounded-xl font-bold text-sm tracking-wide shadow-md hover:bg-[#be4e14] active:scale-[0.99] transition-all flex items-center justify-center gap-1 mt-6"
          >
            S{"'"}hôteinscrire sur la plateforme <span>➔</span>
          </button>
        </form>
      </div>
    </div>
  );
}
