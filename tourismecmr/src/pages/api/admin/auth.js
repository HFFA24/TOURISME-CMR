// src/pages/api/admin/auth.js
import { Pool } from "pg";

// Utilisation de ton Pool de connexion PostgreSQL
const pool = new Pool({
  user: process.env.PGUSER || "postgres",
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "tourismecm_db",
  password: process.env.PGPASSWORD || "Install2026",
  port: process.env.PGPORT || 5432,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ message: `Méthode ${req.method} non autorisée` });
  }

  const { email, mot_de_passe } = req.body;

  if (!email || !mot_de_passe) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }

  try {
    // Requête SQL paramétrée pour éviter les injections SQL
    const requeteSQL = `
      SELECT id_admin, nom, email, mot_de_passe 
      FROM adminconnexion 
      WHERE email = $1 
      LIMIT 1
    `;

    const resultat = await pool.query(requeteSQL, [email]);

    // Si aucun administrateur n'est trouvé avec cet email
    if (resultat.rows.length === 0) {
      return res
        .status(401)
        .json({ message: "Identifiants administrateur incorrects" });
    }

    const admin = resultat.rows[0];

    // Vérification du mot de passe (comparaison textuelle directe)
    const motDePasseValide = mot_de_passe === admin.mot_de_passe;

    if (!motDePasseValide) {
      return res
        .status(401)
        .json({ message: "Identifiants administrateur incorrects" });
    }

    // Connexion réussie
    return res.status(200).json({
      message: "Connexion réussie",
      admin: {
        id: admin.id_admin,
        nom: admin.nom,
        email: admin.email,
        role: "admin",
      },
    });
  } catch (err) {
    console.error("Erreur d'authentification PostgreSQL admin :", err);
    return res.status(500).json({ message: "Une erreur serveur est survenue" });
  }
}
