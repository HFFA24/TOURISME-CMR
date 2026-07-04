import { getSession } from "next-auth/react";
import { Pool } from "pg";

const pool = new Pool({
  user: process.env.PGUSER || "postgres",
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "tourismecm_db",
  password: process.env.PGPASSWORD || "Install2026",
  port: process.env.PGPORT || 5432,
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // RESTRICTION : Seul le Touriste peut réserver
  const session = await getSession({ req });
  if (!session || session.user.role !== "Touriste") {
    return res
      .status(403)
      .json({ error: "Réservation refusée. Rôle Touriste requis." });
  }

  const {
    id_reservation,
    methode_paiement,
    reference_passerelle,
    montant_paye,
    commission_plateforme,
  } = req.body;

  const { data, error } = await supabase
    .from("transaction")
    .insert([
      {
        id_reservation,
        methode_paiement,
        reference_passerelle,
        montant_paye,
        commission_plateforme,
        statut: "Succès",
      },
    ])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  return res.status(201).json({ success: true, data: data[0] });
}
