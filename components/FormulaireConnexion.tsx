"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { creerClientNavigateur } from "@/lib/supabase/client";
import { seConnecter, creerCompte } from "@/app/login/actions";

// Logo Google officiel (4 couleurs)
function LogoGoogle() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

const champ = "mt-1 w-full border border-marron/30 rounded-sm px-3 py-2 bg-white focus:outline-none focus:border-marron";
const bouton = "w-full bg-marron text-white px-6 py-3 font-medium rounded-sm hover:bg-marron/90 transition-colors disabled:opacity-60";

export default function FormulaireConnexion() {
  const [mode, setMode] = useState<"connexion" | "inscription">("connexion");
  const [etatConnexion, actionConnexion, connexionEnCours] = useActionState(seConnecter, undefined);
  const [etatInscription, actionInscription, inscriptionEnCours] = useActionState(creerCompte, undefined);
  const [erreurGoogle, setErreurGoogle] = useState<string | null>(null);
  const lienInvalide = useSearchParams().get("erreur") === "lien";

  const connexionGoogle = async () => {
    setErreurGoogle(null);
    try {
      const { error } = await creerClientNavigateur().auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback?next=/compte` },
      });
      if (error) throw error;
    } catch {
      setErreurGoogle("Connexion Google impossible pour le moment.");
    }
  };

  const inscription = mode === "inscription";
  const etat = inscription ? etatInscription : etatConnexion;
  const enCours = inscription ? inscriptionEnCours : connexionEnCours;

  return (
    <div className="space-y-6">
      {/* Onglets Connexion / Créer un compte */}
      <div className="grid grid-cols-2 border-b border-marron/15">
        {(["connexion", "inscription"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`pb-3 font-semibold transition-colors ${
              mode === m ? "border-b-2 border-marron -mb-px" : "opacity-50 hover:opacity-80"
            }`}
          >
            {m === "connexion" ? "Connexion" : "Créer un compte"}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={connexionGoogle}
        className="w-full flex items-center justify-center gap-3 border border-marron/30 rounded-sm px-6 py-3 font-medium hover:bg-marron/5 transition-colors"
      >
        <LogoGoogle /> Continuer avec Google
      </button>

      <div className="flex items-center gap-3 text-sm opacity-60">
        <span className="flex-1 border-t border-marron/30"></span>ou<span className="flex-1 border-t border-marron/30"></span>
      </div>

      <form action={inscription ? actionInscription : actionConnexion} className="space-y-4">
        {inscription && (
          <label className="block">
            <span className="text-sm font-medium">Prénom</span>
            <input name="prenom" required autoComplete="given-name" className={champ} />
          </label>
        )}
        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input name="email" type="email" required autoComplete="email" className={champ} />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Mot de passe</span>
          <input
            name="motDePasse"
            type="password"
            required
            minLength={6}
            autoComplete={inscription ? "new-password" : "current-password"}
            className={champ}
          />
        </label>
        {inscription && (
          <label className="block">
            <span className="text-sm font-medium">Confirmer le mot de passe</span>
            <input name="confirmation" type="password" required minLength={6} autoComplete="new-password" className={champ} />
          </label>
        )}

        {(etat?.erreur || erreurGoogle || (lienInvalide && !etat)) && (
          <p role="alert" className="text-sm text-red-700">
            {etat?.erreur ?? erreurGoogle ?? "Ce lien de connexion n'est plus valide, réessaie."}
          </p>
        )}
        {etat?.message && <p className="font-handwriting text-2xl text-center">{etat.message}</p>}

        <button type="submit" disabled={enCours} className={bouton}>
          {enCours ? "Un instant..." : inscription ? "Créer mon compte" : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
