"use server";

import { getProfil } from "@/lib/auth";
import { creerClientServeur } from "@/lib/supabase/server";
import { trouverAnnonce } from "@/lib/contenu/lecture";

export type EntreeInscription = {
  repasId: string;
  prenom: string;
  email: string;
  convives: number;
  remarques: string;
};

const EMAIL_VALIDE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Inscription à un repas : avec son compte si on est connecté, sinon avec prénom + email
export async function inscrire(entree: EntreeInscription): Promise<{ erreur?: string; prenom?: string }> {
  // Infos du repas lues côté serveur (on ne fait pas confiance au navigateur)
  const annonce = await trouverAnnonce(entree.repasId);
  if (!annonce) return { erreur: "Ce repas n'existe plus." };
  const { repas } = annonce;
  const aujourdhui = new Date().toISOString().slice(0, 10);
  if (repas.date && repas.date < aujourdhui) return { erreur: "Les inscriptions à ce repas sont fermées." };

  const convives = Math.round(Number(entree.convives));
  if (!(convives >= 1 && convives <= 4)) return { erreur: "Entre 1 et 4 convives par inscription." };

  const supabase = await creerClientServeur();
  const profil = await getProfil();
  const prenom = (profil?.prenom || entree.prenom).trim();
  const email = (profil?.email || entree.email).trim().toLowerCase();
  if (!prenom) return { erreur: "Indique ton prénom." };
  if (!EMAIL_VALIDE.test(email)) return { erreur: "Cet email n'a pas l'air valide." };

  const { data: prises } = await supabase.rpc("places_prises", { p_repas_id: entree.repasId });
  const restantes = repas.placesTotal - repas.placesPrises - (prises ?? 0);
  if (restantes <= 0) return { erreur: "C'est complet, désolé !" };
  if (convives > restantes) return { erreur: `Il ne reste que ${restantes} place${restantes > 1 ? "s" : ""}.` };

  const { error } = await supabase.from("inscriptions").insert({
    repas_id: entree.repasId,
    repas_titre: repas.titre,
    repas_date: repas.date || null,
    utilisateur_id: profil?.id ?? null,
    prenom: prenom.slice(0, 60),
    email,
    convives,
    remarques: entree.remarques.trim().slice(0, 500) || null,
  });
  if (error?.code === "23505") return { erreur: "Tu es déjà inscrit à ce repas avec cet email." };
  if (error) return { erreur: "L'inscription a échoué, réessaie." };

  return { prenom };
}
