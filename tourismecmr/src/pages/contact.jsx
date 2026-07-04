// src/pages/contact.jsx
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

export default function Contact() {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    sujet: "",
    message: "",
  });
  const [statut, setStatut] = useState({ type: "", msg: "" });
  const [envoi, setEnvoi] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const gererFormulaire = async (e) => {
    e.preventDefault();
    setEnvoi(true);
    setStatut({ type: "", msg: "" });

    // Simulation d'envoi de message (À lier à une API si nécessaire)
    setTimeout(() => {
      setStatut({
        type: "success",
        msg: "Merci ! Votre message a été envoyé avec succès. Notre équipe vous répondra sous 24h à 48h.",
      });
      setFormData({ nom: "", email: "", sujet: "", message: "" });
      setEnvoi(false);
    }, 1500);
  };

  return (
    <>
      <Head>
        <title>Contactez-Nous | TourismeCMR</title>
      </Head>

      <div className="min-h-screen bg-[#faf9f6] py-12 px-4 font-sans text-neutral-800">
        <div className="max-w-5xl mx-auto">
          {/* En-tête de page */}
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-[#d65a1a] uppercase tracking-widest block mb-2">
              Une question ? Un partenariat ?
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#0b3c26]">
              Contactez notre équipe
            </h1>
            <p className="text-neutral-500 text-xs sm:text-sm mt-2 max-w-md mx-auto">
              Nous sommes à votre écoute pour vous accompagner dans votre projet
              de voyage ou référencer vos services d {"'"} hébergement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Blocs d'informations (1/3 de la largeur) */}
            <div className="space-y-4 md:col-span-1">
              <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm space-y-1">
                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  Email général
                </h3>
                <p className="text-sm font-semibold text-[#0b3c26]">
                  contact@tourismecmr.cm
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm space-y-1">
                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  Partenariats Prestataires
                </h3>
                <p className="text-sm font-semibold text-neutral-800">
                  pro@tourismecmr.cm
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm space-y-1">
                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  Siège Social
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                  Yaoundé, Cameroun <br />
                  Mvan, Boulevard de l {"'"} Aéroport
                </p>
              </div>
            </div>

            {/* Formulaire de message (2/3 de la largeur) */}
            <div className="bg-white p-8 sm:p-10 rounded-[32px] border border-neutral-100 shadow-xl md:col-span-2">
              <h2 className="text-lg font-bold text-[#0b3c26] mb-6 flex items-center gap-2">
                ✉️ Écrivez-nous un message
              </h2>

              {statut.msg && (
                <div
                  className={`p-4 rounded-xl mb-6 text-xs font-medium text-center ${statut.type === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700"}`}
                >
                  {statut.msg}
                </div>
              )}

              <form onSubmit={gererFormulaire} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-600 mb-2">
                      Votre nom complet
                    </label>
                    <input
                      type="text"
                      name="nom"
                      required
                      value={formData.nom}
                      onChange={handleChange}
                      placeholder="Ex: Samuel Eto'o"
                      className="w-full px-4 py-3 bg-[#faf9f6] border border-neutral-200/80 rounded-xl text-xs font-medium text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#0b3c26]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-600 mb-2">
                      Adresse Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Ex: samuel@gmail.com"
                      className="w-full px-4 py-3 bg-[#faf9f6] border border-neutral-200/80 rounded-xl text-xs font-medium text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#0b3c26]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-600 mb-2">
                    Sujet du message
                  </label>
                  <input
                    type="text"
                    name="sujet"
                    required
                    value={formData.sujet}
                    onChange={handleChange}
                    placeholder="Ex: Demande de référencement d'un hôtel..."
                    className="w-full px-4 py-3 bg-[#faf9f6] border border-neutral-200/80 rounded-xl text-xs font-medium text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#0b3c26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-600 mb-2">
                    Détails du message
                  </label>
                  <textarea
                    name="message"
                    rows="5"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Bonjour, je souhaite..."
                    className="w-full px-4 py-3 bg-[#faf9f6] border border-neutral-200/80 rounded-xl text-xs font-medium text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#0b3c26]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={envoi}
                  className="w-full bg-[#0b3c26] hover:bg-[#072719] text-white py-3.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center disabled:opacity-50 uppercase tracking-wider"
                >
                  {envoi ? "Envoi en cours..." : "Envoyer le message"}
                </button>
              </form>
            </div>
          </div>

          {/* Lien de retour discret */}
          <div className="text-center mt-12">
            <Link
              href="/"
              className="text-xs font-bold text-neutral-400 hover:text-[#d65a1a] transition-all uppercase tracking-wider"
            >
              ← Retour à l {"'"} accueil public
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
