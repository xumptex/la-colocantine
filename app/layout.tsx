import type { Metadata } from "next";
import { Inter, Caveat } from "next/font/google";
import "./globals.css";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

// On utilise la police Inter, très sobre et lisible
const inter = Inter({ subsets: ["latin"] });

// Police manuscrite, exposée en variable CSS pour la classe "font-handwriting"
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });

export const metadata: Metadata = {
  title: "La Colocantine",
  description: "Resto de coloc - Cuisine & Copains",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={caveat.variable}>
      <body className={`${inter.className} bg-cyan lg:motif-boucles text-marron min-h-screen flex flex-col overflow-x-hidden`}>
        <NavBar />
        {/* Le contenu de chaque page viendra s'insérer dans ce "main" */}
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
