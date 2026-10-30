import PaperCard from "./PaperCard";

type TitrePageProps = {
  titre: string;
  sousTitre?: string;
};

// Titre de page dans une carte blanche, ajustée à la largeur du texte
export default function TitrePage({ titre, sousTitre }: TitrePageProps) {
  return (
    <PaperCard tilt="none" className="w-fit max-w-full mx-auto mb-10">
      <header className="text-center px-8 py-5 md:px-10">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{titre}</h1>
        {sousTitre && <p className="mt-2 text-lg opacity-90">{sousTitre}</p>}
      </header>
    </PaperCard>
  );
}
