import Header from "../components/header";
import Footer from "../components/footer";
import "../app/globals.css"; // On importe le CSS global ici pour tout le site !
import "leaflet/dist/leaflet.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 font-sans text-neutral-800">
      {/* Votre Header global s'affichera en haut de TOUTES les pages */}
      <Header />

      {/* Le contenu de chaque page s'injectera ici au milieu */}
      <main className="grow">
        <Component {...pageProps} />
      </main>

      {/* Votre Footer global s'affichera en bas de TOUTES les pages */}
      <Footer />
    </div>
  );
}
