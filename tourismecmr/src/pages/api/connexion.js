import { Pool } from "pg";

const pool = new Pool({
  user: process.env.PGUSER || "postgres",
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "tourismecm_db",
  password: process.env.PGPASSWORD || "Install2026",
  port: process.env.PGPORT || 5432,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { email, mot_de_passe } = req.body;

  if (!email || !mot_de_passe) {
    return res.status(400).json({ error: "Veuillez remplir tous les champs" });
  }

  try {
    // 🔑 AJOUT DE L'ID DANS LA SÉLECTION (Ajuste id_utilisateur si nécessaire)
    const requeteSQL =
      "SELECT id_utilisateur AS id, email, role, nom, prenom, mot_de_passe_hash,nom_entreprise FROM utilisateur WHERE email = $1";
    const resultat = await pool.query(requeteSQL, [email]);

    if (resultat.rows.length === 0) {
      return res.status(401).json({ error: "Identifiants incorrects" });
    }

    const utilisateurTrouve = resultat.rows[0];

    if (utilisateurTrouve.mot_de_passe_hash !== mot_de_passe) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    const { mot_de_passe_hash: _, ...donneesSecurisees } = utilisateurTrouve;

    return res.status(200).json({
      message: "Connexion réussie",
      utilisateur: donneesSecurisees,
    });
  } catch (erreur) {
    console.error("Erreur PostgreSQL :", erreur.message);
    return res.status(500).json({ error: `Erreur DB : ${erreur.message}` });
  }
}
