import Image from "next/image";
import { Trash } from "lucide-react";
import type { Commentaire } from "@/lib/livre-dor";
import { Etoiles } from "./Etoiles";

type PageLivreProps = {
  messages?: Commentaire[];
  numero: number;
  className?: string;
  onSupprimer?: (commentaire: Commentaire) => void; // admins seulement
};

const rotations = ["-rotate-3", "rotate-2", "-rotate-1"];

// "2026-11-15T20:12:00Z" -> "15 novembre 2026"
const dateCourte = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" });

// Une page du livre d'or. Sans messages, c'est une page blanche (fin du livre).
export default function PageLivre({ messages, numero, className = "", onSupprimer }: PageLivreProps) {
  return (
    <div className={`bg-white overflow-hidden flex flex-col ${className}`}>
      <div className="flex-1 flex flex-col p-6 md:p-10">
        <ul className="space-y-6 flex-1">
          {messages?.map((m) => (
            <li key={m.id} className="relative border-b border-dashed border-marron/20 pb-5 last:border-0">
              <Etoiles note={m.note} />
              <p className="mt-1 font-handwriting text-2xl md:text-3xl leading-snug">« {m.message} »</p>

              {/* Photos du convive, en petits Polaroïds */}
              {m.photos.length > 0 && (
                <div className="mt-3 flex gap-3">
                  {m.photos.map((url, i) => (
                    <a key={url} href={url} target="_blank" rel="noopener noreferrer" className={`block bg-white p-1 pb-3 shadow-md border border-marron/15 ${rotations[i % rotations.length]} hover:rotate-0 transition-transform`}>
                      <span className="relative block w-16 h-16 md:w-20 md:h-20">
                        <Image src={url} alt={`Photo de ${m.prenom}`} fill sizes="80px" className="object-cover" />
                      </span>
                    </a>
                  ))}
                </div>
              )}

              <p className="mt-2 text-sm opacity-70">
                <span className="font-semibold">{m.prenom}</span> · {m.repasTitre} · {dateCourte(m.creeLe)}
              </p>

              {onSupprimer && (
                <button
                  type="button"
                  onClick={() => onSupprimer(m)}
                  className="absolute top-0 right-0 flex items-center gap-1 rounded-sm px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                >
                  <Trash size={14} /> Supprimer
                </button>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-sm opacity-50">{numero}</p>
      </div>
    </div>
  );
}
