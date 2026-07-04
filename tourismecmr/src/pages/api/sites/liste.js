import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "tourismecm_db",
  password: "Install2026", // Mets ton vrai mot de passe ici !
  port: 5432,
});

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    // Récupérer tous les sites du plus récent au plus ancien
    const resultat = await pool.query(
      "SELECT * FROM site_touristique ORDER BY id DESC",
    );

    return res.status(200).json(resultat.rows);
  } catch (erreur) {
    console.error("Erreur lors de la récupération :", erreur.message);
    return res.status(500).json({ error: `Erreur DB : ${erreur.message}` });
  }
}
