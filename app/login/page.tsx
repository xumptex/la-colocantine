import type { Metadata } from "next";
import { User } from "lucide-react";
import PaperCard from "@/components/PaperCard";

export const metadata: Metadata = {
  title: "Connexion - La Colocantine",
};

// Maquette uniquement : les comptes seront branchés plus tard.
export default function LoginPage() {
  return (
    <div className="w-full max-w-md mx-auto py-8">
      <PaperCard tilt="right">
        <div className="p-8 space-y-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <User size={32} />
            <h1 className="text-3xl font-extrabold tracking-tight">Connexion</h1>
            <p className="font-handwriting text-2xl opacity-80">Bientôt disponible !</p>
          </div>

          <fieldset disabled className="space-y-4 opacity-60">
            <label className="block">
              <span className="text-sm font-medium">Email</span>
              <input type="email" className="mt-1 w-full border border-marron/30 rounded-sm px-3 py-2 bg-white" />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Mot de passe</span>
              <input type="password" className="mt-1 w-full border border-marron/30 rounded-sm px-3 py-2 bg-white" />
            </label>
            <button className="w-full bg-marron text-white px-6 py-3 font-medium rounded-sm cursor-not-allowed">
              Se connecter
            </button>
          </fieldset>
        </div>
      </PaperCard>
    </div>
  );
}
