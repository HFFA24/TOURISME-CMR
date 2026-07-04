"use client";

import { useState } from "react";
import Link from "next/link";

import GoogleTranslate from "./GoogleTranslate";
import LanguageDropdown from "./LanguageDropdown";

export default function Header() {
  const [menuOuvert, setMenuOuvert] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b shadow-sm">
      <div className="max-w-7xl mx-auto h-16 md:h-20 px-4 md:px-10 flex items-center justify-between">
        {/* ================= LOGO ================= */}
        <Link href="/" className="flex items-center gap-3 md:gap-4 group">
          <div
            className="
            w-10 h-10 md:w-12 md:h-12 rounded-2xl
            bg-linear-to-br from-[#0B3C26] to-[#135c3b]
            flex items-center justify-center
            text-white text-lg md:text-xl shadow-md
            group-hover:scale-110 transition
          "
          >
            ✿
          </div>

          <div className="leading-tight">
            <span className="font-serif text-base md:text-xl font-bold text-[#0B3C26] block">
              Tourisme CMR
            </span>
            <span className="text-[8px] md:text-[10px] text-[#D96B27] uppercase tracking-widest font-bold">
              Afrique en Miniature
            </span>
          </div>
        </Link>

        {/* ================= MENU CENTER ================= */}
        <nav className="hidden md:flex flex-1 justify-center">
          <ul className="flex items-center gap-8 text-xs font-bold uppercase text-neutral-600">
            <li>
              <Link href="/" className="hover:text-[#0B3C26] transition">
                Accueil
              </Link>
            </li>

            <li>
              <Link
                href="/a-propos"
                className="hover:text-[#0B3C26] transition"
              >
                À Propos
              </Link>
            </li>

            <li>
              <Link href="/contact" className="hover:text-[#0B3C26] transition">
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* ================= RIGHT ================= */}
        <div className="hidden md:flex items-center gap-4">
          {/* Google Translate engine (hidden) */}
          <GoogleTranslate />

          {/* Dropdown langues */}
          <LanguageDropdown />

          <Link
            href="/connexion"
            className="px-5 py-2 rounded-xl text-xs font-semibold text-neutral-900 hover:bg-neutral-100 transition"
          >
            Connexion
          </Link>

          <Link
            href="/inscription"
            className="
              px-8 py-3 rounded-xl
              bg-linear-to-br from-[#0B3C26] to-[#145b39]
              text-white text-xs font-bold uppercase
              shadow-lg
              hover:-translate-y-1 hover:shadow-xl
              transition
            "
          >
            S {"'"} inscrire
          </Link>
        </div>

        {/* ================= MOBILE ================= */}
        <button
          onClick={() => setMenuOuvert(!menuOuvert)}
          className="md:hidden p-2"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOuvert ? (
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {menuOuvert && (
        <div className="md:hidden bg-white border-t p-5 space-y-4">
          <nav style={{ display: "flex", gap: "20px" }}>
            <Link href="/" onClick={() => setMenuOuvert(false)}>
              Accueil
            </Link>
            <Link href="/a-propos" onClick={() => setMenuOuvert(false)}>
              À Propos
            </Link>
            <Link href="/contact" onClick={() => setMenuOuvert(false)}>
              Contact
            </Link>
          </nav>

          <div className="border-t pt-4">
            <GoogleTranslate />
            <LanguageDropdown />
          </div>

          <Link href="/connexion" className="block mt-3">
            Connexion
          </Link>

          <Link
            href="/inscription"
            className="block mt-2 bg-[#0B3C26] text-white text-center py-2 rounded-xl"
          >
            S {"'"} inscrire
          </Link>
        </div>
      )}
    </header>
  );
}
