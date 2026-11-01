// Contenu par défaut, affiché tant qu'un admin n'a rien enregistré
// (ou si Supabase n'est pas joignable). C'est le contenu d'origine du site.
import { evenementsPasses, formatDate } from "@/lib/data";
import type { Bloc, ContenuFooter, ContenuPage, Reglages, SlugPage } from "./types";

const accueil: Bloc[] = [
  {
    id: "bienvenue",
    type: "texte",
    titre: "Bienvenue à La Colocantine",
    texte:
      "Notre resto éphémère de temps en temps dans notre coloc. Cuisine réconfortante, bons produits et grandes tablées entre copains.",
    style: "normal",
    inclinaison: "aucune",
    largeur: "large",
    photo: { legende: "La coloc au complet !" },
    liens: [
      { texte: "Voir le prochain repas", url: "#prochain-repas" },
      { texte: "Nos anciens repas", url: "/events" },
    ],
  },
  {
    id: "prochain-repas",
    type: "annonce",
    surtitre: "Prochain repas",
    repas: {
      id: "porc-effiloche-2026-11-14",
      titre: "Soirée Porc Effiloché",
      date: "2026-11-14",
      heure: "19h30",
      prix: 12,
      placesTotal: 14,
      placesPrises: 9,
      menu: [
        { categorie: "Entrée", nom: "Coleslaw maison", description: "Chou croquant, carottes, sauce yaourt et moutarde à l'ancienne." },
        {
          categorie: "Plat",
          nom: "Porc effiloché fumé",
          description: "Épaule confite 12h, sauce barbecue maison, pain brioché et pickles d'oignons rouges.",
        },
        { categorie: "Dessert", nom: "Cookie géant au caramel", description: "Servi tiède avec une boule de glace vanille." },
      ],
      macros: { kcal: 1150, proteines: 52, glucides: 118, lipides: 49 },
      allergenes: ["Gluten", "Lait", "Œuf", "Moutarde"],
    },
  },
];

const events: Bloc[] = [
  { id: "titre", type: "titre", titre: "Nos événements", sousTitre: "Les repas passés, les souvenirs qui restent." },
  {
    id: "galerie",
    type: "polaroids",
    photos: [...evenementsPasses].reverse().map((e) => ({
      legende: e.titre,
      details: `${formatDate(e.date)} · ${e.convives} convives`,
    })),
  },
];

const aide: Bloc[] = [
  { id: "titre", type: "titre", titre: "Aide", sousTitre: "Les questions qu'on nous pose souvent." },
  {
    id: "faq",
    type: "faq",
    inclinaison: "gauche",
    questions: [
      {
        question: "Comment ça marche ?",
        reponse:
          "On organise un repas de temps en temps dans notre coloc. Le menu est annoncé sur l'accueil, tu t'inscris, et tu n'as plus qu'à venir le jour J.",
      },
      {
        question: "Combien ça coûte ?",
        reponse: "Le prix est indiqué sur chaque repas. Il couvre juste les courses : on ne cherche pas à faire de bénéfice.",
      },
      {
        question: "J'ai une allergie ou un régime particulier",
        reponse:
          "Indique-le dans le champ « Allergies ou remarques » lors de ton inscription, on fera de notre mieux pour adapter ton assiette.",
      },
      {
        question: "Je peux venir accompagné ?",
        reponse: "Oui ! Tu peux réserver jusqu'à 4 places en une seule inscription, dans la limite des places restantes.",
      },
      {
        question: "Je ne peux plus venir, je fais comment ?",
        reponse: "Préviens-nous dès que possible pour qu'on puisse libérer ta place pour quelqu'un d'autre.",
      },
    ],
  },
];

const livreDor: Bloc[] = [
  { id: "titre", type: "titre", titre: "Livre d'or", sousTitre: "Les petits mots laissés par nos convives." },
  { id: "livre", type: "livre-dor" },
];

export const pagesParDefaut: Record<SlugPage, ContenuPage> = {
  accueil: { blocs: accueil },
  events: { blocs: events },
  aide: { blocs: aide },
  "livre-d-or": { blocs: livreDor },
};

export const footerParDefaut: ContenuFooter = {
  titreEquipe: "Qui sommes-nous ?",
  equipe: [
    { legende: "Jérémy", role: "Chômeur" },
    { legende: "Gabriel", role: "Prouveur" },
    { legende: "Yahya", role: "Artisan kebabier" },
    { legende: "Erwan", role: "Respo Vaiselle" },
  ],
  titreContact: "Nous trouver",
  email: "contact@lacolocantine.fr",
  instagram: "lacolocantine",
  adresse: "ALJT 504, 4 rue de la Courcive, 91120 Palaiseau",
  ville: "Palaiseau",
  mention: "Nous ne sommes pas responsable en cas d'intoxication alimentaire.",
};

export const reglagesParDefaut: Reglages = {
  policeTitres: "inter",
  policeTexte: "inter",
  policeManuscrite: "caveat",
};
