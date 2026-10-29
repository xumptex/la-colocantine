import { CalendarDays, Clock, Euro, Users, ArrowRight } from "lucide-react";
import PaperCard from "@/components/PaperCard";
import Polaroid from "@/components/Polaroid";
import UnderlineLink from "@/components/UnderlineLink";
import InscriptionForm from "@/components/InscriptionForm";
import { prochainRepas, formatDate, type Macros } from "@/lib/data";

const macroLabels: { key: keyof Omit<Macros, "kcal">; label: string; max: number }[] = [
  { key: "proteines", label: "Protéines", max: 100 },
  { key: "glucides", label: "Glucides", max: 200 },
  { key: "lipides", label: "Lipides", max: 100 },
];

export default function Home() {
  const repas = prochainRepas;
  const placesRestantes = repas.placesTotal - repas.placesPrises;

  return (
    <div className="flex flex-col items-center space-y-16 py-4 w-full max-w-5xl mx-auto">

      {/* 1. CARTE DE BIENVENUE (droite, sans inclinaison) */}
      <PaperCard tilt="none" className="w-full">
        <section className="p-6 md:p-10 flex flex-col lg:flex-row items-center gap-10">

          {/* Espace Texte */}
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Bienvenue à La Colocantine
            </h1>
            <p className="text-lg opacity-90 leading-relaxed">
              Notre resto éphémère de temps en temps dans notre coloc.
              Cuisine réconfortante, bons produits et grandes tablées entre copains.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-6">
              <UnderlineLink href="#prochain-repas">
                Voir le prochain repas <ArrowRight size={18} />
              </UnderlineLink>
              <UnderlineLink href="/events">Nos anciens repas</UnderlineLink>
            </div>
          </div>

          {/* Emplacement photo Polaroïd */}
          <Polaroid
            alt="La tablée de La Colocantine"
            caption="La coloc au complet !"
            tilt="right-strong"
            className="w-64 shrink-0"
          />
        </section>
      </PaperCard>

      {/* 2. CARTE DU PROCHAIN REPAS (droite, sans inclinaison) */}
      <PaperCard tilt="none" className="w-full max-w-3xl">
        <section id="prochain-repas" className="p-6 md:p-10 scroll-mt-24">
          <p className="font-handwriting text-2xl text-center opacity-80">Prochain repas</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-center tracking-tight mt-1">
            {repas.titre}
          </h2>

          {/* Infos pratiques */}
          <ul className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            <li className="flex items-center gap-2 justify-center capitalize">
              <CalendarDays size={18} className="shrink-0" /> {formatDate(repas.date)}
            </li>
            <li className="flex items-center gap-2 justify-center">
              <Clock size={18} /> {repas.heure}
            </li>
            <li className="flex items-center gap-2 justify-center">
              <Euro size={18} /> {repas.prix} € / pers.
            </li>
            <li className="flex items-center gap-2 justify-center">
              <Users size={18} /> {placesRestantes} places restantes
            </li>
          </ul>

          <div className="mt-8 grid lg:grid-cols-2 gap-10">

            {/* Menu */}
            <div>
              <h3 className="text-xl font-semibold border-b-2 border-marron pb-1 mb-4">Au menu</h3>
              <ul className="space-y-4">
                {repas.menu.map((plat) => (
                  <li key={plat.type}>
                    <p className="text-xs uppercase tracking-widest opacity-60">{plat.type}</p>
                    <p className="font-semibold">{plat.nom}</p>
                    <p className="text-sm opacity-80 leading-relaxed">{plat.description}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Macros + inscription */}
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-xl font-semibold border-b-2 border-marron pb-1 mb-4">Les macros</h3>
                <p className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold">{repas.macros.kcal}</span>
                  <span className="opacity-70">kcal / menu complet</span>
                </p>
                <ul className="mt-4 space-y-3">
                  {macroLabels.map(({ key, label, max }) => (
                    <li key={key}>
                      <div className="flex justify-between text-sm">
                        <span>{label}</span>
                        <span className="font-semibold">{repas.macros[key]} g</span>
                      </div>
                      <div className="mt-1 h-2 bg-marron/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyanfonce rounded-full"
                          style={{ width: `${Math.min(100, (repas.macros[key] / max) * 100)}%` }}
                        ></div>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs opacity-70">
                  Allergènes : {repas.allergenes.join(", ")}
                </p>
              </div>

              <div className="mt-auto">
                <InscriptionForm placesRestantes={placesRestantes} />
              </div>
            </div>
          </div>
        </section>
      </PaperCard>

    </div>
  );
}
