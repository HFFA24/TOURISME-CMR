"use client";

export default function LanguageDropdown() {
  const changeLang = (lang) => {
    const combo = document.querySelector(".goog-te-combo");
    if (!combo) return;

    combo.value = lang;
    combo.dispatchEvent(new Event("change"));
  };

  return (
    <div>
      <select
        onChange={(e) => changeLang(e.target.value)}
        className="
          px-4 py-2 rounded-xl
          bg-linear-to-br from-[#0B3C26] to-[#145b39]
          text-green-600 text-xs font-bold
          shadow-md
          outline-none
          cursor-pointer
        "
        defaultValue=""
      >
        <option value="">🌍 Langue</option>
        <option value="fr">🇫🇷 Français</option>
        <option value="en">🇬🇧 English</option>
        <option value="es">🇪🇸 Español</option>
        <option value="de">🇩🇪 Deutsch</option>
      </select>
    </div>
  );
}
