import { CalendarDays, ChevronDown, Clock, Euro } from "lucide-react";
import PaperCard, { type Tilt } from "@/components/PaperCard";
import Polaroid from "@/components/Polaroid";
import TitrePage from "@/components/TitrePage";
import UnderlineLink from "@/components/UnderlineLink";
import InscriptionForm, { PlacesRestantes } from "@/components/InscriptionForm";
import LivreDor from "@/components/LivreDor";
import { formatDate } from "@/lib/data";
import { idRepas, type Bloc, type BlocAnnonce, type BlocFaq, type BlocPolaroids, type BlocTexte, type Inclinaison, type Macros } from "@/lib/contenu/types";

// Affichage des blocs de contenu (pages en lecture). Le mode édition réutilise ces
// mêmes composants pour l'aperçu.

export const tiltDe: Record<Inclinaison, Tilt> = { aucune: "none", gauche: "left", droite: "right" };

// Largeur maximale de chaque bloc dans la page
export function largeurBloc(bloc: Bloc) {
  switch (bloc.type) {
    case "texte":
      return { etroite: "max-w-md", moyenne: "max-w-3xl", large: "max-w-5xl" }[bloc.largeur];
    case "polaroids":
      return "max-w-5xl";
    case "annonce":
    case "faq":
      return "max-w-3xl";
    case "livre-dor":
      return "max-w-6xl";
    default:
      return "";
  }
}

// Rotations alternées pour l'effet "photos jetées sur la table"
const tiltsGalerie: Tilt[] = ["left-strong", "right", "right-strong", "left", "right-strong", "left-strong"];

export function BlocTexteVue({ bloc }: { bloc: BlocTexte }) {
  return (
    <PaperCard tilt={tiltDe[bloc.inclinaison]} className="w-full">
      <section className="p-6 md:p-10 flex flex-col lg:flex-row items-center gap-10">
        <div className="flex-1 min-w-0 space-y-6 text-center lg:text-left">
          {bloc.titre && <h2 className="font-titres text-4xl md:text-5xl font-extrabold tracking-tight">{bloc.titre}</h2>}
          {bloc.texte && (
            <p
              className={`whitespace-pre-line ${
                bloc.style === "manuscrit" ? "font-handwriting text-3xl leading-snug" : "text-lg opacity-90 leading-relaxed"
              }`}
            >
              {bloc.texte}
            </p>
          )}
          {bloc.liens.length > 0 && (
            <div className="flex flex-wrap justify-center lg:justify-start gap-6">
              {bloc.liens.map((lien, i) => (
                <UnderlineLink key={i} href={lien.url || "#"}>
                  {lien.texte}
                </UnderlineLink>
              ))}
            </div>
          )}
        </div>
        {bloc.photo && (
          <Polaroid src={bloc.photo.url} alt={bloc.photo.legende} caption={bloc.photo.legende} tilt="right-strong" className="w-64 shrink-0" />
        )}
      </section>
    </PaperCard>
  );
}

export function BlocPolaroidsVue({ bloc }: { bloc: BlocPolaroids }) {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12 px-4 sm:px-0">
      {bloc.photos.map((photo, i) => (
        <div key={i} className={i % 2 === 1 ? "lg:mt-8" : ""}>
          <Polaroid src={photo.url} alt={photo.legende} caption={photo.legende} tilt={tiltsGalerie[i % tiltsGalerie.length]} />
          {photo.details && <p className="mt-4 text-center text-sm text-white/90 first-letter:uppercase">{photo.details}</p>}
        </div>
      ))}
    </div>
  );
}

const macroLabels: { key: keyof Omit<Macros, "kcal">; label: string; max: number }[] = [
  { key: "proteines", label: "Protéines", max: 100 },
  { key: "glucides", label: "Glucides", max: 200 },
  { key: "lipides", label: "Lipides", max: 100 },
];

// Date lisible, ou "Date à définir" si elle n'est pas renseignée
export function dateRepas(iso: string) {
  return iso && !Number.isNaN(new Date(iso).getTime()) ? formatDate(iso) : "Date à définir";
}

export function BlocAnnonceVue({ bloc }: { bloc: BlocAnnonce }) {
  const { repas } = bloc;
  const places = { repasId: idRepas(bloc), placesTotal: repas.placesTotal, placesHorsSite: repas.placesPrises };

  return (
    <PaperCard tilt="none" className="w-full">
      {/* L'id sert d'ancre ("#prochain-repas" pour l'annonce d'origine) */}
      <section id={bloc.id} className="p-6 md:p-10 scroll-mt-24">
        {bloc.surtitre && <p className="font-handwriting text-2xl text-center opacity-80">{bloc.surtitre}</p>}
        <h2 className="font-titres text-3xl md:text-4xl font-extrabold text-center tracking-tight mt-1">{repas.titre}</h2>

        {/* Infos pratiques */}
        <ul className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
          <li className="flex items-center gap-2 justify-center">
            <CalendarDays size={18} className="shrink-0" /> <span className="first-letter:uppercase">{dateRepas(repas.date)}</span>
          </li>
          <li className="flex items-center gap-2 justify-center">
            <Clock size={18} /> {repas.heure}
          </li>
          <li className="flex items-center gap-2 justify-center">
            <Euro size={18} /> {repas.prix} € / pers.
          </li>
          <li className="flex items-center gap-2 justify-center">
            <PlacesRestantes {...places} />
          </li>
        </ul>

        <div className="mt-8 grid lg:grid-cols-2 gap-10">
          {/* Menu */}
          <div>
            <h3 className="text-xl font-semibold border-b-2 border-marron pb-1 mb-4">Au menu</h3>
            <ul className="space-y-4">
              {repas.menu.map((plat, i) => (
                <li key={i}>
                  <p className="text-xs uppercase tracking-widest opacity-60">{plat.categorie}</p>
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
              {repas.allergenes.length > 0 && <p className="mt-4 text-xs opacity-70">Allergènes : {repas.allergenes.join(", ")}</p>}
            </div>

            <div className="mt-auto">
              <InscriptionForm {...places} dateRepas={repas.date} />
            </div>
          </div>
        </div>
      </section>
    </PaperCard>
  );
}

export function BlocFaqVue({ bloc }: { bloc: BlocFaq }) {
  return (
    <PaperCard tilt={tiltDe[bloc.inclinaison]} className="w-full">
      <div className="p-6 md:p-10 divide-y divide-marron/15">
        {bloc.questions.map(({ question, reponse }, i) => (
          <details key={i} className="group/faq py-4 first:pt-0 last:pb-0">
            <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-semibold text-lg">
              {question}
              <ChevronDown size={20} className="shrink-0 transition-transform duration-300 group-open/faq:rotate-180" />
            </summary>
            <p className="mt-3 opacity-80 leading-relaxed whitespace-pre-line">{reponse}</p>
          </details>
        ))}
      </div>
    </PaperCard>
  );
}

export function BlocVue({ bloc }: { bloc: Bloc }) {
  switch (bloc.type) {
    case "titre":
      return <TitrePage titre={bloc.titre} sousTitre={bloc.sousTitre} className="" />;
    case "texte":
      return <BlocTexteVue bloc={bloc} />;
    case "polaroids":
      return <BlocPolaroidsVue bloc={bloc} />;
    case "annonce":
      return <BlocAnnonceVue bloc={bloc} />;
    case "faq":
      return <BlocFaqVue bloc={bloc} />;
    case "livre-dor":
      return <LivreDor />;
  }
}

// Mise en page commune : les blocs les uns sous les autres, centrés
export function ListeBlocs({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col items-center gap-12 lg:gap-16 w-full max-w-6xl mx-auto py-4">{children}</div>;
}

export function RenduBlocs({ blocs }: { blocs: Bloc[] }) {
  return (
    <ListeBlocs>
      {blocs.map((bloc) => (
        <div key={bloc.id} className={`w-full ${largeurBloc(bloc)}`}>
          <BlocVue bloc={bloc} />
        </div>
      ))}
    </ListeBlocs>
  );
}
