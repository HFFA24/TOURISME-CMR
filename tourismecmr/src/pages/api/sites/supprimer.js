// src/pages/api/sites/supprimer.js
import { Pool } from "pg";

const pool = new Pool({
  user: process.env.PGUSER || "postgres",
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "tourismecm_db",
  password: process.env.PGPASSWORD || "Install2026",
  port: process.env.PGPORT || 5432,
});

export default async function handler(req, res) {
  // On accepte uniquement la méthode DELETE ou POST (DELETE est plus propre en REST)
  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
    return res
      .status(405)
      .json({ message: `Méthode ${req.method} non autorisée` });
  }

  const { id } = req.query; // Récupère l'identifiant passé dans l'URL (ex: ?id=3)

  if (!id) {
    return res
      .status(400)
      .json({ error: "L'identifiant du site est obligatoire." });
  }

  try {
    // Exécute la suppression en ciblant la bonne colonne de clé primaire 'id'
    const requeteSQL = "DELETE FROM site_touristique WHERE id = $1";
    const resultat = await pool.query(requeteSQL, [id]);

    if (resultat.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Aucun site trouvé avec cet identifiant." });
    }

    return res
      .status(200)
      .json({ message: "Le site touristique a été supprimé avec succès !" });
  } catch (err) {
    console.error("Erreur lors de la suppression du site :", err);
    return res
      .status(500)
      .json({ error: "Impossible de supprimer le site touristique." });
  }
}
