import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "tourismecm_db",
  password: "Install2026", // Mets ton mot de passe ici
  port: 5432,
});

// src/pages/api/paiement/simuler.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  try {
    const {
      id_reservation,
      methode_paiement,
      montant_paye,
      commission_plateforme,
      statut,
    } = req.body;

    // TODO: Remplace par ton appel réel à ta base de données (ex: pg, prisma, etc.)
    console.log("Données reçues pour simulation :", {
      id_reservation,
      montant_paye,
    });

    // Pour l'instant, on simule une réponse positive
    return res.status(200).json({
      success: true,
      message: "Transaction enregistrée avec succès",
      reference: `REF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
