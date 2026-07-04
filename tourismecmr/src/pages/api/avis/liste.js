import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  const { id_annonce } = req.query;

  if (!id_annonce) {
    return res
      .status(400)
      .json({ error: "L'identifiant de l'annonce est requis." });
  }

  try {
    const query = `
      SELECT id_avis, note, commentaire_texte, id_touriste 
      FROM avis 
      WHERE id_annonce = $1
      ORDER BY id_avis DESC
    `;
    const result = await pool.query(query, [id_annonce]);
    return res.status(200).json(result.rows);
  } catch (erreur) {
    console.error("Erreur récupération avis :", erreur);
    return res
      .status(500)
      .json({ error: "Erreur serveur lors de la récupération des avis." });
  }
}
