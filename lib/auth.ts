import "server-only";
import { redirect } from "next/navigation";
import { creerClientServeur } from "./supabase/server";

export type Role = "membre" | "admin";

export type Profil = {
  id: string;
  email: string;
  prenom: string | null;
  nom: string | null;
  avatarUrl: string | null;
  role: Role;
};

// Profil de l'utilisateur connecté, ou null s'il n'est pas connecté.
// Lit la session : à appeler dans un composant derrière un <Suspense>.
export async function getProfil(): Promise<Profil | null> {
  const supabase = await creerClientServeur();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;

  const { data } = await supabase
    .from("profils")
    .select("id, email, prenom, nom, avatar_url, role")
    .eq("id", auth.user.id)
    .single();
  if (!data) return null;

  return {
    id: data.id,
    email: data.email,
    prenom: data.prenom,
    nom: data.nom,
    avatarUrl: data.avatar_url,
    role: data.role,
  };
}

// Profil de l'utilisateur connecté, sinon redirection vers la connexion
export async function exigerProfil(): Promise<Profil> {
  const profil = await getProfil();
  if (!profil) redirect("/login");
  return profil;
}

// Profil d'un admin, sinon redirection vers l'accueil
export async function exigerAdmin(): Promise<Profil> {
  const profil = await exigerProfil();
  if (profil.role !== "admin") redirect("/");
  return profil;
}
