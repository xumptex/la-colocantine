// Carte "papier" : seul le fond blanc est incliné, le contenu reste droit
// au premier plan (évite le flou de rendu). L'inclinaison s'annule au survol.

export const tilts = {
  left: "-rotate-1",
  right: "rotate-1",
  "left-strong": "-rotate-2",
  "right-strong": "rotate-2",
  none: "",
};

export type Tilt = keyof typeof tilts;

type PaperCardProps = {
  tilt?: Tilt;
  className?: string;
  children: React.ReactNode;
};

export default function PaperCard({ tilt = "left", className = "", children }: PaperCardProps) {
  return (
    <div className={`group relative ${className}`}>
      <div
        aria-hidden
        className={`absolute inset-0 bg-white rounded-sm shadow-xl border border-marron/20 transition-transform duration-500 ease-out group-hover:rotate-0 ${tilts[tilt]}`}
      ></div>
      <div className="relative h-full">{children}</div>
    </div>
  );
}
