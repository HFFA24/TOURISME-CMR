import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/header";
import Footers from "../components/footer";
import GoogleTranslate from "../components/GoogleTranslate";
import ChatBot from "@/components/ChatBot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Tourisme CMR",
  description: "Découvrez les merveilles du Cameroun, l'Afrique en miniature.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-neutral-50">
        {/* Google Translate (caché) */}
        <GoogleTranslate />
        <Header />
        <main className="grow">{children}</main>
        <ChatBot />
        <Footers />
      </body>
    </html>
  );
}
