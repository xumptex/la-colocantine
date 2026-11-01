// Variables d'environnement Supabase (voir .env.example et docs/SUPABASE.md)
export function supabaseConfigure() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

export function supabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const cle = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !cle) {
    throw new Error(
      "Supabase n'est pas configuré : renseigne NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY dans .env.local (voir docs/SUPABASE.md)."
    );
  }
  return { url, cle };
}

// Adresse du site, utilisée pour les liens de retour (Google, email de confirmation)
export function urlDuSite() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
