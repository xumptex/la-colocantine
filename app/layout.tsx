import type { Metadata } from "next";
import "./globals.css";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { FournisseurEdition } from "../components/edition/Edition";
import { PolicesDuSite } from "../components/edition/Polices";
import BarreEdition from "../components/edition/BarreEdition";
import { classesPolices } from "@/lib/polices";
import { variablesPolices } from "@/lib/polices-catalogue";
import { lireCommentaires, lireReglages } from "@/lib/contenu/lecture";
import { FournisseurCommentaires } from "../components/Commentaires";

export const metadata: Metadata = {
  title: "La Colocantine",
  description: "Resto de coloc - Cuisine & Copains",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Polices choisies par les admins (mode édition > Polices)
  const reglages = await lireReglages();
  // Livre d'or (mis en cache, rafraîchi à chaque nouveau commentaire)
  const commentaires = await lireCommentaires();

  return (
    <html lang="fr" className={classesPolices} style={variablesPolices(reglages) as React.CSSProperties}>
      <body className="font-sans bg-cyan lg:motif-boucles text-marron min-h-screen flex flex-col overflow-x-hidden">
        <FournisseurEdition>
          <PolicesDuSite initial={reglages} />
          <NavBar />
          {/* Le contenu de chaque page viendra s'insérer dans ce "main" */}
          <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <FournisseurCommentaires commentaires={commentaires}>{children}</FournisseurCommentaires>
          </main>
          <Footer />
          <BarreEdition />
        </FournisseurEdition>
      </body>
    </html>
  );
}
