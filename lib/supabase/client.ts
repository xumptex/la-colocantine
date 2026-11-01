import { createBrowserClient } from "@supabase/ssr";
import { supabaseEnv } from "./env";

// Client Supabase pour les composants client (navigateur)
export function creerClientNavigateur() {
  const { url, cle } = supabaseEnv();
  return createBrowserClient(url, cle);
}
