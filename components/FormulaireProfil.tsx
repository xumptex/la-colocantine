"use client";

import { useActionState } from "react";
import { mettreAJourProfil } from "@/app/compte/actions";

type FormulaireProfilProps = {
  prenom: string | null;
  nom: string | null;
};

const champ = "mt-1 w-full border border-marron/30 rounded-sm px-3 py-2 bg-white focus:outline-none focus:border-marron";

export default function FormulaireProfil({ prenom, nom }: FormulaireProfilProps) {
  const [etat, action, enCours] = useActionState(mettreAJourProfil, undefined);

  return (
    <form action={action} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-medium">Prénom</span>
          <input name="prenom" defaultValue={prenom ?? ""} autoComplete="given-name" className={champ} />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Nom</span>
          <input name="nom" defaultValue={nom ?? ""} autoComplete="family-name" className={champ} />
        </label>
      </div>
      {etat?.erreur && <p role="alert" className="text-sm text-red-700">{etat.erreur}</p>}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={enCours}
          className="bg-marron text-white px-6 py-2.5 font-medium rounded-sm hover:bg-marron/90 transition-colors disabled:opacity-60"
        >
          {enCours ? "Un instant..." : "Enregistrer"}
        </button>
        {etat?.message && <span className="font-handwriting text-2xl">{etat.message}</span>}
      </div>
    </form>
  );
}
