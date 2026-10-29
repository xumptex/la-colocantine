import Image from "next/image";
import { Camera } from "lucide-react";
import { tilts, type Tilt } from "./PaperCard";

type PolaroidProps = {
  src?: string;
  alt: string;
  caption?: string;
  tilt?: Tilt;
  className?: string;
};

// Photo style Polaroïd, inclinée en entier (cadre, photo et légende).
// Sans "src", un emplacement photo est affiché (à remplacer par de vraies photos dans /public/photos).
export default function Polaroid({ src, alt, caption, tilt = "right-strong", className = "" }: PolaroidProps) {
  return (
    <figure
      className={`bg-white rounded-sm shadow-xl border border-marron/20 p-3 pb-4 transition-transform duration-500 ease-out hover:rotate-0 ${tilts[tilt]} ${className}`}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-cyanfonce/15 border border-marron/10">
        {src ? (
          <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-marron/50">
            <Camera size={36} />
            <span className="text-sm">Photo à venir</span>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="font-handwriting text-2xl text-center mt-3 leading-tight">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
