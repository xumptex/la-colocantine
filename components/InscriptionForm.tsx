"use client";

import { useEffect, useState } from "react";
import { Check, Minus, Plus, Users } from "lucide-react";
import { creerClientNavigateur } from "@/lib/supabase/client";
import { supabaseConfigure } from "@/lib/supabase/env";
import { inscrire } from "@/app/repas/actions";
import { useEdition } from "./edition/Edition";

// Places prises d'un repas (inscriptions en base), partagées entre les composants de la page
const EVENEMENT_MAJ = "places-maj";
const chargements = new Map<string, Promise<number>>();

function chargerPlaces(repasId: string) {
  if (!supabaseConfigure()) return Promise.resolve(0);
  if (!chargements.has(repasId)) {
    const requete = Promise.resolve(creerClientNavigateur().rpc("places_prises", { p_repas_id: repasId })).then(
      ({ data }) => (data as number | null) ?? 0
    );
    chargements.set(repasId, requete);
  }
  return chargements.get(repasId)!;
}

function rechargerPlaces(repasId: string) {
  chargements.delete(repasId);
  window.dispatchEvent(new CustomEvent(EVENEMENT_MAJ, { detail: repasId }));
}

function usePlacesPrises(repasId: string) {
  const [prises, setPrises] = useState<number | null>(null);
  useEffect(() => {
    let actif = true;
    const charger = () => chargerPlaces(repasId).then((n) => actif && setPrises(n));
    const surMaj = (e: Event) => (e as CustomEvent).detail === repasId && charger();
    charger();
    window.addEventListener(EVENEMENT_MAJ, surMaj);
    return () => {
      actif = false;
      window.removeEventListener(EVENEMENT_MAJ, surMaj);
    };
  }, [repasId]);
  return prises;
}

type PlacesProps = {
  repasId: string;
  placesTotal: number;
  placesHorsSite: number; // places déjà prises en dehors du site (réglage de l'annonce)
};

const restantes = (total: number, horsSite: number, prises: number) => Math.max(0, total - horsSite - prises);

// "x places restantes" dans les infos de l'annonce
export function PlacesRestantes({ repasId, placesTotal, placesHorsSite }: PlacesProps) {
  const prises = usePlacesPrises(repasId);
  return (
    <>
      <Users size={18} />
      {prises === null ? "…" : restantes(placesTotal, placesHorsSite, prises)} places restantes
    </>
  );
}

const champ = "mt-1 w-full border border-marron/30 rounded-sm px-3 py-2 bg-white focus:outline-none focus:border-marron";

type InscriptionFormProps = PlacesProps & { dateRepas: string };

// Inscriptions possibles jusqu'au jour du repas inclus. Calculé dans le navigateur :
// la page est pré-générée, la date du jour n'y est pas connue.
function useInscriptionsFermees(dateRepas: string) {
  const [fermees, setFermees] = useState(false);
  useEffect(() => {
    setFermees(Boolean(dateRepas) && dateRepas < new Date().toISOString().slice(0, 10));
  }, [dateRepas]);
  return fermees;
}

// Inscription à un repas : avec son compte si on est connecté, sinon avec prénom + email
export default function InscriptionForm({ repasId, placesTotal, placesHorsSite, dateRepas }: InscriptionFormProps) {
  const { utilisateur } = useEdition();
  const inscriptionsFermees = useInscriptionsFermees(dateRepas);
  const prises = usePlacesPrises(repasId);
  const placesRestantes = prises === null ? null : restantes(placesTotal, placesHorsSite, prises);

  const [isOpen, setIsOpen] = useState(false);
  const [inscrit, setInscrit] = useState<{ prenom: string; convives: number } | null>(null);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [convives, setConvives] = useState(1);
  const [remarques, setRemarques] = useState("");

  const maxConvives = Math.max(1, Math.min(placesRestantes ?? 1, 4));

  if (inscriptionsFermees) {
    return (
      <button disabled className="w-full bg-marron text-white px-6 py-3 font-medium opacity-50 cursor-not-allowed rounded-sm">
        Inscriptions fermées
      </button>
    );
  }

  if (inscrit) {
    return (
      <div className="flex flex-col items-center gap-2 border-2 border-dashed border-marron/40 rounded-sm p-6 text-center">
        <Check size={32} />
        <p className="font-handwriting text-3xl">C&apos;est noté, {inscrit.prenom} !</p>
        <p className="text-sm opacity-80">
          {inscrit.convives > 1 ? `${inscrit.convives} places réservées.` : "1 place réservée."} On a hâte de vous voir.
        </p>
      </div>
    );
  }

  if (placesRestantes === 0) {
    return (
      <button disabled className="w-full bg-marron text-white px-6 py-3 font-medium opacity-50 cursor-not-allowed rounded-sm">
        Complet
      </button>
    );
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        disabled={placesRestantes === null}
        className="w-full bg-marron text-white px-6 py-3 font-medium rounded-sm hover:bg-marron/90 transition-colors disabled:opacity-60"
      >
        Je m&apos;inscris
      </button>
    );
  }

  const envoyer = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnCours(true);
    setErreur(null);
    const resultat = await inscrire({ repasId, prenom: nom, email, convives, remarques });
    setEnCours(false);
    if (resultat.erreur) return setErreur(resultat.erreur);
    setInscrit({ prenom: resultat.prenom ?? nom, convives });
    rechargerPlaces(repasId);
  };

  return (
    <form onSubmit={envoyer} className="space-y-4 text-left">
      {utilisateur ? (
        <p className="text-sm">
          Inscription au nom de <span className="font-semibold">{utilisateur.prenom ?? utilisateur.email}</span>
          <span className="block opacity-60">{utilisateur.email}</span>
        </p>
      ) : (
        <>
          <label className="block">
            <span className="text-sm font-medium">Ton prénom</span>
            <input required value={nom} onChange={(e) => setNom(e.target.value)} autoComplete="given-name" className={champ} placeholder="Camille" />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Ton email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className={champ}
              placeholder="camille@exemple.fr"
            />
            <span className="mt-1 block text-xs opacity-60">Après le repas, on t&apos;y enverra un lien pour laisser un mot dans le livre d&apos;or.</span>
          </label>
        </>
      )}

      <div>
        <span className="text-sm font-medium">Nombre de convives</span>
        <div className="mt-1 flex items-center gap-4">
          <button
            type="button"
            onClick={() => setConvives(Math.max(1, convives - 1))}
            disabled={convives <= 1}
            className="p-2 border border-marron/30 rounded-sm disabled:opacity-30"
            aria-label="Retirer un convive"
          >
            <Minus size={16} />
          </button>
          <span className="text-lg font-semibold w-6 text-center">{convives}</span>
          <button
            type="button"
            onClick={() => setConvives(Math.min(maxConvives, convives + 1))}
            disabled={convives >= maxConvives}
            className="p-2 border border-marron/30 rounded-sm disabled:opacity-30"
            aria-label="Ajouter un convive"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <label className="block">
        <span className="text-sm font-medium">Allergies ou remarques</span>
        <textarea
          value={remarques}
          onChange={(e) => setRemarques(e.target.value)}
          rows={2}
          maxLength={500}
          className={`${champ} resize-none`}
          placeholder="Végétarien, sans gluten..."
        />
      </label>

      {erreur && (
        <p role="alert" className="text-sm text-red-700">
          {erreur}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="flex-1 border border-marron px-4 py-3 font-medium rounded-sm hover:bg-marron/5 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={enCours}
          className="flex-1 bg-marron text-white px-4 py-3 font-medium rounded-sm hover:bg-marron/90 transition-colors disabled:opacity-60"
        >
          {enCours ? "Un instant..." : "Valider"}
        </button>
      </div>
    </form>
  );
}
