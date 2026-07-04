// src/pages/admin/connexion.jsx
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

export default function AdminConnexion() {
  const router = useRouter();

  // États pour le formulaire basés sur la table adminconnexion (email et mot_de_passe)
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  const gererSoumission = async (e) => {
    e.preventDefault();
    setErreur("");
    setChargement(true);

    try {
      const reponse = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          mot_de_passe: motDePasse,
        }),
      });

      const resultat = await reponse.json();

      if (!reponse.ok) {
        throw new Error(resultat.message || "Identifiants invalides");
      }

      // Connexion réussie -> Redirection vers la console d'administration
      router.push("/admin/dashboard");
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  };

  return (
    <>
      <Head>
        <title>Portail Administration | TourismeCMR</title>
      </Head>

      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-4 font-sans">
        <div className="max-w-xl w-full bg-white rounded-32px shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-neutral-100 overflow-hidden">
          {/* Ligne décorative supérieure colorée */}
          <div className="h-2 bg-linear-to-r from-[#0b3c26] via-[#d65a1a] to-[#0b3c26]" />

          <div className="p-8 sm:p-12">
            {/* Icône Bouclier de Sécurité */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-[#faf9f6] border border-neutral-200 rounded-2xl flex items-center justify-center text-[#0b3c26]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-7 h-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
              </div>
            </div>

            {/* Titres */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0b3c26] tracking-tight">
                Portail Administration
              </h1>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#d65a1a] mt-2 space-x-1">
                <span>Tourisme CMR</span>
                <span className="text-neutral-300">•</span>
                <span>Supervision</span>
              </p>
            </div>

            {/* Message d'erreur */}
            {erreur && (
              <div className="mb-6 p-3.5 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs font-medium text-center">
                {erreur}
              </div>
            )}

            {/* Formulaire */}
            <form onSubmit={gererSoumission} className="space-y-5">
              {/* Champ Identifiant (Email) */}
              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-2">
                  Identifiant Administrateur
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="Ex: admin@tourismecmr.cm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-[#faf9f6] border border-neutral-200/80 rounded-2xl text-xs font-medium text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#0b3c26] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Champ Mot de passe */}
              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-2">
                  Mot de passe sécurisé
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                      />
                    </svg>
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={motDePasse}
                    onChange={(e) => setMotDePasse(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-[#faf9f6] border border-neutral-200/80 rounded-2xl text-xs font-medium text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#0b3c26] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Bouton de validation d'accès */}
              <button
                type="submit"
                disabled={chargement}
                className="w-full mt-2 bg-[#0b3c26] hover:bg-[#072719] active:scale-[0.99] text-white py-4 rounded-2xl text-xs font-bold transition-all shadow-[0_8px_20px_rgba(11,60,38,0.15)] flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {chargement ? (
                  <span className="animate-pulse">
                    Vérification des accès...
                  </span>
                ) : (
                  <>
                    <span>Connexion</span>
                  </>
                )}
              </button>
            </form>

            {/* Séparateur pointillé */}
            <div className="border-t border-dashed border-neutral-200 my-8" />

            {/* Pied du formulaire */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] font-bold tracking-wider text-neutral-400">
              <span className="uppercase">Projet Tourisme CMR · 2026</span>
              <Link
                href="/"
                className="text-[#d65a1a] hover:underline transition-all"
              >
                Retour au portail public
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
