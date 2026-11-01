import "server-only";
import { cacheTag } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { supabaseConfigure, supabaseEnv } from "@/lib/supabase/env";
import { footerParDefaut, pagesParDefaut, reglagesParDefaut } from "./defaut";
import { PAGES, idRepas, type BlocAnnonce, type ContenuFooter, type ContenuPage, type Reglages, type SlugPage } from "./types";
import { versCommentaire, type Commentaire, type LigneCommentaire } from "@/lib/livre-dor";

// Client Supabase pour les lectures publiques (pas besoin de la session de l'utilisateur)
function clientPublic() {
  const { url, cle } = supabaseEnv();
  return createClient(url, cle, { auth: { persistSession: false } });
}

// Lit une zone de contenu dans Supabase. Mis en cache (pages rapides pour les visiteurs) :
// le cache est vidé à chaque enregistrement depuis le mode édition (updateTag).
async function lireContenu(cle: string): Promise<unknown | null> {
  "use cache";
  cacheTag(`contenu:${cle}`);

  if (!supabaseConfigure()) return null;
  const { data, error } = await clientPublic().from("contenus").select("donnees").eq("cle", cle).maybeSingle();
  if (error) return null; // table pas encore créée, réseau... : contenu par défaut
  return data?.donnees ?? null;
}

export async function lirePage(slug: SlugPage): Promise<ContenuPage> {
  return ((await lireContenu(`page:${slug}`)) as ContenuPage | null) ?? pagesParDefaut[slug];
}

export async function lireFooter(): Promise<ContenuFooter> {
  return ((await lireContenu("footer")) as ContenuFooter | null) ?? footerParDefaut;
}

export async function lireReglages(): Promise<Reglages> {
  const reglages = (await lireContenu("reglages")) as Partial<Reglages> | null;
  return { ...reglagesParDefaut, ...reglages };
}

// Annonce d'un repas, cherchée dans toutes les pages (inscriptions)
export async function trouverAnnonce(repasId: string): Promise<BlocAnnonce | null> {
  for (const slug of PAGES) {
    const { blocs } = await lirePage(slug);
    const annonce = blocs.find((b): b is BlocAnnonce => b.type === "annonce" && idRepas(b) === repasId);
    if (annonce) return annonce;
  }
  return null;
}

// Commentaires du livre d'or, du plus récent au plus ancien.
// Cache vidé à chaque nouveau commentaire ou suppression (updateTag("commentaires")).
export async function lireCommentaires(): Promise<Commentaire[]> {
  "use cache";
  cacheTag("commentaires");

  if (!supabaseConfigure()) return [];
  const { data, error } = await clientPublic()
    .from("commentaires")
    .select("id, repas_id, repas_titre, prenom, message, note, photos, cree_le")
    .order("cree_le", { ascending: false });
  if (error || !data) return [];
  return (data as LigneCommentaire[]).map(versCommentaire);
}
