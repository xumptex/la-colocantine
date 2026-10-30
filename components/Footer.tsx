import Image from "next/image";
import { Mail, MapPin } from "lucide-react";
import Polaroid from "./Polaroid";
import UnderlineLink from "./UnderlineLink";
import type { Tilt } from "./PaperCard";
import { contact, equipe } from "@/lib/data";

// Lucide ne fournit plus d'icônes de marques : pictogramme Instagram dessiné dans le même style
function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

// Rotations alternées des photos de l'équipe
const tiltsEquipe: Tilt[] = ["left-strong", "right", "left", "right-strong"];

export default function Footer() {
  return (
    <footer className="relative mt-20 bg-white">
      {/* Effet papier au-dessus du pied de page (rappel de la barre de navigation) */}
      <div className="lg:hidden absolute -top-2 left-0 w-full h-8 bg-marron -skew-y-1 origin-top-left -z-15"></div>
      <div className="hidden lg:block absolute -top-4 left-0 w-full h-12 bg-marron -skew-y-[0.5deg] origin-top-left -z-15"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid gap-12 lg:grid-cols-[3fr_2fr] lg:gap-16">

          {/* L'équipe */}
          <section>
            <h2 className="font-handwriting text-3xl text-center lg:text-left">Qui sommes-nous ?</h2>
            <ul className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-sm sm:max-w-2xl mx-auto lg:mx-0">
              {equipe.map((membre, i) => (
                <li key={membre.prenom}>
                  <Polaroid
                    src={membre.photo}
                    alt={`Photo de ${membre.prenom}`}
                    caption={membre.prenom}
                    tilt={tiltsEquipe[i % tiltsEquipe.length]}
                    legendeClassName="text-xl mt-2"
                  />
                  <p className="mt-3 text-center text-sm font-medium opacity-80">{membre.role}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Contacts */}
          <section className="text-center lg:text-left">
            <h2 className="font-handwriting text-3xl">Nous trouver</h2>
            <ul className="mt-6 space-y-3 flex flex-col items-center lg:items-start">
              <li>
                <UnderlineLink href={`mailto:${contact.email}`}>
                  <Mail size={18} /> {contact.email}
                </UnderlineLink>
              </li>
              <li>
                <UnderlineLink href={`https://www.instagram.com/${contact.instagram}`}>
                  <InstagramIcon /> @{contact.instagram}
                </UnderlineLink>
              </li>
              <li className="flex items-start gap-2 py-1 font-medium">
                <MapPin size={18} className="mt-0.5 shrink-0" />
                <span>
                  {contact.adresse}
                  <span className="block font-normal opacity-70">{contact.ville}</span>
                </span>
              </li>
            </ul>
          </section>
        </div>

        {/* Bas de page */}
        <div className="mt-12 pt-6 border-t border-marron/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm opacity-80">
          <Image src="/Colocatine_logo_horiztonal.png" alt="La Colocantine" width={160} height={32} />
          <p>Nous ne sommes pas responsable en cas d'intoxication alimentaire.</p>
        </div>
      </div>
    </footer>
  );
}
