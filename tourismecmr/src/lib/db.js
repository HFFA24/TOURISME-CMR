import { Pool } from "pg";

// Initialisation du pool de connexions
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Fonction générique pour exécuter vos requêtes SQL
export const executerRequete = async (texteSQL, parametres) => {
  const client = await pool.connect();
  try {
    const resultat = await client.query(texteSQL, parametres);
    return resultat;
  } finally {
    // Libère immédiatement le client pour les prochaines requêtes
    client.release();
  }
};
