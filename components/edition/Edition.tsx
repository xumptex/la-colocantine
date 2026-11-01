"use client";

import { createContext, use, useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { creerClientNavigateur } from "@/lib/supabase/client";
import { supabaseConfigure } from "@/lib/supabase/env";
import { enregistrerContenu } from "@/app/edition/actions";

// Une zone modifiable : contenu publié (initial) et brouillon en cours d'édition (valeur)
type Zone = { initial: unknown; valeur: unknown };

export type Utilisateur = { id: string; email: string; prenom: string | null };

type ContexteEdition = {
  utilisateur: Utilisateur | null; // connecté ou non (affichage seulement)
  estAdmin: boolean;
  enEdition: boolean;
  zones: Record<string, Zone>;
  modifie: boolean; // au moins une zone a des changements non enregistrés
  enregistrement: boolean;
  erreur: string | null;
  commencer: () => void;
  annuler: () => void;
  enregistrer: () => Promise<void>;
  declarerZone: (cle: string, initial: unknown) => void;
  retirerZone: (cle: string) => void;
  modifierZone: (cle: string, valeur: unknown) => void;
};

const Contexte = createContext<ContexteEdition | null>(null);

export function useEdition() {
  const ctx = use(Contexte);
  if (!ctx) throw new Error("useEdition doit être utilisé dans <FournisseurEdition>");
  return ctx;
}

// Contenu d'une zone : la version publiée, ou le brouillon en mode édition
export function useZone<T>(cle: string, initial: T): [T, (valeur: T) => void, boolean] {
  const { enEdition, zones, declarerZone, retirerZone, modifierZone } = useEdition();

  useEffect(() => {
    declarerZone(cle, initial);
  }, [cle, initial, declarerZone]);
  useEffect(() => () => retirerZone(cle), [cle, retirerZone]);

  const zone = zones[cle];
  const valeur = (enEdition && zone ? zone.valeur : (zone?.initial ?? initial)) as T;
  const modifier = useCallback((v: T) => modifierZone(cle, v), [cle, modifierZone]);
  return [valeur, modifier, enEdition];
}

// Gère le mode édition de tout le site : qui est connecté / admin, les brouillons, l'enregistrement
export function FournisseurEdition({ children }: { children: React.ReactNode }) {
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);
  const [estAdmin, setEstAdmin] = useState(false);
  const [enEdition, setEnEdition] = useState(false);
  const [zones, setZones] = useState<Record<string, Zone>>({});
  const [enregistrement, setEnregistrement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Rôle de l'utilisateur connecté (revérifié à chaque page et à chaque connexion / déconnexion).
  // Ce n'est qu'un affichage : l'enregistrement est revérifié côté serveur et par la base.
  useEffect(() => {
    if (!supabaseConfigure()) return;
    const supabase = creerClientNavigateur();
    const verifier = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (!user) {
        setUtilisateur(null);
        return setEstAdmin(false);
      }
      const { data: profil } = await supabase.from("profils").select("role, prenom").eq("id", user.id).single();
      setUtilisateur({ id: user.id, email: user.email ?? "", prenom: profil?.prenom ?? null });
      setEstAdmin(profil?.role === "admin");
    };
    verifier();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      verifier();
    });
    return () => subscription.unsubscribe();
  }, [pathname]);

  // Changer de page quitte le mode édition
  useEffect(() => {
    setEnEdition(false);
    setErreur(null);
  }, [pathname]);

  const declarerZone = useCallback((cle: string, initial: unknown) => {
    setZones((z) => {
      // Brouillon en cours : on le garde. Sinon la zone suit la version publiée.
      const enCours = z[cle] && z[cle].valeur !== z[cle].initial;
      return { ...z, [cle]: { initial, valeur: enCours ? z[cle].valeur : initial } };
    });
  }, []);

  const retirerZone = useCallback((cle: string) => {
    setZones(({ [cle]: _retiree, ...reste }) => reste);
  }, []);

  const modifierZone = useCallback((cle: string, valeur: unknown) => {
    setZones((z) => ({ ...z, [cle]: { initial: z[cle]?.initial, valeur } }));
  }, []);

  const repartirDuPublie = () => setZones((z) => Object.fromEntries(Object.entries(z).map(([c, { initial }]) => [c, { initial, valeur: initial }])));

  const commencer = () => {
    repartirDuPublie();
    setErreur(null);
    setEnEdition(true);
  };

  const annuler = () => {
    repartirDuPublie();
    setErreur(null);
    setEnEdition(false);
  };

  const enregistrer = async () => {
    setEnregistrement(true);
    setErreur(null);
    const aEnregistrer = Object.entries(zones).filter(([, zone]) => zone.valeur !== zone.initial);
    for (const [cle, zone] of aEnregistrer) {
      const resultat = await enregistrerContenu(cle, zone.valeur);
      if (resultat.erreur) {
        setErreur(resultat.erreur);
        setEnregistrement(false);
        return;
      }
      // La version enregistrée devient la version publiée
      setZones((z) => ({ ...z, [cle]: { initial: zone.valeur, valeur: zone.valeur } }));
    }
    setEnregistrement(false);
    setEnEdition(false);
    router.refresh();
  };

  const modifie = Object.values(zones).some((zone) => zone.valeur !== zone.initial);

  const valeur = useMemo<ContexteEdition>(
    () => ({ utilisateur, estAdmin, enEdition, zones, modifie, enregistrement, erreur, commencer, annuler, enregistrer, declarerZone, retirerZone, modifierZone }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [utilisateur, estAdmin, enEdition, zones, modifie, enregistrement, erreur, declarerZone, retirerZone, modifierZone]
  );

  return <Contexte value={valeur}>{children}</Contexte>;
}
