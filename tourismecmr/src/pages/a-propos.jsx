// src/pages/a-propos.jsx
import Head from "next/head";
import Link from "next/link";

export default function APropos() {
  return (
    <>
      <Head>
        <title>À Propos de Nous | TourismeCMR</title>
      </Head>

      <div className="min-h-screen bg-[#faf9f6] font-sans text-neutral-800">
        {/* En-tête / Bannière de présentation */}
        <div className="bg-[#0b3c26] text-white py-20 px-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <span className="text-xs font-bold text-[#d65a1a] uppercase tracking-widest block mb-3">
            Notre Concept
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight max-w-3xl mx-auto leading-tight">
            Le Cameroun à portée de clic, l {"'"} Afrique en miniature
          </h1>
          <p className="mt-4 text-neutral-300 text-sm sm:text-base max-w-2xl mx-auto font-medium">
            Découvrez, planifiez et explorez les trésors cachés, la culture
            vibrante et les paysages à couper le souffle du Cameroun.
          </p>
        </div>

        {/* Section Contenu Principal */}
        <div className="max-w-5xl mx-auto px-4 py-16 space-y-16">
          {/* Grille de présentation du projet */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-serif font-bold text-[#0b3c26]">
                Qu {"'"} est-ce que{" "}
                <span className="text-[#d65a1a]">TourismeCMR</span> ?
              </h2>
              <p className="text-neutral-600 text-sm leading-relaxed">
                <strong>TourismeCMR</strong> est une plateforme numérique
                innovante dédiée à la valorisation et à la promotion du
                potentiel touristique camerounais. Notre objectif est de
                connecter les voyageurs, locaux comme internationaux, avec la
                richesse culturelle, historique et naturelle du pays.
              </p>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Que vous soyez à la recherche des plages de sable noir de Limbe,
                des chutes spectaculaires de la Lobé à Kribi, du climat tempéré
                de l {"'"} Ouest ou de la faune sauvage du Nord, notre guide
                intelligent centralise tout pour simplifier votre aventure.
              </p>
            </div>
            <div className="bg-white border border-neutral-100 rounded-[32px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#d65a1a]/5 rounded-bl-[100px] -z-0"></div>
              <h3 className="font-bold text-sm uppercase text-[#d65a1a] tracking-wider mb-4">
                Pourquoi nous choisir ?
              </h3>
              <ul className="space-y-4 text-xs font-medium text-neutral-700">
                <li className="flex items-start gap-3">
                  <span>
                    Une sélection rigoureuse et officielle des plus beaux sites
                    touristiques des 10 régions.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span>
                    Une mise en relation directe avec des prestataires locaux
                    certifiés (Hébergements, guides, activités).
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span>
                    Une planification assistée par IA pour concevoir des
                    itinéraires sur-mesure selon vos préférences.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section Chiffres et Richesse Touristique */}
          <div className="bg-[#0b3c26]/5 rounded-[32px] p-8 sm:p-12 text-center border border-[#0b3c26]/10">
            <h3 className="text-xl font-serif font-bold text-[#0b3c26] mb-8">
              La diversité camerounaise en quelques mots
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-1">
                <p className="text-3xl font-serif font-bold text-[#d65a1a]">
                  10
                </p>
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                  Régions à explorer
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-serif font-bold text-[#0b3c26]">
                  250+
                </p>
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                  Ethnies et Cultures
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-serif font-bold text-[#d65a1a]">
                  2
                </p>
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                  Langues Officielles
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-serif font-bold text-[#0b3c26]">
                  100%
                </p>
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                  Hospitalité Chaleureuse
                </p>
              </div>
            </div>
          </div>

          {/* Bouton d'action final */}
          <div className="text-center pt-4">
            <Link
              href="/catalogue"
              className="inline-flex items-center justify-center bg-[#0b3c26] hover:bg-[#072719] text-white font-bold text-xs px-8 py-4 rounded-2xl shadow-md transition-all uppercase tracking-wider"
            >
              Commencer l {"'"} exploration
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
