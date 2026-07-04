/* eslint-disable @next/next/no-img-element */
import Script from "next/script";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function AdminDashboard() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    region: "Littoral",
    ville: "",
    categorie: "En-plein-air",
    image_url: "", // Reçoit l'URL générée par Cloudinary
  });
  const [statut, setStatut] = useState({ type: "", message: "" });
  const [chargementImage, setChargementImage] = useState(false);

  // Configuration Cloudinary
  const CLOUD_NAME = "dv9r8k76b";
  const UPLOAD_PRESET = "ml_default";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Gestion de la déconnexion de l'administrateur
  const deconnexionAdmin = async () => {
    try {
      // Nettoyage des données locales si présentes (localStorage, cookies...)
      localStorage.removeItem("admin_token");

      router.push("/");
    } catch (err) {
      console.error("Erreur lors de la déconnexion :", err);
    }
  };

  // Fonction pour ouvrir le widget Cloudinary
  const ouvrirWidgetCloudinary = () => {
    if (window.cloudinary) {
      setChargementImage(true);
      const myWidget = window.cloudinary.createUploadWidget(
        {
          cloudName: CLOUD_NAME,
          uploadPreset: UPLOAD_PRESET,
          sources: ["local", "url", "camera"],
          multiple: false,
          theme: "minimal",
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            setFormData((prev) => ({
              ...prev,
              image_url: result.info.secure_url,
            }));
            setChargementImage(false);
          } else if (error) {
            setChargementImage(false);
          }
        },
      );
      myWidget.open();
    } else {
      alert(
        "Le script Cloudinary n'est pas encore chargé. Réessayez dans une seconde.",
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatut({ type: "", message: "" });

    if (!formData.image_url) {
      setStatut({
        type: "error",
        message: "Veuillez téléverser une image avant de publier le site.",
      });
      return;
    }

    const reponse = await fetch("/api/sites/ajouter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const resultat = await reponse.json();

    if (reponse.ok) {
      setStatut({ type: "success", message: resultat.message });
      setFormData({
        nom: "",
        description: "",
        region: "Littoral",
        ville: "",
        categorie: "Hébergement",
        image_url: "",
      });
      e.target.reset();
    } else {
      setStatut({ type: "error", message: resultat.error });
    }
  };

  const gererSuppression = async (idSite, nomSite) => {
    // Une boîte de dialogue de confirmation sécurisée
    const confirmer = window.confirm(
      `Voulez-vous vraiment supprimer définitivement le site "${nomSite}" ?`,
    );

    if (!confirmer) return;

    try {
      const reponse = await fetch(`/api/sites/supprimer?id=${idSite}`, {
        method: "DELETE",
      });

      const resultat = await reponse.json();

      if (reponse.ok) {
        setStatut({ type: "success", message: resultat.message });
        // Recharger immédiatement la liste pour faire disparaître la carte visuellement
        chargerSitesTouristiques();
      } else {
        setStatut({ type: "error", message: resultat.error });
      }
    } catch (error) {
      console.error("Erreur réseau lors de la suppression :", error);
      setStatut({
        type: "error",
        message: "Une erreur est survenue lors de la suppression.",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Remplacement propre et asynchrone du widget Cloudinary */}
      <Script
        src="https://upload-widget.cloudinary.com/global/all.js"
        strategy="afterInteractive"
      />

      {/* EN-TÊTE DU DASHBOARD AJUSTÉ AVEC LE BOUTON DECONNEXION */}
      <div className="mb-8 border-b border-neutral-200 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-neutral-900">
            Espace d {"'"} Administration
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Gestion et publication des sites touristiques officiels du Cameroun.
          </p>
        </div>

        {/* BOUTON SE DÉCONNECTER */}
        <button
          onClick={deconnexionAdmin}
          className="self-start sm:self-center bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 border border-red-200/40 shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>
          <span>Se déconnecter</span>
        </button>
      </div>

      {statut.message && (
        <div
          className={`p-4 rounded-xl mb-6 text-sm font-medium ${
            statut.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {statut.message}
        </div>
      )}

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-neutral-100">
        <h2 className="text-xl font-bold text-neutral-800 mb-6 flex items-center gap-2">
          Ajouter un nouveau site ou établissement
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                Nom du site
              </label>
              <input
                type="text"
                name="nom"
                required
                onChange={handleChange}
                value={formData.nom}
                placeholder="ex: Chutes de la Lobé..."
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#d65a1a]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                Catégorie
              </label>
              <select
                name="categorie"
                onChange={handleChange}
                value={formData.categorie}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#d65a1a]"
              >
                <option value="En_plein_air">En plein air</option>
                <option value="Plage">Plage</option>
                <option value="Montagne">Montagne</option>
                <option value="Culturel">Culturel</option>
                <option value="Ville">Ville</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
              Description du lieu
            </label>
            <textarea
              name="description"
              rows="4"
              required
              onChange={handleChange}
              value={formData.description}
              placeholder="Décrivez l'histoire du lieu..."
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#d65a1a]"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                Région
              </label>
              <select
                name="region"
                onChange={handleChange}
                value={formData.region}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#d65a1a]"
              >
                <option value="Littoral">Littoral</option>
                <option value="Centre">Centre</option>
                <option value="Sud">Sud</option>
                <option value="Ouest">Ouest</option>
                <option value="Nord">Nord</option>
                <option value="Sud-Ouest">Sud-Ouest</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                Ville
              </label>
              <input
                type="text"
                name="ville"
                required
                onChange={handleChange}
                value={formData.ville}
                placeholder="ex: Kribi, Yaoundé..."
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#d65a1a]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
              Image du site
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-neutral-50 border border-dashed border-neutral-300 rounded-2xl">
              <button
                type="button"
                onClick={ouvrirWidgetCloudinary}
                className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all"
              >
                {chargementImage ? "Ouverture..." : "📷 Choisir une photo"}
              </button>

              <div className="flex-1 text-center sm:text-left">
                {formData.image_url ? (
                  <span className="text-xs text-green-600 font-medium block truncate max-w-xs sm:max-w-md">
                    ✓ Image prête : {formData.image_url}
                  </span>
                ) : (
                  <span className="text-xs text-neutral-400">
                    Aucun fichier sélectionné (Obligatoire)
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#d65a1a] hover:bg-[#be4e14] text-white font-bold p-3.5 rounded-xl text-sm shadow-md transition-all uppercase tracking-wider"
          >
            Publier le site touristique
          </button>
        </form>
      </div>
    </div>
  );
}
