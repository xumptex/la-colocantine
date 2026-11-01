import type { Metadata } from "next";
import PageEditable from "@/components/edition/PageEditable";
import { lirePage } from "@/lib/contenu/lecture";

export const metadata: Metadata = {
  title: "Aide - La Colocantine",
};

// Contenu modifiable par les admins (mode édition), voir lib/contenu
export default async function AidePage() {
  return <PageEditable slug="aide" initial={await lirePage("aide")} />;
}
