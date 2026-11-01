import PaperCard from "./PaperCard";

type TitrePageProps = {
  titre: string;
  sousTitre?: string;
  className?: string;
};

// Titre de page dans une carte blanche, ajustée à la largeur du texte
export default function TitrePage({ titre, sousTitre, className = "mb-10" }: TitrePageProps) {
  return (
    <PaperCard tilt="none" className={`w-fit max-w-full mx-auto ${className}`}>
      <header className="text-center px-8 py-5 md:px-10">
        <h1 className="font-titres text-4xl md:text-5xl font-extrabold tracking-tight">{titre}</h1>
        {sousTitre && <p className="mt-2 text-lg opacity-90">{sousTitre}</p>}
      </header>
    </PaperCard>
  );
}
