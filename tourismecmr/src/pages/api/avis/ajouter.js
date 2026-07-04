import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  // Récupération des données selon ton schéma de base de données
  const { id_annonce, id_touriste, note, commentaire_texte } = req.body;

  // Validation des champs obligatoires
  if (!id_annonce || !note) {
    return res
      .status(400)
      .json({ error: "L'id_annonce et la note sont requis." });
  }

  try {
    const query = `
    INSERT INTO avis (id_annonce, id_touriste, note, commentaire_texte)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

    const values = [
      id_annonce,
      id_touriste || null,
      note,
      commentaire_texte || "",
    ];

    // Correction ici : on transmet "values" en deuxième argument
    const result = await pool.query(query, values);

    return res.status(201).json({
      success: true,
      message: "Votre avis a été enregistré avec succès !",
      avis: result.rows[0],
    });
  } catch (erreur) {
    console.error("Erreur lors de l'enregistrement de l'avis :", erreur);
    return res.status(500).json({
      error: "Erreur serveur lors de l'enregistrement de l'avis.",
      details: erreur.message,
    });
  }
}
