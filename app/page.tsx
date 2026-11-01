import PageEditable from "@/components/edition/PageEditable";
import { lirePage } from "@/lib/contenu/lecture";

// Contenu modifiable par les admins (mode édition), voir lib/contenu
export default async function AccueilPage() {
  return <PageEditable slug="accueil" initial={await lirePage("accueil")} />;
}
