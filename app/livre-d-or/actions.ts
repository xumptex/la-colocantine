"use server";

import { updateTag } from "next/cache";
import { getProfil } from "@/lib/auth";
import { creerClientServeur } from "@/lib/supabase/server";
import { supabaseEnv } from "@/lib/supabase/env";
import { PHOTOS_MAX } from "@/lib/livre-dor";

export type EntreeCommentaire = {
  repasId: string;
  message: string;
  note: number;
  photos: string[];
};

const dossierPhotos = () => `${supabaseEnv().url}/storage/v1/object/public/commentaires/`;

// Laisser un mot : réservé aux convives d'un repas passé (vérifié aussi par la base)
export async function publierCommentaire(entree: EntreeCommentaire): Promise<{ erreur?: string }> {
  const supabase = await creerClientServeur();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { erreur: "Connecte-toi pour laisser un mot." };

  const message = entree.message.trim();
  if (!message) return { erreur: "Écris un petit mot." };
  if (message.length > 2000) return { erreur: "Ton mot est trop long (2000 caractères max)." };
  const note = Math.round(Number(entree.note));
  if (!(note >= 1 && note <= 5)) return { erreur: "Choisis une note entre 1 et 5 étoiles." };

  // Seulement des photos envoyées par l'utilisateur lui-même
  const photos = entree.photos.filter((url) => url.startsWith(`${dossierPhotos()}${auth.user.id}/`)).slice(0, PHOTOS_MAX);

  const { data: commentables } = await supabase.rpc("repas_commentables");
  const repas = (commentables as { repas_id: string; repas_titre: string; prenom: string }[] | null)?.find(
    (r) => r.repas_id === entree.repasId
  );
  if (!repas) return { erreur: "Tu ne peux pas (ou plus) laisser de mot pour ce repas." };

  const { error } = await supabase.from("commentaires").insert({
    repas_id: repas.repas_id,
    repas_titre: repas.repas_titre,
    auteur_id: auth.user.id,
    prenom: repas.prenom,
    message,
    note,
    photos,
  });
  if (error?.code === "23505") return { erreur: "Tu as déjà laissé un mot pour ce repas." };
  if (error) return { erreur: "Impossible de publier, réessaie." };

  updateTag("commentaires");
  return {};
}

// Supprimer un commentaire (admins) et ses photos
export async function supprimerCommentaire(id: string): Promise<{ erreur?: string }> {
  const profil = await getProfil();
  if (profil?.role !== "admin") return { erreur: "Réservé aux admins." };

  const supabase = await creerClientServeur();
  const { data: commentaire } = await supabase.from("commentaires").select("photos").eq("id", id).maybeSingle();
  const { error } = await supabase.from("commentaires").delete().eq("id", id);
  if (error) return { erreur: "Suppression impossible, réessaie." };

  const chemins = ((commentaire?.photos as string[] | undefined) ?? [])
    .filter((url) => url.startsWith(dossierPhotos()))
    .map((url) => url.slice(dossierPhotos().length));
  if (chemins.length) await supabase.storage.from("commentaires").remove(chemins);

  updateTag("commentaires");
  return {};
}
