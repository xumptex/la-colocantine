import "server-only";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { supabaseEnv } from "./env";

// Client Supabase côté serveur (composants serveur, server actions, route handlers).
// Un nouveau client par requête : la session est lue dans les cookies.
// Avec cacheComponents, un composant qui l'utilise doit être derrière un <Suspense>.
export async function creerClientServeur() {
  // Jamais pendant le pré-rendu : Supabase lit l'heure (Date.now) pour vérifier
  // l'expiration de la session, ce que Next interdit hors d'une vraie requête
  await connection();
  const cookieStore = await cookies();
  const { url, cle } = supabaseEnv();

  return createServerClient(url, cle, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesAEcrire) {
        try {
          cookiesAEcrire.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Appelé depuis un composant serveur (cookies en lecture seule) :
          // sans effet, le proxy se charge de rafraîchir la session.
        }
      },
    },
  });
}
