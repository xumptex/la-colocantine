// Polices proposées dans le mode édition. Chaque police est chargée par next/font
// (lib/polices.ts) et exposée dans une variable CSS du même nom.

export type Police = {
  id: string;
  nom: string;
  variable: string; // variable CSS définie par next/font
  categorie: "texte" | "manuscrite";
};

export const POLICES: Police[] = [
  { id: "inter", nom: "Inter", variable: "--font-inter", categorie: "texte" },
  { id: "nunito", nom: "Nunito", variable: "--font-nunito", categorie: "texte" },
  { id: "quicksand", nom: "Quicksand", variable: "--font-quicksand", categorie: "texte" },
  { id: "lora", nom: "Lora", variable: "--font-lora", categorie: "texte" },
  { id: "playfair", nom: "Playfair Display", variable: "--font-playfair", categorie: "texte" },
  { id: "fraunces", nom: "Fraunces", variable: "--font-fraunces", categorie: "texte" },
  { id: "caveat", nom: "Caveat", variable: "--font-caveat", categorie: "manuscrite" },
  { id: "dancing", nom: "Dancing Script", variable: "--font-dancing", categorie: "manuscrite" },
  { id: "patrick", nom: "Patrick Hand", variable: "--font-patrick", categorie: "manuscrite" },
  { id: "indie", nom: "Indie Flower", variable: "--font-indie", categorie: "manuscrite" },
  { id: "kalam", nom: "Kalam", variable: "--font-kalam", categorie: "manuscrite" },
  { id: "shadows", nom: "Shadows Into Light", variable: "--font-shadows", categorie: "manuscrite" },
];

// "lora" -> "var(--font-lora)" (police par défaut si l'id est inconnu)
export function varPolice(id: string, parDefaut: string) {
  const police = POLICES.find((p) => p.id === id) ?? POLICES.find((p) => p.id === parDefaut)!;
  return `var(${police.variable})`;
}

// Variables CSS qui relient les classes du site (font-sans, font-titres, font-handwriting) aux polices choisies
export function variablesPolices(reglages: { policeTitres: string; policeTexte: string; policeManuscrite: string }) {
  return {
    "--police-titres": varPolice(reglages.policeTitres, "inter"),
    "--police-texte": varPolice(reglages.policeTexte, "inter"),
    "--police-manuscrite": varPolice(reglages.policeManuscrite, "caveat"),
  };
}
