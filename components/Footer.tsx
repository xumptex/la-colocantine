import FooterContenu from "./FooterContenu";
import { lireFooter } from "@/lib/contenu/lecture";

export default async function Footer() {
  const contenu = await lireFooter();

  return (
    <footer className="relative mt-20 bg-white">
      {/* Effet papier au-dessus du pied de page (rappel de la barre de navigation) */}
      <div className="lg:hidden absolute -top-2 left-0 w-full h-8 bg-marron -skew-y-1 origin-top-left -z-15"></div>
      <div className="hidden lg:block absolute -top-4 left-0 w-full h-12 bg-marron -skew-y-[0.5deg] origin-top-left -z-15"></div>

      <FooterContenu initial={contenu} />
    </footer>
  );
}
