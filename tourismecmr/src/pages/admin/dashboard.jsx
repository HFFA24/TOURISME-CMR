/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Script from "next/script";

export default function AdminDashboard() {
  const router = useRouter();

  // États de l'interface
  const [ongletActif, setOngletActif] = useState("liste"); // "liste" ou "publier"
  const [nomAdmin, setNomAdmin] = useState("Administrateur");
  const [listeSites, setListeSites] = useState([]);
  const [chargementSites, setChargementSites] = useState(true);

  // État du formulaire d'ajout
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    region: "Littoral",
    ville: "",
    categorie: "En plein air",
    image_url: "",
  });
  const [statut, setStatut] = useState({ type: "", message: "" });
  const [chargementImage, setChargementImage] = useState(false);

  const CLOUD_NAME = "dv9r8k76b";
  const UPLOAD_PRESET = "ml_default";

  // Récupération du nom de l'admin et de la liste des sites au chargement
  useEffect(() => {
    // Tenter de récupérer le nom stocké lors de la connexion auth API
    const stockAdmin = localStorage.getItem("admin_nom");
    if (stockAdmin) {
      setNomAdmin(stockAdmin);
    }

    chargerSitesTouristiques();
  }, []);

  const chargerSitesTouristiques = async () => {
    try {
      setChargementSites(true);
      const reponse = await fetch("/api/sites/liste");
      if (reponse.ok) {
        const donnees = await reponse.json();
        setListeSites(donnees);
      }
    } catch (error) {
      console.error("Erreur de chargement des sites :", error);
    } finally {
      setChargementSites(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const deconnexionAdmin = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_nom");
    router.push("/");
  };

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
      alert("Le script Cloudinary est en cours de chargement. Réessayez...");
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
        categorie: "En plein air",
        image_url: "",
      });
      e.target.reset();
      chargerSitesTouristiques(); // Recharger la liste instantanément
      setOngletActif("liste"); // Rediriger vers l'aperçu globale
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Script
        src="https://upload-widget.cloudinary.com/global/all.js"
        strategy="afterInteractive"
      />

      {/* BANDEAU SUPÉRIEUR PROFESSIONNEL CONFORME MAQUETTE PRESTATAIRE */}
      <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <span className="text-xs font-bold text-[#d65a1a] uppercase tracking-wider block mb-1">
            Dashboard Professionnel
          </span>
          <h1 className="text-2xl font-black text-neutral-800">
            Bienvenue, <span className="text-neutral-900">{nomAdmin}</span>
          </h1>
        </div>
        <button
          type="button"
          onClick={deconnexionAdmin}
          className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs px-5 py-2.5 rounded-full transition-all border border-red-100"
        >
          Se déconnecter
        </button>
      </div>

      {/* SYSTÈME D'ONGLETS STYLISÉS */}
      <div className="flex items-center gap-6 border-b border-neutral-200 mb-8">
        <button
          onClick={() => setOngletActif("liste")}
          className={`pb-3 text-sm font-bold transition-all flex items-center gap-2 ${
            ongletActif === "liste"
              ? "text-[#d65a1a] border-b-2 border-[#d65a1a]"
              : "text-neutral-400 hover:text-neutral-600"
          }`}
        >
          💼 Tous les sites touristiques
        </button>
        <button
          onClick={() => setOngletActif("publier")}
          className={`pb-3 text-sm font-bold transition-all flex items-center gap-2 ${
            ongletActif === "publier"
              ? "text-[#d65a1a] border-b-2 border-[#d65a1a]"
              : "text-neutral-400 hover:text-neutral-600"
          }`}
        >
          ➕ Publier un Service / Site
        </button>
      </div>

      {/* MESSAGES DE STATUT */}
      {statut.message && (
        <div
          className={`p-4 rounded-xl mb-6 text-sm font-medium ${statut.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
        >
          {statut.message}
        </div>
      )}

      {/* CONTENU : 1. LISTE DES ANNONCES SITES */}
      {ongletActif === "liste" && (
        <div>
          {chargementSites ? (
            <div className="text-center py-12 text-sm text-neutral-400">
              Chargement des sites en cours...
            </div>
          ) : listeSites.length === 0 ? (
            <div className="text-center bg-neutral-50 rounded-2xl py-12 border border-dashed border-neutral-200">
              <p className="text-sm text-neutral-400">
                Aucun site touristique n {"'"} a encore été publié.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listeSites.map((site) => (
                <div
                  key={site.id_site}
                  className="bg-white border border-neutral-100 rounded-3xl shadow-md overflow-hidden flex flex-col"
                >
                  <div className="relative h-48 w-full bg-neutral-100">
                    <img
                      src={site.image_url}
                      alt={site.nom}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-neutral-800 font-bold text-[10px] uppercase px-2.5 py-1 rounded-full shadow-sm">
                      {site.categorie}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-neutral-800 truncate mb-1">
                        {site.nom}
                      </h3>
                      <p className="text-xs text-neutral-400 font-medium flex items-center gap-1 mb-3">
                        📍 {site.ville} | {site.region}
                      </p>
                      <p className="text-neutral-500 text-xs line-clamp-3 leading-relaxed mb-4">
                        {site.description}
                      </p>
                    </div>

                    {/* BOUTONS ACTIONS IDENTIQUES À LA MAQUETTE */}
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-neutral-100">
                      <button
                        onClick={() =>
                          alert("Fonctionnalité d'édition à venir")
                        }
                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs py-2 rounded-xl transition-all"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => gererSuppression(site.id, site.nom)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs py-2 rounded-xl transition-all"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CONTENU : 2. FORMULAIRE DE PUBLICATION */}
      {ongletActif === "publier" && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-neutral-100 max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-neutral-800 mb-6 flex items-center gap-2">
            <span>📍</span> Ajouter un nouveau site ou établissement
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
                  <option value="En plein air">En plein air</option>
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
                  <option value="Est">Est</option>
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
                      ✓ Image prête
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
      )}
    </div>
  );
}
