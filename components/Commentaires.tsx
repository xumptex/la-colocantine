"use client";

import { createContext, use } from "react";
import type { Commentaire } from "@/lib/livre-dor";

// Commentaires du livre d'or, lus côté serveur (layout) et transmis au bloc "Livre d'or"
const Contexte = createContext<Commentaire[]>([]);

export function FournisseurCommentaires({ commentaires, children }: { commentaires: Commentaire[]; children: React.ReactNode }) {
  return <Contexte value={commentaires}>{children}</Contexte>;
}

export const useCommentaires = () => use(Contexte);
