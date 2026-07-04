import "../globals.css"; // Le chemin pointe maintenant vers la racine du dossier src

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
