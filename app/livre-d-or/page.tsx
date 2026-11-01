import type { Metadata } from "next";
import PageEditable from "@/components/edition/PageEditable";
import { lirePage } from "@/lib/contenu/lecture";

export const metadata: Metadata = {
  title: "Livre d'or - La Colocantine",
};

// Contenu modifiable par les admins (mode édition), voir lib/contenu
export default async function LivreDorPage() {
  return <PageEditable slug="livre-d-or" initial={await lirePage("livre-d-or")} />;
}
