import { Pool } from "pg";

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://postgres:Install2026@localhost:5173/tourismecm_db",
  // Ajustez la ligne ci-dessus avec vos accès locaux si nécessaire
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { nom, description, region, ville, categorie, image_url } = req.body;

  // Validation simple des champs
  if (!nom || !description || !region || !ville || !categorie) {
    return res
      .status(400)
      .json({ error: "Tous les champs obligatoires doivent être remplis" });
  }

  try {
    // Requête SQL pour insérer le site touristique
    const requeteSQL = `
      INSERT INTO site_touristique (nom, description, region, ville, categorie, image_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const valeurs = [
      nom,
      description,
      region,
      ville,
      categorie,
      image_url || null,
    ];
    const resultat = await pool.query(requeteSQL, valeurs);

    return res.status(201).json({
      message: "Site touristique ajouté avec succès !",
      site: resultat.rows[0],
    });
  } catch (erreur) {
    console.error("Erreur SQL lors de l'ajout :", erreur.message);
    return res.status(500).json({ error: `Erreur DB : ${erreur.message}` });
  }
}
