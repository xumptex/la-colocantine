"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Hand } from "lucide-react";
import PageLivre from "./PageLivre";
import type { MessageLivreDor } from "@/lib/data";

const DUREE_PC = 900; // durée d'un tour de page sur PC, en ms
const DUREE_GLISSE = 350; // durée de fin de glissement sur téléphone, en ms
const SEUIL_GLISSE = 0.25; // part de la largeur à glisser pour tourner la page

type Sens = "suivante" | "precedente";

type LivreProps = {
  pages: MessageLivreDor[][];
};

// Fait tourner la page pendant DUREE_PC ms puis valide le changement.
// (minuteur plutôt que "animationend", plus fiable)
function useTourDePage(onFini: (sens: Sens) => void) {
  const [tourne, setTourne] = useState<Sens | null>(null);

  // onFini utilise des mises à jour fonctionnelles : pas besoin de la dernière version
  useEffect(() => {
    if (!tourne) return;
    const minuteur = setTimeout(() => {
      onFini(tourne);
      setTourne(null);
    }, DUREE_PC);
    return () => clearTimeout(minuteur);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourne]);

  return [tourne, (sens: Sens) => !tourne && setTourne(sens)] as const;
}

const animPC = (nom: string) => `${nom} ${DUREE_PC}ms ease-in-out forwards`;

type OmbreProps = {
  de: string; // position de départ (left, en % du livre ou de la feuille)
  a: string; // position d'arrivée
  versLaDroite: boolean; // côté où l'ombre s'étend
  intensite?: string; // classe Tailwind de la couleur de départ du dégradé
};

// Ombre en dégradé qui suit le pli ou le bord de la feuille pendant le tour
function Ombre({ de, a, versLaDroite, intensite = "from-marron/30" }: OmbreProps) {
  return (
    <div
      aria-hidden
      className={`absolute inset-y-0 z-20 w-12 pointer-events-none to-transparent ${intensite} ${
        versLaDroite ? "bg-gradient-to-r" : "bg-gradient-to-l -translate-x-full"
      }`}
      style={{ opacity: 0, animation: animPC("deplacer-ombre"), ["--de" as string]: de, ["--a" as string]: a }}
    ></div>
  );
}

type TourDePageProps = {
  sens: Sens;
  feuille: React.ReactNode; // page qu'on tourne
  devant: React.ReactNode; // page de l'autre côté, visible devant le pli jusqu'à ce qu'il l'atteigne
};

// Tour de page sur PC : la feuille glisse sur toute la largeur du livre sans se déformer.
// Le pli part de la reliure et avance deux fois moins vite qu'elle : ce qui passe derrière
// le pli est replié dessous (non affiché). Derrière la feuille, les nouvelles pages apparaissent.
// À mi-parcours, on voit la moitié de la feuille côté bord libre, contre la reliure de l'autre côté.
function TourDePage({ sens, feuille, devant }: TourDePageProps) {
  const versLaGauche = sens === "suivante";

  return (
    <>
      {/* Page de l'autre côté, rognée par le pli qui avance */}
      <div
        className={`absolute inset-y-0 w-1/2 z-10 ${versLaGauche ? "left-0" : "left-1/2"}`}
        style={{ animation: animPC(versLaGauche ? "rogner-par-la-droite" : "rogner-par-la-gauche") }}
      >
        {devant}
      </div>
      {/* Ombre du pli sur cette page */}
      <Ombre de="50%" a={versLaGauche ? "0%" : "100%"} versLaDroite={!versLaGauche} intensite="from-marron/20" />

      {/* Feuille qui glisse, rognée côté pli */}
      <div
        className={`absolute inset-y-0 w-1/2 z-10 ${versLaGauche ? "left-1/2" : "left-0"}`}
        style={{ animation: animPC(versLaGauche ? "feuille-vers-gauche" : "feuille-vers-droite") }}
      >
        {feuille}
        {/* Arrondi du pli : la feuille fonce en s'enroulant */}
        <Ombre de={versLaGauche ? "0%" : "100%"} a={versLaGauche ? "100%" : "0%"} versLaDroite={versLaGauche} />
      </div>

      {/* Ombre portée par le bord libre de la feuille, soulevée au-dessus des pages */}
      <Ombre de={versLaGauche ? "100%" : "0%"} a={versLaGauche ? "0%" : "100%"} versLaDroite={versLaGauche} />
    </>
  );
}

// PC : livre ouvert sur une double page
function LivreDouble({ pages }: LivreProps) {
  const [doublePage, setDoublePage] = useState(0);
  const [tourne, tourner] = useTourDePage((sens) => setDoublePage((d) => d + (sens === "suivante" ? 1 : -1)));

  const nbDoublesPages = Math.ceil(pages.length / 2);
  const gauche = doublePage * 2;

  // Pages visibles derrière la feuille qui tourne : la double page d'arrivée
  const gaucheDessous = tourne === "suivante" ? gauche + 2 : tourne === "precedente" ? gauche - 2 : gauche;
  const droiteDessous = gaucheDessous + 1;

  const page = (i: number) => (
    <PageLivre messages={pages[i]} numero={i + 1} className="h-full border border-beigefonce/60" />
  );

  const fleche = "absolute bottom-3 z-30 p-1 text-beigefonce hover:text-marron transition-colors";

  return (
    <div className="bg-marron rounded-md p-4 shadow-2xl">
      <div className="relative grid grid-cols-2 h-[36rem] overflow-hidden">
        {page(gaucheDessous)}
        {page(droiteDessous)}

        {tourne && (
          <TourDePage
            sens={tourne}
            feuille={page(tourne === "suivante" ? gauche + 1 : gauche)}
            devant={page(tourne === "suivante" ? gauche : gauche + 1)}
          />
        )}

        {/* Ombre de reliure au centre (masquée pendant qu'une page tourne) */}
        <div
          aria-hidden
          className={`absolute inset-y-0 left-1/2 w-12 -translate-x-1/2 bg-gradient-to-r from-transparent via-marron/10 to-transparent pointer-events-none z-20 transition-opacity duration-200 ${
            tourne ? "opacity-0" : "opacity-100"
          }`}
        ></div>

        {doublePage > 0 && (
          <button onClick={() => tourner("precedente")} className={`${fleche} left-3`} aria-label="Page précédente">
            <ChevronLeft size={28} />
          </button>
        )}
        {doublePage < nbDoublesPages - 1 && (
          <button onClick={() => tourner("suivante")} className={`${fleche} right-3`} aria-label="Page suivante">
            <ChevronRight size={28} />
          </button>
        )}
      </div>
    </div>
  );
}

// Téléphone : comme une liseuse, la page glisse sous le doigt et recouvre / découvre l'autre
function LivreSimple({ pages }: LivreProps) {
  const [pageCourante, setPageCourante] = useState(0);
  const [aDejaTourne, setADejaTourne] = useState(false);

  // Glissement en cours : sens + avancement (0 = page en place, 1 = page tournée)
  const [sens, setSens] = useState<Sens | null>(null);
  const [avancement, setAvancement] = useState(0);
  const [finEnCours, setFinEnCours] = useState(false);
  const zone = useRef<HTMLDivElement>(null);
  const debut = useRef<number | null>(null);

  const debutGlisse = (x: number) => {
    if (finEnCours) return;
    debut.current = x;
  };

  const glisse = (x: number) => {
    if (debut.current === null) return;
    const dx = (x - debut.current) / (zone.current?.offsetWidth || 1);
    const nouveauSens: Sens | null =
      dx < 0 && pageCourante < pages.length - 1 ? "suivante" : dx > 0 && pageCourante > 0 ? "precedente" : null;
    setSens(nouveauSens);
    setAvancement(nouveauSens ? Math.min(1, Math.abs(dx)) : 0);
  };

  const finGlisse = () => {
    if (debut.current === null) return;
    debut.current = null;
    if (!sens) return;

    // On termine le mouvement (ou on annule), puis on valide sans animation
    const tourneLaPage = avancement > SEUIL_GLISSE;
    setFinEnCours(true);
    setAvancement(tourneLaPage ? 1 : 0);
    setTimeout(() => {
      if (tourneLaPage) {
        setPageCourante((p) => p + (sens === "suivante" ? 1 : -1));
        setADejaTourne(true);
      }
      setSens(null);
      setAvancement(0);
      setFinEnCours(false);
    }, DUREE_GLISSE);
  };

  // Page fixe en dessous, et page qui glisse par-dessus
  const dessous = sens === "suivante" ? pageCourante + 1 : pageCourante;
  const dessus = sens === "suivante" ? pageCourante : pageCourante - 1;
  // Position de la page qui glisse, en % de largeur (0 = en place, -100 = sortie à gauche)
  const position = sens === "suivante" ? -avancement * 100 : (avancement - 1) * 100;
  // Ombre du pli : s'estompe quand la page qui glisse sort complètement de l'écran
  const bordVisible = sens === "suivante" ? 1 - avancement : avancement;
  const ombre = Math.min(1, bordVisible * 4);

  return (
    <div>
      {/* Incitation à glisser (disparaît après la première page tournée) */}
      {pages.length > 1 && !aDejaTourne && (
        <p className="mb-3 flex items-center justify-center gap-2 text-sm text-white opacity-90">
          <Hand size={18} className="animate-inciter-swipe" />
          Glisse pour tourner les pages
        </p>
      )}

      <div ref={zone} className="relative overflow-hidden rounded-sm shadow-2xl">
        <PageLivre messages={pages[dessous]} numero={dessous + 1} className="min-h-[36rem]" />

        {sens && (
          <div
            className={`absolute inset-0 z-10 ${finEnCours ? "transition-transform ease-out" : ""}`}
            style={{ transform: `translateX(${position}%)`, transitionDuration: `${DUREE_GLISSE}ms` }}
          >
            <PageLivre messages={pages[dessus]} numero={dessus + 1} className="h-full" />
            {/* Pli : léger assombrissement du bord de la page + ombre portée sur celle d'en dessous */}
            <div aria-hidden className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-black/10 to-transparent pointer-events-none"></div>
            <div
              aria-hidden
              className={`absolute inset-y-0 left-full w-10 bg-gradient-to-r from-black/25 to-transparent pointer-events-none ${
                finEnCours ? "transition-opacity" : ""
              }`}
              style={{ opacity: ombre, transitionDuration: `${DUREE_GLISSE}ms` }}
            ></div>
          </div>
        )}

        {/* Zone tactile fixe au-dessus des pages : le contenu change pendant le glissement,
            et un élément retiré du DOM ne transmettrait plus les mouvements du doigt */}
        <div
          className="absolute inset-0 z-20 touch-pan-y"
          onTouchStart={(e) => debutGlisse(e.touches[0].clientX)}
          onTouchMove={(e) => glisse(e.touches[0].clientX)}
          onTouchEnd={finGlisse}
          onTouchCancel={finGlisse}
        ></div>
      </div>

      {/* Indicateur de position */}
      {pages.length > 1 && (
        <div className="mt-5 flex justify-center gap-2" aria-label={`Page ${pageCourante + 1} sur ${pages.length}`}>
          {pages.map((_, i) => (
            <span
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${i === pageCourante ? "w-6 bg-white" : "w-2 bg-white/40"}`}
            ></span>
          ))}
        </div>
      )}
    </div>
  );
}

// Double page sur PC, une page à la fois sur téléphone (bascule au breakpoint lg)
export default function Livre({ pages }: LivreProps) {
  return (
    <>
      <div className="hidden lg:block">
        <LivreDouble pages={pages} />
      </div>
      <div className="lg:hidden">
        <LivreSimple pages={pages} />
      </div>
    </>
  );
}
