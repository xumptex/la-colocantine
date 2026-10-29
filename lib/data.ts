// Données factices pour le front. À remplacer par la base de données
// (Supabase) quand on branchera les comptes et les inscriptions.

export type Macros = {
  kcal: number;
  proteines: number; // en grammes
  glucides: number;
  lipides: number;
};

export type Plat = {
  type: "Entrée" | "Plat" | "Dessert";
  nom: string;
  description: string;
};

export type Repas = {
  titre: string;
  date: string; // format ISO
  heure: string;
  prix: number; // en euros, par personne
  placesTotal: number;
  placesPrises: number;
  photo?: string;
  menu: Plat[];
  macros: Macros; // par portion, menu complet
  allergenes: string[];
};

export const prochainRepas: Repas = {
  titre: "Soirée Porc Effiloché",
  date: "2026-11-14",
  heure: "19h30",
  prix: 12,
  placesTotal: 14,
  placesPrises: 9,
  menu: [
    {
      type: "Entrée",
      nom: "Coleslaw maison",
      description: "Chou croquant, carottes, sauce yaourt et moutarde à l'ancienne.",
    },
    {
      type: "Plat",
      nom: "Porc effiloché fumé",
      description: "Épaule confite 12h, sauce barbecue maison, pain brioché et pickles d'oignons rouges.",
    },
    {
      type: "Dessert",
      nom: "Cookie géant au caramel",
      description: "Servi tiède avec une boule de glace vanille.",
    },
  ],
  macros: { kcal: 1150, proteines: 52, glucides: 118, lipides: 49 },
  allergenes: ["Gluten", "Lait", "Œuf", "Moutarde"],
};

export type Evenement = {
  id: string;
  titre: string;
  date: string;
  convives: number;
  photo?: string;
};

export const evenementsPasses: Evenement[] = [
  { id: "raclette", titre: "Raclette party", date: "2026-02-07", convives: 12 },
  { id: "tacos", titre: "Soirée tacos", date: "2026-03-21", convives: 10 },
  { id: "curry", titre: "Curry du dimanche", date: "2026-04-26", convives: 8 },
  { id: "bbq", titre: "Premier barbecue", date: "2026-06-13", convives: 15 },
  { id: "pizza", titre: "Pizzas maison", date: "2026-08-29", convives: 11 },
  { id: "lasagnes", titre: "Lasagnes de la rentrée", date: "2026-09-26", convives: 13 },
];

export type MessageLivreDor = {
  id: number;
  auteur: string;
  evenementId: string;
  message: string;
  date: string;
};

export const messagesLivreDor: MessageLivreDor[] = [
  { id: 1, auteur: "Camille", evenementId: "raclette", date: "2026-02-08", message: "Meilleure raclette de l'hiver, et de loin. Je reviens avec mon propre caquelon la prochaine fois !" },
  { id: 2, auteur: "Hugo", evenementId: "tacos", date: "2026-03-22", message: "La salsa verde... je pense encore à la salsa verde." },
  { id: 3, auteur: "Léa", evenementId: "curry", date: "2026-04-27", message: "Ambiance trop chouette, on se sent comme à la maison. Merci la coloc !" },
  { id: 4, auteur: "Mehdi", evenementId: "bbq", date: "2026-06-14", message: "Les brochettes étaient parfaites. Mention spéciale pour la playlist." },
  { id: 5, auteur: "Sarah", evenementId: "pizza", date: "2026-08-30", message: "Pâte à pizza incroyable. Vous ouvrez quand un vrai resto ?" },
  { id: 6, auteur: "Tom", evenementId: "lasagnes", date: "2026-09-27", message: "J'ai pris trois parts. Je ne regrette rien." },
  { id: 7, auteur: "Inès", evenementId: "bbq", date: "2026-06-15", message: "Première fois chez vous et sûrement pas la dernière." },
  { id: 8, auteur: "Julien", evenementId: "raclette", date: "2026-02-09", message: "Trop de fromage. Juste assez de fromage. Merci !" },
  { id: 9, auteur: "Chloé", evenementId: "tacos", date: "2026-03-23", message: "On a dansé dans la cuisine jusqu'à 2h. Dix sur dix." },
  { id: 10, auteur: "Nathan", evenementId: "curry", date: "2026-04-28", message: "Le naan au fromage mériterait sa propre soirée." },
  { id: 11, auteur: "Manon", evenementId: "pizza", date: "2026-08-31", message: "Merci pour l'accueil, j'ai déjà réservé ma place pour la prochaine !" },
  { id: 12, auteur: "Yanis", evenementId: "lasagnes", date: "2026-09-28", message: "Comme chez mamie, mais en mieux (ne lui dites pas)." },
];

// "2026-11-14" -> "samedi 14 novembre 2026"
export function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
