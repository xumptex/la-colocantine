"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { creerClientServeur } from "@/lib/supabase/server";
import type { EtatFormulaire } from "@/app/login/actions";

export async function mettreAJourProfil(_etat: EtatFormulaire, formData: FormData): Promise<EtatFormulaire> {
  const supabase = await creerClientServeur();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  const { error } = await supabase
    .from("profils")
    .update({
      prenom: String(formData.get("prenom")).trim() || null,
      nom: String(formData.get("nom")).trim() || null,
    })
    .eq("id", auth.user.id);
  if (error) return { erreur: "Impossible d'enregistrer, réessaie." };

  revalidatePath("/compte");
  return { message: "C'est enregistré !" };
}

export async function seDeconnecter() {
  const supabase = await creerClientServeur();
  await supabase.auth.signOut();
  redirect("/");
}
