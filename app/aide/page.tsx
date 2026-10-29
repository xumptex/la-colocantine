import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";
import PaperCard from "@/components/PaperCard";

export const metadata: Metadata = {
  title: "Aide - La Colocantine",
};

const questions = [
  {
    q: "Comment ça marche ?",
    r: "On organise un repas de temps en temps dans notre coloc. Le menu est annoncé sur l'accueil, tu t'inscris, et tu n'as plus qu'à venir le jour J.",
  },
  {
    q: "Combien ça coûte ?",
    r: "Le prix est indiqué sur chaque repas. Il couvre juste les courses : on ne cherche pas à faire de bénéfice.",
  },
  {
    q: "J'ai une allergie ou un régime particulier",
    r: "Indique-le dans le champ « Allergies ou remarques » lors de ton inscription, on fera de notre mieux pour adapter ton assiette.",
  },
  {
    q: "Je peux venir accompagné ?",
    r: "Oui ! Tu peux réserver jusqu'à 4 places en une seule inscription, dans la limite des places restantes.",
  },
  {
    q: "Je ne peux plus venir, je fais comment ?",
    r: "Préviens-nous dès que possible pour qu'on puisse libérer ta place pour quelqu'un d'autre.",
  },
];

export default function AidePage() {
  return (
    <div className="w-full max-w-3xl mx-auto py-4">
      <header className="text-center text-white mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Aide</h1>
        <p className="mt-3 text-lg opacity-90">Les questions qu&apos;on nous pose souvent.</p>
      </header>

      <PaperCard tilt="left">
        <div className="p-6 md:p-10 divide-y divide-marron/15">
          {questions.map(({ q, r }) => (
            <details key={q} className="group/faq py-4 first:pt-0 last:pb-0">
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-semibold text-lg">
                {q}
                <ChevronDown size={20} className="shrink-0 transition-transform duration-300 group-open/faq:rotate-180" />
              </summary>
              <p className="mt-3 opacity-80 leading-relaxed">{r}</p>
            </details>
          ))}
        </div>
      </PaperCard>
    </div>
  );
}
