"use client";

import { useState, useEffect } from "react";

export default function CatalogueTouristique() {
  const [sites, setSites] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [siteSelectionne, setSiteSelectionne] = useState(null);
  const [pannellumPret, setPannellumPret] = useState(false);

  // 1. Charger les sites depuis l'API
  useEffect(() => {
    async function chargerSites() {
      try {
        const reponse = await fetch("/api/sites/liste");
        if (reponse.ok) {
          const donnees = await reponse.json();
          setSites(donnees);
        }
      } catch (error) {
        console.error("Erreur catalogue:", error);
      } finally {
        setChargement(false);
      }
    }
    chargerSites();
  }, []);

  // 2. Injection dynamique unique des scripts Pannellum dans le document
  useEffect(() => {
    if (!document.getElementById("pannellum-css")) {
      const link = document.createElement("link");
      link.id = "pannellum-css";
      link.rel = "stylesheet";
      link.href =
        "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css";
      document.head.appendChild(link);
    }

    if (!window.pannellum) {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js";
      script.async = true;
      script.onload = () => setPannellumPret(true);
      document.body.appendChild(script);
    } else {
      setPannellumPret(true);
    }
  }, []);

  // 3. Initialisation de l'image 360° au clic
  useEffect(() => {
    if (siteSelectionne && (pannellumPret || window.pannellum)) {
      // Extraction stricte de la colonne confirmée : image_url
      const urlBrute = siteSelectionne.image_url;

      if (!urlBrute) {
        console.error("Aucune URL trouvée dans la colonne image_url.");
        return;
      }

      // Optimisation des images Cloudinary à la volée
      const urlOptimisee = urlBrute.includes("/upload/")
        ? urlBrute.replace("/upload/", "/upload/f_auto,q_auto/")
        : urlBrute;

      // Un court timeout garantit que la div contenant id="viewer-360" est montée par React
      const timer = setTimeout(() => {
        try {
          window.pannellum.viewer("viewer-360", {
            type: "equirectangular",
            panorama: urlOptimisee,
            autoLoad: true,
            compass: false,
            crossOrigin: "anonymous",
          });
        } catch (error) {
          console.error("Erreur d'accroche Pannellum :", error);
        }
      }, 250);

      return () => clearTimeout(timer);
    }
  }, [siteSelectionne, pannellumPret]);

  if (chargement) {
    return (
      <div className="text-center py-20 text-neutral-500 font-medium">
        Chargement du catalogue...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-[#faf9f6] min-h-screen">
      {/* En-tête */}
      <div className="text-center mb-12">
        <span className="text-xs font-bold text-[#d65a1a] uppercase tracking-widest block mb-2">
          Immersion totale
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#0b3c26]">
          Catalogue des Merveilles
        </h1>
        <p className="text-neutral-500 text-xs sm:text-sm mt-2">
          Cliquez sur une photo pour explorer le lieu à 360°
        </p>
      </div>

      {/* Grille des Cartes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sites.map((site) => (
          <div
            key={site.id}
            className="bg-white rounded-[32px] border border-neutral-100 shadow-sm overflow-hidden group flex flex-col justify-between hover:shadow-md transition-all duration-300"
          >
            {/* Zone cliquable */}
            <div
              onClick={() => setSiteSelectionne(site)}
              className="relative h-56 bg-neutral-100 overflow-hidden cursor-pointer"
            >
              <img
                src={site.image_url}
                alt={site.nom}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <span className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl text-xs font-bold text-[#0b3c26] flex items-center gap-2 shadow-md">
                  🔄 Voir en 360°
                </span>
              </div>
            </div>

            {/* Infos du site */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#d65a1a]">
                  {site.categorie}
                </span>
                <h3 className="font-serif font-bold text-lg text-[#0b3c26] mt-1 mb-2">
                  {site.nom}
                </h3>
                <p className="text-neutral-500 text-xs line-clamp-3 leading-relaxed mb-4">
                  {site.description}
                </p>
              </div>
              <div className="text-neutral-400 font-semibold text-[11px] pt-4 border-t border-neutral-50 flex items-center gap-1">
                📍 {site.ville} · {site.region}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODALE IMMERSIVE INTERACTIVE */}
      {siteSelectionne && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-5xl overflow-hidden shadow-2xl relative flex flex-col">
            {/* Header de la modale */}
            <div className="p-5 border-b border-neutral-100 flex justify-between items-center bg-white">
              <div>
                <h2 className="font-serif font-bold text-lg text-[#0b3c26]">
                  {siteSelectionne.nom}
                </h2>
                <p className="text-xs text-neutral-400">
                  Maintenez le clic enfoncé et déplacez la souris pour regarder
                  autour de vous
                </p>
              </div>
              <button
                onClick={() => setSiteSelectionne(null)}
                className="w-10 h-10 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-full flex items-center justify-center text-sm font-bold transition-all"
              >
                ✕
              </button>
            </div>

            {/* Conteneur Pannellum stable et calibré */}
            <div
              id="viewer-360"
              className="w-full h-[550px] bg-neutral-900 dynamic-panoramic-container"
              style={{ minHeight: "550px" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
