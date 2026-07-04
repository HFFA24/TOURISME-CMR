/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function PrestataireDashboard() {
  const router = useRouter();
  const [utilisateurConnecte, setUtilisateurConnecte] = useState(null);
  const [chargementDonnees, setChargementDonnees] = useState(true);
  const [ongletActif, setOngletActif] = useState("mes_annonces");

  const [annonces, setAnnonces] = useState([]);
  const [sitesTouristiques, setSitesTouristiques] = useState([]);
  const [sitesFiltres, setSitesFiltres] = useState([]);

  // États pour la gestion locale des fichiers images (Création)
  const [imageFichier, setImageFichier] = useState(null);
  const [apercuImage, setApercuImage] = useState("");

  // États additionnels pour la MODIFICATION
  const [annonceEnEdition, setAnnonceEnEdition] = useState(null);
  const [formDataEdition, setFormDataEdition] = useState({
    id_annonce: "",
    titre: "",
    description: "",
    categorie: "",
    region: "",
    prix_unitaire: "",
    site_touristique_id: "",
    image_principale_url: "",
  });

  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    categorie: "",
    region: "",
    prix_unitaire: "",
    site_touristique_id: "",
  });

  const [statutEnvoi, setStatutEnvoi] = useState({ type: "", message: "" });
  const [chargementAction, setChargementAction] = useState(false);

  // 1. VÉRIFICATION STRICTE DE LA SESSION
  useEffect(() => {
    const session = localStorage.getItem("utilisateur");
    if (!session) {
      router.push("/connexion");
      return;
    }
    try {
      const util = JSON.parse(session);

      // Sécurité : Rôle requis
      if (
        util &&
        util.role !== "Guide-touristique" &&
        util.role !== "prestataire_hebergement"
      ) {
        alert(
          "Accès refusé. Cet espace est réservé exclusivement aux professionnels.",
        );
        router.push("/");
        return;
      }

      // Utilisation stricte de l'ID standardisé (id)
      const idActuel = util.id;

      if (idActuel) {
        setUtilisateurConnecte(util);
        chargerAnnonces(idActuel);
        chargerSitesTouristiques();
      } else {
        console.warn(
          "Attention : Aucun ID utilisateur trouvé dans la session.",
        );
        router.push("/connexion");
      }
    } catch (erreur) {
      console.error("Erreur lors du traitement de la session :", erreur);
      router.push("/connexion");
    } finally {
      setChargementDonnees(false);
    }
  }, [router]);

  // 2. FILTRAGE ASSOUPLI DES SITES TOURISTIQUES
  useEffect(() => {
    if (!formData.region.trim()) {
      setSitesFiltres(sitesTouristiques);
      return;
    }

    const NettoyerChaine = (str) =>
      str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
        .replace(/[^a-z0-9]/g, "")
        .trim();

    const regionSaisie = NettoyerChaine(formData.region);

    const resultats = sitesTouristiques.filter((site) => {
      if (!site.region) return false;
      const regionBase = NettoyerChaine(site.region);
      return (
        regionBase.includes(regionSaisie) || regionSaisie.includes(regionBase)
      );
    });

    setSitesFiltres(resultats);
  }, [formData.region, sitesTouristiques]);

  const chargerAnnonces = async (idPresta) => {
    try {
      const rep = await fetch(`/api/prestations?id_prestataire=${idPresta}`);
      if (rep.ok) {
        const d = await rep.json();
        setAnnonces(d.data || []);
      }
    } catch (err) {
      console.error("Erreur chargement annonces :", err);
    }
  };

  const chargerSitesTouristiques = async () => {
    try {
      const rep = await fetch("/api/sites-touristiques");
      if (rep.ok) {
        const d = await rep.json();
        const listesSites = Array.isArray(d) ? d : d.data || [];
        setSitesTouristiques(listesSites);
        setSitesFiltres(listesSites);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des sites :", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectionImage = (e) => {
    const fichier = e.target.files[0];
    if (!fichier) return;
    setImageFichier(fichier);
    setApercuImage(URL.createObjectURL(fichier));
  };

  const gererSuppression = async (idAnnonce) => {
    if (!confirm("Voulez-vous vraiment supprimer cette annonce ?")) return;

    try {
      const reponse = await fetch(`/api/prestations?id_annonce=${idAnnonce}`, {
        method: "DELETE",
      });

      if (reponse.ok) {
        setAnnonces(annonces.filter((ann) => ann.id_annonce !== idAnnonce));
        alert("Annonce supprimée avec succès !");
      } else {
        const errJson = await reponse.json();
        alert(errJson.error || "Erreur lors de la suppression.");
      }
    } catch (err) {
      console.error("Erreur suppression :", err);
      alert("Erreur de communication avec le serveur.");
    }
  };

  const activerEdition = (annonce) => {
    setAnnonceEnEdition(annonce.id_annonce);
    setFormDataEdition({
      id_annonce: annonce.id_annonce,
      titre: annonce.titre,
      description: annonce.description,
      categorie: annonce.categorie,
      region: annonce.region,
      prix_unitaire: annonce.prix_unitaire || "",
      site_touristique_id: annonce.site_touristique_id || "",
      image_principale_url: annonce.image_principale_url,
    });
  };

  const handleEditionChange = (e) => {
    setFormDataEdition({ ...formDataEdition, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setChargementAction(true);

    try {
      const reponse = await fetch(
        `/api/prestations?id_annonce=${formDataEdition.id_annonce}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            titre: formDataEdition.titre,
            description: formDataEdition.description,
            categorie: formDataEdition.categorie,
            region: formDataEdition.region,
            prix_unitaire: parseFloat(formDataEdition.prix_unitaire) || 0,
            image_principale_url: formDataEdition.image_principale_url,
            site_touristique_id: formDataEdition.site_touristique_id
              ? parseInt(formDataEdition.site_touristique_id)
              : null,
          }),
        },
      );

      const resJson = await reponse.json();

      if (reponse.ok) {
        setAnnonces(
          annonces.map((ann) =>
            ann.id_annonce === formDataEdition.id_annonce ? resJson.data : ann,
          ),
        );
        setAnnonceEnEdition(null);
        alert("Annonce modifiée avec succès !");
      } else {
        alert(
          resJson.error || "Une erreur est survenue lors de la modification.",
        );
      }
    } catch (err) {
      console.error("Erreur modification :", err);
      alert("Erreur réseau.");
    } finally {
      setChargementAction(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const idPrestataire = utilisateurConnecte?.id;

    if (!idPrestataire) {
      alert(
        "Erreur : Impossible de récupérer votre identifiant. Veuillez vous reconnecter.",
      );
      return;
    }

    if (!imageFichier) {
      alert("Veuillez sélectionner une image principale.");
      return;
    }

    setChargementAction(true);
    setStatutEnvoi({
      type: "chargement",
      message:
        "Hébergement de l'image et création de votre annonce en cours...",
    });

    try {
      const CLOUD_NAME = "dv9r8k76b";
      const UPLOAD_PRESET = "ml_default";

      const bodyData = new FormData();
      bodyData.append("file", imageFichier);
      bodyData.append("upload_preset", UPLOAD_PRESET);

      const reponseCloudinary = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: bodyData,
        },
      );

      const donneesCloudinary = await reponseCloudinary.json();

      if (!reponseCloudinary.ok) {
        throw new Error("Impossible d'héberger l'image sur Cloudinary.");
      }

      const reponse = await fetch("/api/prestations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titre: formData.titre,
          description: formData.description,
          categorie: formData.categorie,
          region: formData.region,
          prix_unitaire: parseFloat(formData.prix_unitaire) || 0,
          image_principale_url: donneesCloudinary.secure_url,
          id_prestataire: parseInt(idPrestataire),
          site_touristique_id: formData.site_touristique_id
            ? parseInt(formData.site_touristique_id)
            : null,
        }),
      });

      const resJson = await reponse.json();

      if (reponse.ok) {
        setStatutEnvoi({
          type: "succes",
          message: "Annonce mise en ligne avec succès !",
        });
        setFormData({
          titre: "",
          description: "",
          categorie: "",
          region: "",
          prix_unitaire: "",
          site_touristique_id: "",
        });
        setImageFichier(null);
        setApercuImage("");
        chargerAnnonces(idPrestataire);
        setOngletActif("mes_annonces");
      } else {
        setStatutEnvoi({
          type: "erreur",
          message: resJson.error || "Une erreur est survenue.",
        });
      }
    } catch (err) {
      console.error(err);
      setStatutEnvoi({
        type: "erreur",
        message: err.message || "Erreur de communication avec le serveur.",
      });
    } finally {
      setChargementAction(false);
    }
  };

  if (chargementDonnees) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm font-medium text-neutral-500 bg-neutral-50 font-sans">
        Chargement de votre espace sécurisé...
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Espace Professionnel | TourismeCMR</title>
      </Head>
      <div className="min-h-screen bg-neutral-50 py-10 px-4 sm:px-6 font-sans">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-neutral-100 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-bold text-[#d65a1a] uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full">
                Le Cameroun, Le continant en miniature
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-neutral-900 mt-2">
                Bienvenue,{" "}
                {utilisateurConnecte?.nom_entreprise ||
                  utilisateurConnecte?.email}
              </h1>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("utilisateur");
                router.push("/");
              }}
              className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-xl transition-all"
            >
              Se déconnecter
            </button>
          </div>

          {/* Onglets */}
          <div className="flex gap-4 border-b border-neutral-200 mb-8">
            <button
              onClick={() => {
                setOngletActif("mes_annonces");
                setAnnonceEnEdition(null);
              }}
              className={`pb-4 text-sm font-bold transition-all ${ongletActif === "mes_annonces" ? "border-b-2 border-[#d65a1a] text-[#d65a1a]" : "text-neutral-400 hover:text-neutral-600"}`}
            >
              Mes Annonces & Services
            </button>
            <button
              onClick={() => {
                setOngletActif("ajouter_annonce");
                setStatutEnvoi({ type: "", message: "" });
              }}
              className={`pb-4 text-sm font-bold transition-all ${ongletActif === "ajouter_annonce" ? "border-b-2 border-[#d65a1a] text-[#d65a1a]" : "text-neutral-400 hover:text-neutral-600"}`}
            >
              Publier un Service
            </button>
          </div>

          {/* LISTE DES ANNONCES */}
          {ongletActif === "mes_annonces" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {annonces.map((item) => (
                <div
                  key={item.id_annonce}
                  className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden flex flex-col justify-between"
                >
                  {annonceEnEdition === item.id_annonce ? (
                    /* FORMULAIRE DE MODIFICATION */
                    <form onSubmit={handleUpdate} className="p-6 space-y-4">
                      <h3 className="text-sm font-bold text-[#d65a1a] mb-2 uppercase tracking-wide">
                        Modifier la prestation
                      </h3>
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">
                          Titre
                        </label>
                        <input
                          type="text"
                          name="titre"
                          value={formDataEdition.titre}
                          onChange={handleEditionChange}
                          required
                          className="w-full p-2 bg-neutral-50 border rounded-xl text-xs focus:outline-none focus:border-[#d65a1a]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">
                            Catégorie
                          </label>
                          <select
                            name="categorie"
                            value={formDataEdition.categorie}
                            onChange={handleEditionChange}
                            required
                            className="w-full p-2 bg-neutral-50 border rounded-xl text-xs focus:outline-none focus:border-[#d65a1a]"
                          >
                            <option value="Hébergement">Hébergement</option>
                            <option value="Restaurant">Restaurant</option>
                            <option value="Articles">Articles de voyage</option>
                            <option value="Maisons">Maisons & Villas</option>
                            <option value="Voitures">
                              Location de Voitures
                            </option>
                            <option value="Bar">Bar & Lounge</option>
                            {/*  Valeur corrigée ici pour respecter la contrainte CHECK de la base de données */}
                            <option value="Événement">Événementiel</option>
                            <option value="Autres">Autres services</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">
                            Prix (FCFA)
                          </label>
                          <input
                            type="number"
                            name="prix_unitaire"
                            value={formDataEdition.prix_unitaire}
                            onChange={handleEditionChange}
                            required
                            className="w-full p-2 bg-neutral-50 border rounded-xl text-xs focus:outline-none focus:border-[#d65a1a]"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">
                            Région
                          </label>
                          <input
                            type="text"
                            name="region"
                            value={formDataEdition.region}
                            onChange={handleEditionChange}
                            required
                            className="w-full p-2 bg-neutral-50 border rounded-xl text-xs focus:outline-none focus:border-[#d65a1a]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">
                            Site Lié
                          </label>
                          <select
                            name="site_touristique_id"
                            value={formDataEdition.site_touristique_id}
                            onChange={handleEditionChange}
                            className="w-full p-2 bg-neutral-50 border rounded-xl text-xs focus:outline-none focus:border-[#d65a1a]"
                          >
                            <option value="">Aucun point d intérêt lié</option>
                            {sitesTouristiques.map((site) => (
                              <option key={site.id} value={site.id}>
                                {site.nom || site.titre}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">
                          Description
                        </label>
                        <textarea
                          name="description"
                          rows="3"
                          value={formDataEdition.description}
                          onChange={handleEditionChange}
                          required
                          className="w-full p-2 bg-neutral-50 border rounded-xl text-xs focus:outline-none focus:border-[#d65a1a] resize-none"
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          disabled={chargementAction}
                          className="flex-1 bg-emerald-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all disabled:opacity-50"
                        >
                          {chargementAction
                            ? "Enregistrement..."
                            : "Sauvegarder"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setAnnonceEnEdition(null)}
                          className="flex-1 bg-neutral-200 text-neutral-700 py-2 rounded-xl text-xs font-bold hover:bg-neutral-300 transition-all"
                        >
                          Annuler
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* MODE VUE NORMAL */
                    <>
                      <div>
                        <div className="h-48 bg-neutral-100">
                          <img
                            src={item.image_principale_url}
                            alt={item.titre}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="text-base font-bold text-neutral-900">
                            {item.titre}
                          </h3>
                          <p className="text-xs text-neutral-500 mt-1">
                            📍 {item.region} |{" "}
                            <span className="font-semibold text-neutral-700">
                              {item.categorie}
                            </span>
                          </p>
                          <p className="text-xs text-neutral-600 mt-2 line-clamp-2">
                            {item.description}
                          </p>
                          <p className="text-sm font-black text-[#d65a1a] mt-3">
                            {item.prix_unitaire?.toLocaleString()} FCFA
                          </p>
                        </div>
                      </div>
                      <div className="p-6 pt-0 flex gap-3">
                        <button
                          onClick={() => activerEdition(item)}
                          className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold py-2.5 rounded-xl transition-all"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => gererSuppression(item.id_annonce)}
                          className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold py-2.5 rounded-xl transition-all"
                        >
                          Supprimer
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
              {annonces.length === 0 && (
                <p className="text-sm text-neutral-400 col-span-2 text-center py-10">
                  Aucune annonce publiée pour le moment.
                </p>
              )}
            </div>
          )}

          {/* AJOUTER UNE ANNONCE */}
          {ongletActif === "ajouter_annonce" && (
            <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-neutral-100">
              <h2 className="text-lg font-bold text-neutral-800 mb-6">
                Mettre en ligne un nouveau service
              </h2>

              {statutEnvoi.message && (
                <div
                  className={`p-4 rounded-xl text-sm font-medium mb-6 ${statutEnvoi.type === "succes" ? "bg-emerald-50 text-emerald-700" : statutEnvoi.type === "erreur" ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"}`}
                >
                  {statutEnvoi.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide mb-2">
                      Titre de l annonce
                    </label>
                    <input
                      type="text"
                      name="titre"
                      required
                      value={formData.titre}
                      onChange={handleChange}
                      placeholder="Ex: Chambre Luxe Kribi"
                      className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-[#d65a1a]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide mb-2">
                      Catégorie attendue
                    </label>
                    <select
                      name="categorie"
                      required
                      value={formData.categorie}
                      onChange={handleChange}
                      className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-[#d65a1a]"
                    >
                      <option value="">-- Sélectionnez --</option>
                      <option value="Hébergement">Hébergement</option>
                      <option value="Restaurant">Restaurant</option>
                      <option value="Articles">Articles de voyage</option>
                      <option value="Maisons">Maisons & Villas</option>
                      <option value="Voitures">Location de Voitures</option>
                      <option value="Bar">Bar & Lounge</option>
                      {/*  Valeur corrigée ici également pour l'insertion */}
                      <option value="Événement">Événementiel</option>
                      <option value="Autres">Autres services</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide mb-2">
                      Région du Cameroun
                    </label>
                    <input
                      type="text"
                      name="region"
                      required
                      value={formData.region}
                      onChange={handleChange}
                      placeholder="Saisissez la région (Ex: Littoral, Sud, Ouest...)"
                      className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-[#d65a1a]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide mb-2">
                      Prix Unitaire (FCFA)
                    </label>
                    <input
                      type="number"
                      name="prix_unitaire"
                      required
                      value={formData.prix_unitaire}
                      onChange={handleChange}
                      placeholder="0"
                      className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-[#d65a1a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide mb-2">
                    Associer à un site touristique répertorié
                  </label>
                  <select
                    name="site_touristique_id"
                    value={formData.site_touristique_id}
                    onChange={handleChange}
                    className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-[#d65a1a]"
                  >
                    <option value="">
                      -- Optionnel : Associer à un point d intérêt (
                      {sitesFiltres.length} disponible(s)) --
                    </option>
                    {sitesFiltres.map((site) => (
                      <option key={site.id} value={site.id}>
                        {site.nom || site.titre} (
                        {site.region || "Toutes régions"})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide mb-2">
                      Image Principale (Fichier)
                    </label>
                    <input
                      type="file"
                      name="image_principale"
                      accept="image/*"
                      onChange={handleSelectionImage}
                      disabled={chargementAction}
                      className="w-full text-xs text-neutral-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-orange-50 file:text-[#d65a1a] hover:file:bg-orange-100 cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center">
                    {apercuImage ? (
                      <img
                        src={apercuImage}
                        alt="Aperçu local"
                        className="h-16 w-24 object-cover rounded-xl border border-neutral-200 shadow-sm"
                      />
                    ) : (
                      <div className="h-16 w-24 bg-neutral-100 rounded-xl flex items-center justify-center text-[10px] text-neutral-400">
                        Aucun fichier
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide mb-2">
                    Description détaillée
                  </label>
                  <textarea
                    name="description"
                    required
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Décrivez les détails de votre offre ici..."
                    className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-[#d65a1a] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={chargementAction}
                  className="w-full bg-[#d65a1a] hover:bg-[#be4e14] text-white p-3.5 rounded-xl font-bold text-sm shadow-md transition-all disabled:opacity-40"
                >
                  {chargementAction
                    ? "Action en cours..."
                    : "Confirmer la mise en ligne ➔"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
