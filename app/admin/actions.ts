"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { getProfil } from "@/lib/auth";
import { creerClientServeur } from "@/lib/supabase/server";
import { supabaseEnv, urlDuSite } from "@/lib/supabase/env";

// Envoie un lien magique (connexion sans mot de passe) aux inscrits d'un repas qui
// n'ont pas de compte, pour qu'ils puissent laisser un mot dans le livre d'or.
// Le compte est créé automatiquement au premier clic sur le lien.
export async function envoyerLiens(repasId: string): Promise<{ erreur?: string; envoyes?: number; echecs?: number }> {
  const profil = await getProfil();
  if (profil?.role !== "admin") return { erreur: "Réservé aux admins." };

  const supabase = await creerClientServeur();
  const { data: inscrits, error } = await supabase
    .from("inscriptions")
    .select("id, prenom, email")
    .eq("repas_id", repasId)
    .is("utilisateur_id", null);
  if (error) return { erreur: "Impossible de lire les inscriptions." };
  if (!inscrits?.length) return { envoyes: 0, echecs: 0 };

  // Client sans session : l'envoi ne doit pas toucher à la session de l'admin
  const { url, cle } = supabaseEnv();
  const envoi = createClient(url, cle, { auth: { persistSession: false, flowType: "implicit" } });

  let envoyes = 0;
  let echecs = 0;
  for (const inscrit of inscrits) {
    const { error: erreurEnvoi } = await envoi.auth.signInWithOtp({
      email: inscrit.email,
      options: { shouldCreateUser: true, emailRedirectTo: `${urlDuSite()}/livre-d-or`, data: { prenom: inscrit.prenom } },
    });
    if (erreurEnvoi) {
      echecs++;
      continue;
    }
    envoyes++;
    await supabase.from("inscriptions").update({ lien_envoye_le: new Date().toISOString() }).eq("id", inscrit.id);
  }

  revalidatePath("/admin");
  return { envoyes, echecs };
}

export async function supprimerInscription(id: string): Promise<{ erreur?: string }> {
  const profil = await getProfil();
  if (profil?.role !== "admin") return { erreur: "Réservé aux admins." };

  const supabase = await creerClientServeur();
  const { error } = await supabase.from("inscriptions").delete().eq("id", id);
  if (error) return { erreur: "Suppression impossible." };

  revalidatePath("/admin");
  return {};
}
