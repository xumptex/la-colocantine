// Commentaires du livre d'or (table Supabase "commentaires")

export type Commentaire = {
  id: string;
  repasId: string;
  repasTitre: string;
  prenom: string;
  message: string;
  note: number; // 1 à 5 étoiles
  photos: string[]; // URLs publiques (Supabase Storage)
  creeLe: string;
};

export type LigneCommentaire = {
  id: string;
  repas_id: string;
  repas_titre: string;
  prenom: string;
  message: string;
  note: number;
  photos: string[];
  cree_le: string;
};

export const versCommentaire = (l: LigneCommentaire): Commentaire => ({
  id: l.id,
  repasId: l.repas_id,
  repasTitre: l.repas_titre,
  prenom: l.prenom,
  message: l.message,
  note: l.note,
  photos: l.photos,
  creeLe: l.cree_le,
});

export const PHOTOS_MAX = 3;
