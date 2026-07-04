import { useState } from "react";
import { useRouter } from "next/router";
import "../app/globals.css";
import Link from "next/link";

export default function Connexion() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", mot_de_passe: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reponse = await fetch("/api/connexion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        mot_de_passe: formData.mot_de_passe,
      }),
    });

    if (reponse.ok) {
      const donnees = await reponse.json();
      const util = donnees.utilisateur;

      if (!util || !util.role) {
        alert("Erreur : Impossible de récupérer le rôle de l'utilisateur.");
        return;
      }

      localStorage.setItem("utilisateur", JSON.stringify(util));

      // 🔄 Redirection harmonisée avec les rôles du Dashboard
      if (
        util.role === "Guide-touristique" ||
        util.role === "prestataire_hebergement"
      ) {
        router.push("/prestataire"); // Ou le chemin vers ton index.jsx du prestataire
      } else {
        router.push("/touriste");
      }
    } else {
      const erreur = await reponse.json();
      alert(
        `Erreur de connexion : ${erreur.error || "Identifiants invalides"}`,
      );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-neutral-100 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-neutral-800">
            Ravi de vous revoir !
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Connectez-vous pour explorer TourismeCMR
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
              Adresse Email
            </label>
            <input
              type="email"
              name="email"
              required
              onChange={handleChange}
              placeholder="Ex: armel.ndoumbe@mail.com"
              className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-[#d65a1a]"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-neutral-700 uppercase">
                Mot de passe
              </label>
            </div>
            <input
              type="password"
              name="mot_de_passe"
              required
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-[#d65a1a]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#d65a1a] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#be4e14] transition-all"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
