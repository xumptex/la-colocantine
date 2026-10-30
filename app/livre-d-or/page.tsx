import type { Metadata } from "next";
import TitrePage from "@/components/TitrePage";
import LivreDor from "@/components/LivreDor";

export const metadata: Metadata = {
  title: "Livre d'or - La Colocantine",
};

export default function LivreDorPage() {
  return (
    <div className="w-full max-w-6xl mx-auto py-4">
      <TitrePage titre="Livre d'or" sousTitre="Les petits mots laissés par nos convives." />
      <LivreDor />
    </div>
  );
}
