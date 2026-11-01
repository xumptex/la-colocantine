"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Mail, MapPin, Trash } from "lucide-react";
import Polaroid from "./Polaroid";
import UnderlineLink from "./UnderlineLink";
import type { Tilt } from "./PaperCard";
import type { ContenuFooter } from "@/lib/contenu/types";
import { useZone } from "./edition/Edition";
import { BoutonAjouter, BoutonIcone, ChampTexte, ChoixPhoto } from "./edition/ui";
import { deplacer, remplacer, retirer } from "./edition/EditeursBlocs";

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
const rotationsEquipe = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

// Contenu du pied de page : affiché normalement, ou modifiable en mode édition
export default function FooterContenu({ initial }: { initial: ContenuFooter }) {
  const [footer, setFooter, enEdition] = useZone("footer", initial);
  const maj = (modif: Partial<ContenuFooter>) => setFooter({ ...footer, ...modif });
  const { equipe } = footer;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
      {enEdition && (
        <p className="mb-8 text-center text-sm font-semibold rounded-md border-2 border-dashed border-marron/30 py-2">
          Pied de page (commun à toutes les pages) : modifiable ici
        </p>
      )}
      <div className="grid gap-12 lg:grid-cols-[3fr_2fr] lg:gap-16">
        {/* L'équipe */}
        <section>
          {enEdition ? (
            <ChampTexte valeur={footer.titreEquipe} onChange={(titreEquipe) => maj({ titreEquipe })} className="font-handwriting text-3xl" />
          ) : (
            <h2 className="font-handwriting text-3xl text-center lg:text-left">{footer.titreEquipe}</h2>
          )}
          <ul className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-sm sm:max-w-2xl mx-auto lg:mx-0">
            {equipe.map((membre, i) =>
              enEdition ? (
                <li key={i}>
                  <figure className={`bg-white rounded-sm shadow-xl border border-marron/20 p-3 pb-4 ${rotationsEquipe[i % rotationsEquipe.length]}`}>
                    <ChoixPhoto url={membre.url} onChange={(url) => maj({ equipe: remplacer(equipe, i, { ...membre, url }) })} />
                    <ChampTexte
                      valeur={membre.legende}
                      onChange={(legende) => maj({ equipe: remplacer(equipe, i, { ...membre, legende }) })}
                      placeholder="Prénom"
                      className="font-handwriting text-xl text-center mt-2"
                    />
                  </figure>
                  <ChampTexte
                    valeur={membre.role}
                    onChange={(role) => maj({ equipe: remplacer(equipe, i, { ...membre, role }) })}
                    placeholder="Rôle"
                    className="mt-3 text-center text-sm font-medium"
                  />
                  <div className="mt-1 flex justify-center">
                    <BoutonIcone icone={ArrowLeft} label="Avancer" disabled={i === 0} onClick={() => maj({ equipe: deplacer(equipe, i, -1) })} />
                    <BoutonIcone
                      icone={ArrowRight}
                      label="Reculer"
                      disabled={i === equipe.length - 1}
                      onClick={() => maj({ equipe: deplacer(equipe, i, 1) })}
                    />
                    <BoutonIcone icone={Trash} label="Retirer" danger onClick={() => maj({ equipe: retirer(equipe, i) })} />
                  </div>
                </li>
              ) : (
                <li key={i}>
                  <Polaroid
                    src={membre.url}
                    alt={`Photo de ${membre.legende}`}
                    caption={membre.legende}
                    tilt={tiltsEquipe[i % tiltsEquipe.length]}
                    legendeClassName="text-xl mt-2"
                  />
                  <p className="mt-3 text-center text-sm font-medium opacity-80">{membre.role}</p>
                </li>
              )
            )}
            {enEdition && (
              <li>
                <BoutonAjouter
                  texte="Ajouter"
                  onClick={() => maj({ equipe: [...equipe, { legende: "Prénom", role: "Rôle" }] })}
                  className="w-full aspect-square"
                />
              </li>
            )}
          </ul>
        </section>

        {/* Contacts */}
        <section className="text-center lg:text-left">
          {enEdition ? (
            <div className="space-y-4 text-left">
              <ChampTexte valeur={footer.titreContact} onChange={(titreContact) => maj({ titreContact })} className="font-handwriting text-3xl" />
              <label className="flex items-center gap-2">
                <Mail size={18} className="shrink-0" />
                <ChampTexte valeur={footer.email} onChange={(email) => maj({ email })} placeholder="Email" className="font-medium" />
              </label>
              <label className="flex items-center gap-2">
                <InstagramIcon />
                <span className="font-medium">@</span>
                <ChampTexte
                  valeur={footer.instagram}
                  onChange={(instagram) => maj({ instagram: instagram.replace(/^@/, "") })}
                  placeholder="compte Instagram"
                  className="font-medium"
                />
              </label>
              <label className="flex items-start gap-2">
                <MapPin size={18} className="mt-1 shrink-0" />
                <span className="flex-1 space-y-1">
                  <ChampTexte valeur={footer.adresse} onChange={(adresse) => maj({ adresse })} placeholder="Adresse" className="font-medium" />
                  <ChampTexte valeur={footer.ville} onChange={(ville) => maj({ ville })} placeholder="Ville" className="opacity-70" />
                </span>
              </label>
            </div>
          ) : (
            <>
              <h2 className="font-handwriting text-3xl">{footer.titreContact}</h2>
              <ul className="mt-6 space-y-3 flex flex-col items-center lg:items-start">
                {footer.email && (
                  <li>
                    <UnderlineLink href={`mailto:${footer.email}`}>
                      <Mail size={18} /> {footer.email}
                    </UnderlineLink>
                  </li>
                )}
                {footer.instagram && (
                  <li>
                    <UnderlineLink href={`https://www.instagram.com/${footer.instagram}`}>
                      <InstagramIcon /> @{footer.instagram}
                    </UnderlineLink>
                  </li>
                )}
                {footer.adresse && (
                  <li className="flex items-start gap-2 py-1 font-medium">
                    <MapPin size={18} className="mt-0.5 shrink-0" />
                    <span>
                      {footer.adresse}
                      <span className="block font-normal opacity-70">{footer.ville}</span>
                    </span>
                  </li>
                )}
              </ul>
            </>
          )}
        </section>
      </div>

      {/* Bas de page */}
      <div className="mt-12 pt-6 border-t border-marron/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm opacity-80">
        <Image src="/Colocatine_logo_horiztonal.png" alt="La Colocantine" width={160} height={32} />
        {enEdition ? (
          <ChampTexte valeur={footer.mention} onChange={(mention) => maj({ mention })} placeholder="Petite mention" className="sm:max-w-md sm:text-right" />
        ) : (
          <p>{footer.mention}</p>
        )}
      </div>
    </div>
  );
}
