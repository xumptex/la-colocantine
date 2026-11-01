import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { creerClientServeur } from "@/lib/supabase/server";

// "next" : un chemin du site ("/compte") ou une adresse complète du site
// ({{ .RedirectTo }} dans le modèle d'email). Tout le reste renvoie au livre d'or.
function pageDeRetour(next: string | null, origin: string) {
  if (!next) return "/livre-d-or";
  if (next.startsWith("/") && !next.startsWith("//")) return next;
  try {
    const url = new URL(next);
    if (url.origin === origin) return url.pathname + url.search;
  } catch {}
  return "/livre-d-or";
}

// Clic sur un lien reçu par email (confirmation d'inscription ou lien magique).
// Les modèles d'email Supabase pointent ici avec un "token_hash" (voir docs/SUPABASE.md) :
// ça marche même si le lien est ouvert sur un autre appareil que celui qui l'a demandé.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const suite = pageDeRetour(searchParams.get("next"), origin);

  if (tokenHash && type) {
    const supabase = await creerClientServeur();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) return NextResponse.redirect(new URL(suite, origin));
  }

  return NextResponse.redirect(new URL("/login?erreur=lien", origin));
}
