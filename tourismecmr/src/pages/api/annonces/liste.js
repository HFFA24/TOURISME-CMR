import { Pool } from "pg";

// 1. Initialisation du pool de connexion avec ta variable d'environnement
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  // Sécurité : On accepte uniquement les requêtes GET
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  try {
    // 2. Ta requête SQL avec la jointure pour récupérer les infos de l'annonce ET du site associé
    const query = `
      SELECT 
        a.id_annonce,
        a.titre,
        a.description,
        a.categorie,
        a.region,
        a.prix_unitaire,
        a.image_principale_url,
        a.site_touristique_id,
        s.nom AS site_nom,
        s.ville AS site_ville
      FROM annonce a
      INNER JOIN site_touristique s ON a.site_touristique_id = s.id
    `;

    // 3. Exécution de la requête via le pool
    const result = await pool.query(query);

    // 4. Renvoi des données sous forme de JSON (Statut 200 OK)
    return res.status(200).json(result.rows);
  } catch (erreur) {
    console.error("Erreur API Annonces:", erreur);
    return res.status(500).json({
      error: "Erreur serveur lors de la récupération des annonces.",
      details: erreur.message,
    });
  }
}
