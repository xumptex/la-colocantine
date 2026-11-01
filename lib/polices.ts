import {
  Caveat,
  Dancing_Script,
  Fraunces,
  Indie_Flower,
  Inter,
  Kalam,
  Lora,
  Nunito,
  Patrick_Hand,
  Playfair_Display,
  Quicksand,
  Shadows_Into_Light,
} from "next/font/google";

// Toutes les polices du catalogue (lib/polices-catalogue.ts), chacune dans sa variable CSS.
// Le navigateur ne télécharge que celles réellement utilisées.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
const quicksand = Quicksand({ subsets: ["latin"], variable: "--font-quicksand" });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });
const dancing = Dancing_Script({ subsets: ["latin"], variable: "--font-dancing" });
const patrick = Patrick_Hand({ subsets: ["latin"], weight: "400", variable: "--font-patrick" });
const indie = Indie_Flower({ subsets: ["latin"], weight: "400", variable: "--font-indie" });
const kalam = Kalam({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-kalam" });
const shadows = Shadows_Into_Light({ subsets: ["latin"], weight: "400", variable: "--font-shadows" });

export const classesPolices = [inter, nunito, quicksand, lora, playfair, fraunces, caveat, dancing, patrick, indie, kalam, shadows]
  .map((police) => police.variable)
  .join(" ");
