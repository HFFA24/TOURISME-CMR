// src/app/carte/page.jsx
"use client";

import dynamic from "next/dynamic";

// Import dynamique obligatoire pour Leaflet
const CarteTouristique = dynamic(
  () => import("@/components/CarteTouristique"),
  { ssr: false },
);

export default function PageCarte() {
  return (
    <div className="min-h-screen bg-[#faf9f6] py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-serif font-bold text-[#0b3c26]">
          Cartographie Interactive des Sites
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Explorez visuellement les opportunités écotouristiques au Cameroun
        </p>
      </div>

      <div className="flex justify-center">
        <CarteTouristique />
      </div>
    </div>
  );
}
