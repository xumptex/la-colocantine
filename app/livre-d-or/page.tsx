import type { Metadata } from "next";
import PaperCard from "@/components/PaperCard";
import LivreDor from "@/components/LivreDor";

export const metadata: Metadata = {
  title: "Livre d'or - La Colocantine",
};

export default function LivreDorPage() {
  return (
    <div className="w-full max-w-6xl mx-auto py-4">
      <PaperCard tilt="none" className="max-w-2xl mx-auto mb-10">
        <header className="text-center p-6 md:p-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Livre d&apos;or</h1>
          <p className="mt-3 text-lg opacity-90">Les petits mots laissés par nos convives.</p>
        </header>
      </PaperCard>
      <LivreDor />
    </div>
  );
}
