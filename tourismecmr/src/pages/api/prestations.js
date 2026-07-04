// pages/api/prestations.js
import { Pool } from "pg";

// Configuration de ton PostgreSQL local
const pool = new Pool({
  user: process.env.PGUSER || "postgres",
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "tourismecm_db",
  password: process.env.PGPASSWORD || "Install2026",
  port: process.env.PGPORT || 5432,
});

export default async function handler(req, res) {
  // --- MÉTHODE GET : RÉCUPÉRATION ---
  if (req.method === "GET") {
    const { id_prestataire } = req.query;
    try {
      const query = `
        SELECT * FROM annonce 
        WHERE id_prestataire = $1 
        ORDER BY id_annonce DESC
      `;
      const result = await pool.query(query, [id_prestataire]);
      return res.status(200).json({ data: result.rows });
    } catch (error) {
      console.error("Erreur GET /api/prestations:", error);
      return res
        .status(500)
        .json({ error: "Erreur lors de la récupération des annonces." });
    }
  }

  // --- MÉTHODE POST : AJOUT ---
  if (req.method === "POST") {
    try {
      const {
        titre,
        description,
        categorie,
        region,
        prix_unitaire,
        image_principale_url,
        id_prestataire,
        site_touristique_id,
      } = req.body;

      const query = `
        INSERT INTO annonce (
          titre, 
          description, 
          categorie, 
          region, 
          prix_unitaire, 
          image_principale_url, 
          id_prestataire, 
          site_touristique_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
      `;

      const values = [
        titre,
        description,
        categorie,
        region,
        prix_unitaire,
        image_principale_url,
        id_prestataire,
        site_touristique_id,
      ];

      const result = await pool.query(query, values);
      return res.status(201).json({ data: result.rows[0] });
    } catch (error) {
      console.error("Erreur POST /api/prestations:", error);
      return res
        .status(500)
        .json({ error: error.message || "Erreur interne du serveur." });
    }
  }

  // --- MÉTHODE PUT : MODIFICATION ---
  if (req.method === "PUT") {
    const { id_annonce } = req.query; // Récupère l'ID passé dans l'URL (ex: /api/prestations?id_annonce=1)

    if (!id_annonce) {
      return res
        .status(400)
        .json({ error: "L'ID de l'annonce est requis pour la modification." });
    }

    try {
      const {
        titre,
        description,
        categorie,
        region,
        prix_unitaire,
        image_principale_url,
        site_touristique_id,
      } = req.body;

      const query = `
        UPDATE annonce 
        SET 
          titre = $1, 
          description = $2, 
          categorie = $3, 
          region = $4, 
          prix_unitaire = $5, 
          image_principale_url = $6,
          site_touristique_id = $7
        WHERE id_annonce = $8
        RETURNING *;
      `;

      const values = [
        titre,
        description,
        categorie,
        region,
        prix_unitaire,
        image_principale_url,
        site_touristique_id,
        id_annonce,
      ];

      const result = await pool.query(query, values);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Annonce introuvable." });
      }

      return res.status(200).json({ data: result.rows[0] });
    } catch (error) {
      console.error("Erreur PUT /api/prestations:", error);
      return res
        .status(500)
        .json({
          error:
            error.message || "Erreur lors de la modification de l'annonce.",
        });
    }
  }

  // --- MÉTHODE DELETE : SUPPRESSION ---
  if (req.method === "DELETE") {
    const { id_annonce } = req.query;

    if (!id_annonce) {
      return res
        .status(400)
        .json({ error: "L'ID de l'annonce est requis pour la suppression." });
    }

    try {
      const query = "DELETE FROM annonce WHERE id_annonce = $1 RETURNING *;";
      const result = await pool.query(query, [id_annonce]);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Annonce introuvable." });
      }

      return res
        .status(200)
        .json({
          message: "Annonce supprimée avec succès !",
          data: result.rows[0],
        });
    } catch (error) {
      console.error("Erreur DELETE /api/prestations:", error);
      return res
        .status(500)
        .json({
          error: error.message || "Erreur lors de la suppression de l'annonce.",
        });
    }
  }

  // Si une autre méthode HTTP est utilisée
  return res.status(405).json({ error: "Méthode non autorisée" });
}
