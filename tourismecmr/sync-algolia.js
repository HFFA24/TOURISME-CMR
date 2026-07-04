// sync-algolia.js
const { Pool } = require("pg");
const algoliasearch = require("algoliasearch");

// 1. Connexion à ton PostgreSQL local (ajuste avec tes identifiants)
const pgClient = new Pool({
  user: "postgres",
  host: "localhost",
  database: "tourismecm_db", // le nom de ta base de données
  password: "Install2026",
  port: 5432,
});

// 2. Connexion à Algolia
const clientAlgolia = algoliasearch.algoliasearch(
  "bbf75b2dad139aa8637cb01610f4503f",
  "95f93be0783927f220a4f3b3e6d72b33",
);
const indexAlgolia = clientAlgolia.initIndex("site_touristique");

async function synchroniser() {
  try {
    await pgClient.connect();
    console.log(" Connecté à PostgreSQL local...");

    // Récupérer tous les sites de ta table
    const res = await pgClient.query(
      "SELECT id, nom, description, ville, region, categorie FROM site_touristique",
    );
    const sites = res.rows;

    if (sites.length === 0) {
      console.log("ℹ️ Aucun site trouvé dans la base de données.");
      return;
    }

    // Formater les données pour Algolia (Algolia requiert absolument un 'objectID')
    // Formater les données pour Algolia (objectID obligatoire)
    const objetsAlgolia = sites.map((site) => ({
      objectID: site.id.toString(),
      nom: site.nom,
      description: site.description,
      ville: site.ville,
      region: site.region,
      categorie: site.categorie,
    }));

    console.log(`⏳ Envoi de ${objetsAlgolia.length} sites vers Algolia...`);

    // Code adapté pour la v5 d'Algolia :
    await clientAlgolia.saveObjects({
      indexName: "site_touristique",
      objects: objetsAlgolia,
    });

    console.log("✅ Synchronisation réussie ! Tes sites sont sur Algolia.");
    // Envoyer tout d'un coup (Batch)
    await clientAlgolia.saveObjects({
      indexName: "site_touristique",
      objects: objetsAlgolia,
    });

    console.log("✅ Synchronisation réussie ! Tes sites sont sur Algolia.");
  } catch (error) {
    console.error("Erreur lors de la synchronisation :", error);
  } finally {
    await pgClient.end();
  }
}

synchroniser();
