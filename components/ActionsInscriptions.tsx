"use client";

import { useState, useTransition } from "react";
import { LoaderCircle, Mail, Trash } from "lucide-react";
import { envoyerLiens, supprimerInscription } from "@/app/admin/actions";

// Bouton "Envoyer les liens magiques" d'un repas (espace admin)
export function BoutonEnvoyerLiens({ repasId, sansCompte, repasPasse }: { repasId: string; sansCompte: number; repasPasse: boolean }) {
  const [enCours, demarrer] = useTransition();
  const [resultat, setResultat] = useState<string | null>(null);

  const envoyer = () => {
    const avertissement = repasPasse ? "" : "\n\nAttention : le repas n'a pas encore eu lieu, ils ne pourront commenter qu'après.";
    if (!window.confirm(`Envoyer un lien magique par email aux ${sansCompte} inscrit(s) sans compte ?${avertissement}`)) return;
    demarrer(async () => {
      const r = await envoyerLiens(repasId);
      if (r.erreur) return setResultat(r.erreur);
      setResultat(`${r.envoyes} email(s) envoyé(s)${r.echecs ? `, ${r.echecs} échec(s) (limite d'envoi ? voir docs/SUPABASE.md)` : ""}.`);
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={envoyer}
        disabled={enCours || sansCompte === 0}
        className="flex items-center gap-2 bg-marron text-white px-4 py-2 text-sm font-medium rounded-sm hover:bg-marron/90 transition-colors disabled:opacity-50"
      >
        {enCours ? <LoaderCircle size={16} className="animate-spin" /> : <Mail size={16} />}
        Envoyer les liens magiques ({sansCompte})
      </button>
      {resultat && <span className="text-sm">{resultat}</span>}
    </div>
  );
}

export function BoutonSupprimerInscription({ id, prenom }: { id: string; prenom: string }) {
  const [enCours, demarrer] = useTransition();
  return (
    <button
      type="button"
      title="Supprimer l'inscription"
      aria-label={`Supprimer l'inscription de ${prenom}`}
      disabled={enCours}
      onClick={() =>
        window.confirm(`Supprimer l'inscription de ${prenom} ?`) &&
        demarrer(async () => {
          const r = await supprimerInscription(id);
          if (r.erreur) window.alert(r.erreur);
        })
      }
      className="p-1.5 rounded-sm text-red-700 hover:bg-red-50 disabled:opacity-40"
    >
      <Trash size={16} />
    </button>
  );
}
