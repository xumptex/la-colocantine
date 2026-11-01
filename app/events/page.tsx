import type { Metadata } from "next";
import PageEditable from "@/components/edition/PageEditable";
import { lirePage } from "@/lib/contenu/lecture";

export const metadata: Metadata = {
  title: "Nos événements - La Colocantine",
};

// Contenu modifiable par les admins (mode édition), voir lib/contenu
export default async function EventsPage() {
  return <PageEditable slug="events" initial={await lirePage("events")} />;
}
