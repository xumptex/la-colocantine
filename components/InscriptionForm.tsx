"use client";

import { useState } from "react";
import { Check, Minus, Plus } from "lucide-react";

type InscriptionFormProps = {
  placesRestantes: number;
};

// Formulaire d'inscription au prochain repas (front uniquement pour l'instant :
// rien n'est envoyé, on affiche juste une confirmation).
export default function InscriptionForm({ placesRestantes }: InscriptionFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [nom, setNom] = useState("");
  const [convives, setConvives] = useState(1);
  const [remarques, setRemarques] = useState("");

  const maxConvives = Math.min(placesRestantes, 4);

  if (placesRestantes <= 0) {
    return (
      <button disabled className="w-full bg-marron text-white px-6 py-3 font-medium opacity-50 cursor-not-allowed rounded-sm">
        Complet
      </button>
    );
  }

  if (isSent) {
    return (
      <div className="flex flex-col items-center gap-2 border-2 border-dashed border-marron/40 rounded-sm p-6 text-center">
        <Check size={32} />
        <p className="font-handwriting text-3xl">C&apos;est noté, {nom} !</p>
        <p className="text-sm opacity-80">
          {convives > 1 ? `${convives} places réservées.` : "1 place réservée."} On a hâte de vous voir.
        </p>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-marron text-white px-6 py-3 font-medium rounded-sm hover:bg-marron/90 transition-colors"
      >
        Je m&apos;inscris
      </button>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setIsSent(true);
      }}
      className="space-y-4 text-left"
    >
      <label className="block">
        <span className="text-sm font-medium">Ton prénom</span>
        <input
          required
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="mt-1 w-full border border-marron/30 rounded-sm px-3 py-2 bg-white focus:outline-none focus:border-marron"
          placeholder="Camille"
        />
      </label>

      <div>
        <span className="text-sm font-medium">Nombre de convives</span>
        <div className="mt-1 flex items-center gap-4">
          <button
            type="button"
            onClick={() => setConvives(Math.max(1, convives - 1))}
            disabled={convives <= 1}
            className="p-2 border border-marron/30 rounded-sm disabled:opacity-30"
            aria-label="Retirer un convive"
          >
            <Minus size={16} />
          </button>
          <span className="text-lg font-semibold w-6 text-center">{convives}</span>
          <button
            type="button"
            onClick={() => setConvives(Math.min(maxConvives, convives + 1))}
            disabled={convives >= maxConvives}
            className="p-2 border border-marron/30 rounded-sm disabled:opacity-30"
            aria-label="Ajouter un convive"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <label className="block">
        <span className="text-sm font-medium">Allergies ou remarques</span>
        <textarea
          value={remarques}
          onChange={(e) => setRemarques(e.target.value)}
          rows={2}
          className="mt-1 w-full border border-marron/30 rounded-sm px-3 py-2 bg-white focus:outline-none focus:border-marron resize-none"
          placeholder="Végétarien, sans gluten..."
        />
      </label>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="flex-1 border border-marron px-4 py-3 font-medium rounded-sm hover:bg-marron/5 transition-colors"
        >
          Annuler
        </button>
        <button type="submit" className="flex-1 bg-marron text-white px-4 py-3 font-medium rounded-sm hover:bg-marron/90 transition-colors">
          Valider
        </button>
      </div>
    </form>
  );
}
