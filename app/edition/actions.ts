"use server";

import { updateTag } from "next/cache";
import { getProfil } from "@/lib/auth";
import { creerClientServeur } from "@/lib/supabase/server";
import { PAGES } from "@/lib/contenu/types";

// Zones qu'on peut enregistrer depuis le mode édition
const CLES_AUTORISEES = new Set<string>([...PAGES.map((slug) => `page:${slug}`), "footer", "reglages"]);

export async function enregistrerContenu(cle: string, donnees: unknown): Promise<{ erreur?: string }> {
  if (!CLES_AUTORISEES.has(cle)) return { erreur: "Zone inconnue." };

  // Vérifié ici et par la base (RLS) : seuls les admins peuvent écrire
  const profil = await getProfil();
  if (profil?.role !== "admin") return { erreur: "Réservé aux admins." };

  const supabase = await creerClientServeur();
  const { error } = await supabase.from("contenus").upsert({
    cle,
    donnees,
    modifie_le: new Date().toISOString(),
    modifie_par: profil.id,
  });
  if (error) return { erreur: "L'enregistrement a échoué, réessaie." };

  // Les visiteurs voient la nouvelle version dès la prochaine visite
  updateTag(`contenu:${cle}`);
  return {};
}
