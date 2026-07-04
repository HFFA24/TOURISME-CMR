import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "tourismecmr_db",
  password: "VOTRE_MOT_DE_PASSE_POSTGRES", // Mets ton vrai mot de passe ici !
  port: 5432,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  // On récupère le site_touristique_id envoyé par le formulaire
  const {
    titre,
    description,
    prix,
    telephone,
    image_url,
    categorie,
    site_touristique_id,
  } = req.body;

  if (
    !titre ||
    !description ||
    !prix ||
    !telephone ||
    !categorie ||
    !site_touristique_id
  ) {
    return res
      .status(400)
      .json({
        error:
          "Veuillez remplir tous les champs, y compris la structure associée.",
      });
  }

  try {
    const requeteSQL = `
      INSERT INTO annonce (titre, description, prix, telephone, image_url, categorie, site_touristique_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const valeurs = [
      titre,
      description,
      prix,
      telephone,
      image_url || null,
      categorie,
      site_touristique_id,
    ];
    const resultat = await pool.query(requeteSQL, valeurs);

    return res.status(201).json({
      message: "Votre prestation a été liée et publiée avec succès !",
      annonce: resultat.rows[0],
    });
  } catch (erreur) {
    console.error("Erreur SQL annonce :", erreur.message);
    return res.status(500).json({ error: `Erreur DB : ${erreur.message}` });
  }
}
