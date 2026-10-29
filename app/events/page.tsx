import type { Metadata } from "next";
import Polaroid from "@/components/Polaroid";
import { evenementsPasses, formatDate } from "@/lib/data";
import PaperCard, { type Tilt } from "@/components/PaperCard";

export const metadata: Metadata = {
  title: "Nos événements - La Colocantine",
};

// Rotations alternées pour l'effet "photos jetées sur la table"
const tilts: Tilt[] = ["left-strong", "right", "right-strong", "left", "right-strong", "left-strong"];

export default function EventsPage() {
  // Du plus récent au plus ancien
  const evenements = [...evenementsPasses].reverse();

  return (
    <div className="w-full max-w-5xl mx-auto py-4">
      <PaperCard tilt="none" className="max-w-2xl mx-auto mb-12">
        <header className="text-center p-6 md:p-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Nos événements</h1>
          <p className="mt-3 text-lg opacity-90">Les repas passés, les souvenirs qui restent.</p>
        </header>
      </PaperCard>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12 px-4 sm:px-0">
        {evenements.map((evenement, i) => (
          <div key={evenement.id} className={i % 2 === 1 ? "lg:mt-8" : ""}>
            <Polaroid
              src={evenement.photo}
              alt={evenement.titre}
              caption={evenement.titre}
              tilt={tilts[i % tilts.length]}
            />
            <p className="mt-4 text-center text-sm text-white/90 capitalize">
              {formatDate(evenement.date)} · {evenement.convives} convives
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
