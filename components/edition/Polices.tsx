"use client";

import { useEffect } from "react";
import { POLICES, variablesPolices } from "@/lib/polices-catalogue";
import type { Reglages } from "@/lib/contenu/types";
import { useEdition, useZone } from "./Edition";

// Applique les polices du site (et leur aperçu en direct pendant l'édition)
export function PolicesDuSite({ initial }: { initial: Reglages }) {
  const [reglages] = useZone("reglages", initial);

  useEffect(() => {
    const racine = document.documentElement;
    Object.entries(variablesPolices(reglages)).forEach(([variable, valeur]) => racine.style.setProperty(variable, valeur));
  }, [reglages]);

  return null;
}

const ROLES: { cle: keyof Reglages; titre: string; description: string; categorie: "texte" | "manuscrite"; apercu: string }[] = [
  { cle: "policeTitres", titre: "Titres", description: "Les grands titres des pages et des cartes", categorie: "texte", apercu: "Soirée Porc Effiloché" },
  { cle: "policeTexte", titre: "Texte", description: "Le texte courant, les menus, les boutons", categorie: "texte", apercu: "Cuisine réconfortante et grandes tablées." },
  { cle: "policeManuscrite", titre: "Manuscrite", description: "Légendes, livre d'or, petits mots", categorie: "manuscrite", apercu: "La coloc au complet !" },
];

// Fenêtre de choix des polices (mode édition)
export function PanneauPolices({ onFermer }: { onFermer: () => void }) {
  const { zones, modifierZone } = useEdition();
  const reglages = zones.reglages?.valeur as Reglages | undefined;
  if (!reglages) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center bg-black/30 p-4" onClick={onFermer}>
      <div
        role="dialog"
        aria-label="Polices du site"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[85dvh] overflow-y-auto bg-white text-marron rounded-md shadow-2xl p-6 space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold">Polices du site</h2>
          <button type="button" onClick={onFermer} className="text-sm underline opacity-70 hover:opacity-100">
            Fermer
          </button>
        </div>
        <p className="text-sm opacity-70">L&apos;aperçu s&apos;applique directement sur la page. Pense à enregistrer.</p>

        {ROLES.map(({ cle, titre, description, categorie, apercu }) => (
          <section key={cle}>
            <h3 className="font-semibold">{titre}</h3>
            <p className="text-sm opacity-60 mb-2">{description}</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {POLICES.filter((p) => p.categorie === categorie).map((police) => (
                <button
                  key={police.id}
                  type="button"
                  onClick={() => modifierZone("reglages", { ...reglages, [cle]: police.id })}
                  className={`text-left rounded-sm border px-3 py-2 transition ${
                    reglages[cle] === police.id ? "border-marron bg-marron/5 ring-1 ring-marron" : "border-marron/20 hover:border-marron/60"
                  }`}
                >
                  <span className="block text-xs opacity-60">{police.nom}</span>
                  <span className="block text-xl truncate" style={{ fontFamily: `var(${police.variable})` }}>
                    {apercu}
                  </span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
