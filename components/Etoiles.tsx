"use client";

import { useState } from "react";
import { Star } from "lucide-react";

// Note sur 5 étoiles, en lecture
export function Etoiles({ note, taille = 16 }: { note: number; taille?: number }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${note} étoile${note > 1 ? "s" : ""} sur 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={taille} className={i <= note ? "fill-beigefonce text-beigefonce" : "text-marron/25"} />
      ))}
    </span>
  );
}

// Choix de la note (survol pour prévisualiser, clic pour choisir)
export function ChoixEtoiles({ note, onChange }: { note: number; onChange: (note: number) => void }) {
  const [survol, setSurvol] = useState(0);
  const affichee = survol || note;

  return (
    <div className="flex gap-1" onMouseLeave={() => setSurvol(0)} role="radiogroup" aria-label="Note sur 5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          role="radio"
          aria-checked={note === i}
          aria-label={`${i} étoile${i > 1 ? "s" : ""}`}
          onMouseEnter={() => setSurvol(i)}
          onClick={() => onChange(i)}
          className="p-0.5 transition-transform hover:scale-110"
        >
          <Star size={28} className={i <= affichee ? "fill-beigefonce text-beigefonce" : "text-marron/30"} />
        </button>
      ))}
    </div>
  );
}
