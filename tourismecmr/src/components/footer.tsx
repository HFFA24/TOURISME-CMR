import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-100 py-8 px-4 mt-auto">
      <div className="max-w-6xl mx-auto text-center font-sans tracking-wide space-y-3">
        {/* Ligne 1 : Copyright */}
        <p className="text-[11px] sm:text-xs text-neutral-400 font-light">
          © 2026 Tourisme CMR Marketplace. Tous droits réservés.
        </p>

        {/* Ligne 2 : Mention institutionnelle */}
        <p className="text-[10px] sm:text-[11px] text-neutral-400 font-light max-w-3xl mx-auto leading-relaxed uppercase tracking-wider">
          Contribuer au développement économique durable et à la préservation
          des écosystèmes forestiers du Bassin du Congo sous le patronage du
          Ministère du Tourisme (MINTOUL).
        </p>

        {/* Ligne 3 : Liens du bas avec la puce de séparation */}
        <div className="flex items-center justify-center gap-2 pt-2 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase">
          <span className="text-neutral-500">Région : Afrique Centrale</span>

          <span className="text-neutral-300">•</span>

          <Link
            href="/admin/connexion"
            className="text-[#d65a1a] hover:text-[#be4e14] transition-colors hover:underline"
          >
            Espace d {"'"} Administration [Test]
          </Link>
        </div>
      </div>
    </footer>
  );
}
