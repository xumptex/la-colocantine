"use client";

import { useEffect, useState } from "react";
import { CaseSensitive, LoaderCircle, Pencil, Save, X } from "lucide-react";
import { useEdition } from "./Edition";
import { PanneauPolices } from "./Polices";

// Boutons flottants du mode édition (visibles par les admins uniquement)
export default function BarreEdition() {
  const { estAdmin, enEdition, modifie, enregistrement, erreur, commencer, annuler, enregistrer } = useEdition();
  const [polices, setPolices] = useState(false);

  // Avertit avant de quitter le site avec des changements non enregistrés
  useEffect(() => {
    if (!enEdition || !modifie) return;
    const avertir = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", avertir);
    return () => window.removeEventListener("beforeunload", avertir);
  }, [enEdition, modifie]);

  if (!estAdmin) return null;

  if (!enEdition) {
    return (
      <button
        type="button"
        onClick={commencer}
        className="fixed bottom-5 right-5 z-[95] flex items-center gap-2 rounded-full bg-marron text-white px-5 py-3 font-semibold shadow-2xl hover:bg-marron/90 transition"
      >
        <Pencil size={18} /> Modifier la page
      </button>
    );
  }

  const bouton = "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition disabled:opacity-50";

  return (
    <>
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[95] flex flex-col items-center gap-2 w-max max-w-[calc(100vw-2rem)]">
        {erreur && <p className="rounded-md bg-red-700 text-white text-sm px-4 py-2 shadow-lg">{erreur}</p>}
        <div className="flex items-center gap-1 rounded-full bg-marron text-white p-1.5 shadow-2xl">
          <span className="hidden sm:flex items-center gap-2 pl-3 pr-2 text-sm font-semibold">
            <Pencil size={16} /> Mode édition
          </span>
          <button type="button" onClick={() => setPolices(true)} className={`${bouton} hover:bg-white/15`}>
            <CaseSensitive size={18} /> Polices
          </button>
          <button
            type="button"
            onClick={() => (!modifie || window.confirm("Abandonner les changements non enregistrés ?")) && annuler()}
            disabled={enregistrement}
            className={`${bouton} hover:bg-white/15`}
          >
            <X size={18} /> Annuler
          </button>
          <button type="button" onClick={enregistrer} disabled={enregistrement} className={`${bouton} bg-white text-marron hover:bg-white/90`}>
            {enregistrement ? <LoaderCircle size={18} className="animate-spin" /> : <Save size={18} />}
            {enregistrement ? "Enregistrement..." : modifie ? "Enregistrer" : "Terminer"}
          </button>
        </div>
      </div>
      {polices && <PanneauPolices onFermer={() => setPolices(false)} />}
    </>
  );
}
