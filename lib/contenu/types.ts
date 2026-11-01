// Contenu modifiable du site : chaque page est une liste de blocs.
// Stocké en JSON dans la table Supabase "contenus" (voir supabase/migrations).

export type Inclinaison = "aucune" | "gauche" | "droite";

export type Photo = {
  url?: string; // vide : emplacement "Photo à venir"
  legende: string;
};

export type Lien = { texte: string; url: string };

export type Plat = {
  categorie: string; // Entrée, Plat, Dessert...
  nom: string;
  description: string;
};

export type Macros = {
  kcal: number;
  proteines: number; // en grammes
  glucides: number;
  lipides: number;
};

export type Repas = {
  id?: string; // identifiant du repas (inscriptions, commentaires). Absent : id du bloc
  titre: string;
  date: string; // format ISO (AAAA-MM-JJ)
  heure: string;
  prix: number; // en euros, par personne
  placesTotal: number;
  placesPrises: number;
  menu: Plat[];
  macros: Macros; // par portion, menu complet
  allergenes: string[];
};

export type BlocTitre = { id: string; type: "titre"; titre: string; sousTitre: string };

export type BlocTexte = {
  id: string;
  type: "texte";
  titre: string;
  texte: string;
  style: "normal" | "manuscrit";
  inclinaison: Inclinaison;
  largeur: "etroite" | "moyenne" | "large";
  photo: Photo | null; // Polaroïd à côté du texte
  liens: Lien[];
};

export type PhotoGalerie = Photo & { details: string };

export type BlocPolaroids = { id: string; type: "polaroids"; photos: PhotoGalerie[] };

export type BlocAnnonce = { id: string; type: "annonce"; surtitre: string; repas: Repas };

// Identifiant du repas d'une annonce
export const idRepas = (bloc: BlocAnnonce) => bloc.repas.id ?? bloc.id;

export type QuestionReponse = { question: string; reponse: string };

export type BlocFaq = { id: string; type: "faq"; inclinaison: Inclinaison; questions: QuestionReponse[] };

export type BlocLivreDor = { id: string; type: "livre-dor" };

export type Bloc = BlocTitre | BlocTexte | BlocPolaroids | BlocAnnonce | BlocFaq | BlocLivreDor;

export type TypeBloc = Bloc["type"];

export type ContenuPage = { blocs: Bloc[] };

export type MembreEquipe = Photo & { role: string }; // légende = prénom

export type ContenuFooter = {
  titreEquipe: string;
  equipe: MembreEquipe[];
  titreContact: string;
  email: string;
  instagram: string; // sans le @
  adresse: string;
  ville: string;
  mention: string;
};

export type Reglages = {
  policeTitres: string;
  policeTexte: string;
  policeManuscrite: string;
};

// Pages modifiables (clé "page:<slug>" dans la table contenus)
export const PAGES = ["accueil", "events", "aide", "livre-d-or"] as const;
export type SlugPage = (typeof PAGES)[number];
