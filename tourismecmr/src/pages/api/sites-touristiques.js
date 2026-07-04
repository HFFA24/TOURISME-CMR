import { Pool } from "pg";

// On réutilise exactement la même configuration centralisée que pour l'inscription
const pool = new Pool({
  user: process.env.PGUSER || "postgres",
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "tourismecm_db",
  password: process.env.PGPASSWORD || "Install2026", //  Mettez le VRAI mot de passe ici
  port: process.env.PGPORT || 5432,
});

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    // Requête pour récupérer tous les sites touristiques de la table
    const { rows } = await pool.query(
      "SELECT id, nom, description, region, ville, categorie, image_url FROM site_touristique ORDER BY nom ASC",
    );

    // On renvoie les données directement au format attendu par ton dashboard
    return res.status(200).json(rows);
  } catch (error) {
    console.error("Erreur API sites-touristiques :", error);
    return res.status(500).json({
      error: "Erreur interne du serveur lors de la récupération des sites.",
    });
  }
}
