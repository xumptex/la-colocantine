import { NextResponse, type NextRequest } from "next/server";
import { creerClientServeur } from "@/lib/supabase/server";

// Retour après la connexion Google ou le lien de confirmation par email :
// Supabase renvoie un "code" qu'on échange contre une session (cookies).
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/compte";
  // Seulement une page du site (évite une redirection vers un autre domaine)
  const suite = next.startsWith("/") && !next.startsWith("//") ? next : "/compte";

  if (code) {
    const supabase = await creerClientServeur();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(suite, origin));
  }

  return NextResponse.redirect(new URL("/login?erreur=lien", origin));
}
