// Repas passés, utilisés pour la galerie par défaut de la page "Nos événements"
// (lib/contenu/defaut.ts). Le contenu des pages est dans lib/contenu.

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

// "2026-11-14" -> "samedi 14 novembre 2026"
export function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
