"use server";

import { redirect } from "next/navigation";
import type { AuthError } from "@supabase/supabase-js";
import { creerClientServeur } from "@/lib/supabase/server";
import { urlDuSite } from "@/lib/supabase/env";

export type EtatFormulaire = { erreur?: string; message?: string } | undefined;

// Messages d'erreur Supabase en français
function traduire(erreur: AuthError) {
  switch (erreur.code) {
    case "invalid_credentials":
      return "Email ou mot de passe incorrect.";
    case "email_not_confirmed":
      return "Confirme d'abord ton email grâce au lien qu'on t'a envoyé.";
    case "user_already_exists":
    case "email_exists":
      return "Un compte existe déjà avec cet email.";
    case "weak_password":
      return "Mot de passe trop faible : au moins 6 caractères.";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "Trop de tentatives, réessaie dans quelques minutes.";
    default:
      return "Une erreur est survenue, réessaie.";
  }
}

export async function seConnecter(_etat: EtatFormulaire, formData: FormData): Promise<EtatFormulaire> {
  const supabase = await creerClientServeur();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email")),
    password: String(formData.get("motDePasse")),
  });
  if (error) return { erreur: traduire(error) };
  redirect("/compte");
}

export async function creerCompte(_etat: EtatFormulaire, formData: FormData): Promise<EtatFormulaire> {
  const motDePasse = String(formData.get("motDePasse"));
  if (motDePasse !== String(formData.get("confirmation"))) {
    return { erreur: "Les deux mots de passe ne correspondent pas." };
  }

  const supabase = await creerClientServeur();
  const { data, error } = await supabase.auth.signUp({
    email: String(formData.get("email")),
    password: motDePasse,
    options: {
      // Page où arrive le lien de confirmation (voir app/auth/confirm)
      emailRedirectTo: `${urlDuSite()}/compte`,
      data: { prenom: String(formData.get("prenom")).trim() },
    },
  });
  if (error) return { erreur: traduire(error) };

  // Confirmation par email activée : le compte s'active via le lien reçu.
  // (Si elle était désactivée dans Supabase, on serait déjà connecté.)
  if (data.session) redirect("/compte");
  return { message: "Presque fini ! Clique sur le lien reçu par email pour activer ton compte." };
}
