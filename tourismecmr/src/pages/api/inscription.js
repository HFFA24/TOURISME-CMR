import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "tourismecm_db",
  password: "Install2026", // Mets ton mot de passe ici
  port: 5432,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  // Le frontend enverra 'role' (touriste ou prestataire) et 'nom_entreprise'
  const { email, password, role, nom_entreprise } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: "Champs obligatoires manquants." });
  }

  try {
    const verifEmail = await pool.query(
      "SELECT * FROM utilisateur WHERE email = $1",
      [email],
    );
    if (verifEmail.rows.length > 0) {
      return res.status(400).json({ error: "Cet email est déjà utilisé." });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHache = await bcrypt.hash(password, salt);

    // Insertion flexible (nom_entreprise sera NULL si c'est un simple touriste)
    const requeteSQL = `
      INSERT INTO utilisateur (email, mot_de_passe, role, nom_entreprise)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, role, nom_entreprise
    `;
    const values = [
      email,
      passwordHache,
      role,
      role === "prestataire" ? nom_entreprise : null,
    ];
    const resultat = await pool.query(requeteSQL, values);

    return res.status(201).json({
      message: "Compte créé avec succès !",
      user: resultat.rows[0],
    });
  } catch (erreur) {
    console.error(erreur);
    return res
      .status(500)
      .json({ error: `Erreur serveur : ${erreur.message}` });
  }
}
