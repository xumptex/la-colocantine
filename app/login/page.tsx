import type { Metadata } from "next";
import { Suspense } from "react";
import PaperCard from "@/components/PaperCard";
import TitrePage from "@/components/TitrePage";
import FormulaireConnexion from "@/components/FormulaireConnexion";

export const metadata: Metadata = {
  title: "Connexion - La Colocantine",
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-md mx-auto py-4">
      <TitrePage titre="Connexion" sousTitre="Pour t'inscrire aux repas et signer le livre d'or." />
      <PaperCard tilt="none">
        <div className="p-6 md:p-8">
          {/* Le formulaire lit l'URL (?erreur=...) : derrière un Suspense */}
          <Suspense>
            <FormulaireConnexion />
          </Suspense>
        </div>
      </PaperCard>
    </div>
  );
}
