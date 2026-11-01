import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { supabaseConfigure, supabaseEnv } from "./env";

// Pages réservées aux membres connectés
const PAGES_PRIVEES = ["/compte", "/admin"];

// Rafraîchit la session Supabase à chaque requête (cookies à jour) et fait les
// redirections "optimistes" : la vraie vérification des droits se fait dans les pages.
export async function mettreAJourSession(request: NextRequest) {
  let reponse = NextResponse.next({ request });
  // Supabase pas encore configuré : le site reste utilisable sans les comptes
  if (!supabaseConfigure()) return reponse;
  const { url, cle } = supabaseEnv();

  const supabase = createServerClient(url, cle, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesAEcrire, entetes) {
        cookiesAEcrire.forEach(({ name, value }) => request.cookies.set(name, value));
        reponse = NextResponse.next({ request });
        cookiesAEcrire.forEach(({ name, value, options }) => reponse.cookies.set(name, value, options));
        // Une réponse qui pose des cookies de session ne doit pas être mise en cache
        Object.entries(entetes).forEach(([cle, valeur]) => reponse.headers.set(cle, valeur));
      },
    },
  });

  // Ne rien mettre entre la création du client et getClaims() : c'est lui qui rafraîchit la session
  const { data } = await supabase.auth.getClaims();
  const connecte = Boolean(data?.claims);
  const chemin = request.nextUrl.pathname;

  const rediriger = (vers: string) => {
    const cible = request.nextUrl.clone();
    cible.pathname = vers;
    cible.search = "";
    const redirection = NextResponse.redirect(cible);
    reponse.cookies.getAll().forEach((cookie) => redirection.cookies.set(cookie));
    return redirection;
  };

  if (!connecte && PAGES_PRIVEES.some((page) => chemin.startsWith(page))) return rediriger("/login");
  if (connecte && chemin === "/login") return rediriger("/compte");

  return reponse;
}
