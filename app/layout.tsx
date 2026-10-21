import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "../components/NavBar";

// On utilise la police Inter, très sobre et lisible
const inter = Inter({ subsets: ["latin"] });

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
    <html lang="fr">
      <body className={`${inter.className} bg-cyan text-marron min-h-screen flex flex-col overflow-x-hidden`}>
        <NavBar />
        {/* Le contenu de chaque page viendra s'insérer dans ce "main" */}
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}