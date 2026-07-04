"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Coordonnées géographiques par défaut pour les villes du Cameroun
const COORDONNEES_VILLES = {
  yaoundé: [3.848, 11.502],
  douala: [4.051, 9.767],
  kribi: [2.95, 9.917],
  foumban: [5.729, 10.9],
  dschang: [5.443, 10.053],
  garoua: [9.301, 13.393],
  maroua: [10.591, 14.316],
  bafoussam: [5.478, 10.418],
  limbe: [4.024, 9.214],
  buea: [4.156, 9.241],
};

// Coordonnées par défaut du Cameroun pour centrer la carte
const CENTRE_CAMEROUN = [5.5, 12.5];

// Composant de configuration des icônes Leaflet (évite le bug des marqueurs invisibles sous Next.js)
function ConfigurationIcones() {
  const map = useMap();
  useEffect(() => {
    const L = require("leaflet");
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
  }, [map]);
  return null;
}

export default function CarteTouristique() {
  const [sites, setSites] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [MarkerClusterGroup, setMarkerClusterGroup] = useState(null);

  // 1. Charger dynamiquement le module ET son style de secours
  useEffect(() => {
    // Injection dynamique des styles par défaut des clusters pour éviter l'erreur de build
    if (!document.getElementById("leaflet-cluster-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-cluster-css";
      link.rel = "stylesheet";
      link.href =
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.4.1/MarkerCluster.css";
      document.head.appendChild(link);
    }
    if (!document.getElementById("leaflet-cluster-theme-css")) {
      const linkDefault = document.createElement("link");
      linkDefault.id = "leaflet-cluster-theme-css";
      linkDefault.rel = "stylesheet";
      linkDefault.href =
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.4.1/MarkerCluster.Default.css";
      document.head.appendChild(linkDefault);
    }

    // Chargement du module
    import("react-leaflet-markercluster").then((mod) => {
      setMarkerClusterGroup(() => mod.default);
    });
  }, []);

  // 2. Charger la liste des sites depuis ton API
  useEffect(() => {
    async function chargerSites() {
      try {
        const reponse = await fetch("/api/sites/liste");
        if (reponse.ok) {
          const donnees = await reponse.json();
          setSites(donnees);
        }
      } catch (error) {
        console.error("Erreur chargement carte :", error);
      } finally {
        setChargement(false);
      }
    }
    chargerSites();
  }, []);

  // 2. Charger la liste des sites depuis ton API
  useEffect(() => {
    async function chargerSites() {
      try {
        const reponse = await fetch("/api/sites/liste");
        if (reponse.ok) {
          const donnees = await reponse.json();
          setSites(donnees);
        }
      } catch (error) {
        console.error("Erreur chargement carte :", error);
      } finally {
        setChargement(false);
      }
    }
    chargerSites();
  }, []);

  if (chargement || !MarkerClusterGroup) {
    return (
      <div className="text-center py-10 text-neutral-500 text-xs font-medium">
        Initialisation de la carte écotouristique...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-32px border border-neutral-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] overflow-hidden p-5 flex flex-col gap-4 font-sans w-full">
      {/* En-tête de la carte */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-[#0b3c26]">
            🗺️
          </div>
          <div>
            <h2 className="text-xs font-bold text-neutral-800 uppercase tracking-tight">
              Carte écotouristique
            </h2>
            <p className="text-[10px] text-neutral-400 font-semibold">
              10 Régions • OpenStreetMap
            </p>
          </div>
        </div>
        <span className="bg-[#e77a3d] text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
          Live Interactive
        </span>
      </div>

      {/* Conteneur de la Carte Leaflet (Agrandie et stabilisée) */}
      <div className="w-full h-650px rounded-2xl overflow-hidden border border-neutral-100 relative z-10 shadow-inner">
        <MapContainer
          center={CENTRE_CAMEROUN}
          zoom={7}
          style={{ width: "100%", height: "100%" }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          <ConfigurationIcones />

          {/* Solution 1 : On encapsule tous les marqueurs dans le groupe de clustering */}
          <MarkerClusterGroup chunkedLoading>
            {sites.map((site) => {
              const villeCle = site.ville
                ? site.ville.toLowerCase().trim()
                : "";
              // Plus besoin de décalage artificiel, MarkerClusterGroup gère tout proprement au clic
              const position = COORDONNEES_VILLES[villeCle] || CENTRE_CAMEROUN;

              return (
                <Marker key={site.id} position={position}>
                  <Popup>
                    <div className="font-sans p-1 max-w-200px">
                      <span className="text-[9px] font-bold text-[#d65a1a] uppercase tracking-wider block mb-0.5">
                        {site.categorie}
                      </span>
                      <h4 className="font-serif font-bold text-neutral-900 text-xs mb-1">
                        {site.nom}
                      </h4>
                      <p className="text-[10px] text-neutral-500 line-clamp-2 leading-tight mb-2">
                        {site.description}
                      </p>
                      <div className="text-[9px] font-semibold text-neutral-400 border-t pt-1">
                        📍 {site.ville} ({site.region})
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MarkerClusterGroup>
        </MapContainer>
      </div>

      {/* Footer informatif */}
      <div className="bg-[#faf9f6] rounded-2xl p-4 border border-neutral-100/50 flex gap-3 items-start">
        <div className="w-5 h-5 rounded-full bg-white border shadow-sm flex items-center justify-center text-xs text-[#d65a1a] shrink-0 mt-0.5">
          ℹ️
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-wider text-[#0b3c26]">
            Exploration Géographique
          </h4>
          <p className="text-[10px] text-neutral-500 leading-relaxed mt-0.5">
            Visualisez les destinations écotouristiques réelles à travers les 10
            régions du Cameroun. Les marqueurs se regroupent intelligemment si
            plusieurs sites partagent la même ville ; cliquez sur un groupe pour
            déployer la zone.
          </p>
        </div>
      </div>
    </div>
  );
}
