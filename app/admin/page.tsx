import type { Metadata } from "next";
import { Suspense } from "react";
import { ShieldCheck } from "lucide-react";
import PaperCard from "@/components/PaperCard";
import TitrePage from "@/components/TitrePage";
import { exigerAdmin } from "@/lib/auth";
import { creerClientServeur } from "@/lib/supabase/server";
import { formatDate } from "@/lib/data";
import { BoutonEnvoyerLiens, BoutonSupprimerInscription } from "@/components/ActionsInscriptions";

export const metadata: Metadata = {
  title: "Admin - La Colocantine",
};

export default function AdminPage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-4">
      <TitrePage titre="Espace admin" sousTitre="Réservé à la coloc." />
      <PaperCard tilt="none" className="mb-10">
        <Suspense fallback={<p className="p-8 text-center font-handwriting text-2xl opacity-60">Chargement...</p>}>
          <Inscriptions />
        </Suspense>
      </PaperCard>
      <PaperCard tilt="none">
        {/* Vérifie le rôle à chaque requête : derrière un Suspense */}
        <Suspense fallback={<p className="p-8 text-center font-handwriting text-2xl opacity-60">Chargement...</p>}>
          <Membres />
        </Suspense>
      </PaperCard>
    </div>
  );
}

async function Membres() {
  await exigerAdmin();
  const supabase = await creerClientServeur();
  // Les règles RLS laissent un admin lire tous les profils
  const { data: membres } = await supabase
    .from("profils")
    .select("id, email, prenom, nom, role, cree_le")
    .order("role", { ascending: false })
    .order("cree_le");

  return (
    <div className="p-6 md:p-8">
      <h2 className="text-xl font-semibold border-b-2 border-marron pb-1 mb-4">
        Membres inscrits ({membres?.length ?? 0})
      </h2>
      <ul className="divide-y divide-marron/10">
        {membres?.map((m) => (
          <li key={m.id} className="py-3 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="font-semibold">{[m.prenom, m.nom].filter(Boolean).join(" ") || "Sans nom"}</span>
            <span className="text-sm opacity-70">{m.email}</span>
            {m.role === "admin" && (
              <span className="flex items-center gap-1 text-xs font-semibold border border-marron rounded-full px-2 py-0.5">
                <ShieldCheck size={14} /> Admin
              </span>
            )}
            <span className="ml-auto text-sm opacity-60">
              inscrit le {new Date(m.cree_le).toLocaleDateString("fr-FR")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

type Inscription = {
  id: string;
  repas_id: string;
  repas_titre: string;
  repas_date: string | null;
  utilisateur_id: string | null;
  prenom: string;
  email: string;
  convives: number;
  remarques: string | null;
  lien_envoye_le: string | null;
};

// Inscriptions aux repas, regroupées par repas (le plus récent en premier)
async function Inscriptions() {
  await exigerAdmin();
  const supabase = await creerClientServeur();
  const { data } = await supabase
    .from("inscriptions")
    .select("id, repas_id, repas_titre, repas_date, utilisateur_id, prenom, email, convives, remarques, lien_envoye_le")
    .order("repas_date", { ascending: false, nullsFirst: true })
    .order("cree_le");

  const parRepas = new Map<string, Inscription[]>();
  ((data as Inscription[] | null) ?? []).forEach((i) => parRepas.set(i.repas_id, [...(parRepas.get(i.repas_id) ?? []), i]));
  const aujourdhui = new Date().toISOString().slice(0, 10);

  return (
    <div className="p-6 md:p-8 space-y-8">
      <h2 className="text-xl font-semibold border-b-2 border-marron pb-1">Inscriptions aux repas</h2>
      {parRepas.size === 0 && <p className="opacity-70">Aucune inscription pour l&apos;instant.</p>}

      {[...parRepas.values()].map((inscrits) => {
        const { repas_id, repas_titre, repas_date } = inscrits[0];
        const total = inscrits.reduce((n, i) => n + i.convives, 0);
        const sansCompte = inscrits.filter((i) => !i.utilisateur_id).length;
        return (
          <section key={repas_id} className="space-y-3">
            <div>
              <h3 className="font-titres text-2xl font-extrabold">{repas_titre}</h3>
              <p className="text-sm opacity-70 first-letter:uppercase">
                {repas_date ? formatDate(repas_date) : "Date à définir"} · {total} convive{total > 1 ? "s" : ""}
              </p>
            </div>
            <ul className="divide-y divide-marron/10 border-y border-marron/10">
              {inscrits.map((i) => (
                <li key={i.id} className="py-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                  <span className="font-semibold">{i.prenom}</span>
                  <span className="opacity-70">{i.email}</span>
                  <span>× {i.convives}</span>
                  <span className="text-xs rounded-full border border-marron/30 px-2 py-0.5">
                    {i.utilisateur_id ? "Compte" : i.lien_envoye_le ? "Lien envoyé" : "Sans compte"}
                  </span>
                  {i.remarques && <span className="basis-full opacity-70 italic">« {i.remarques} »</span>}
                  <span className="ml-auto">
                    <BoutonSupprimerInscription id={i.id} prenom={i.prenom} />
                  </span>
                </li>
              ))}
            </ul>
            <BoutonEnvoyerLiens repasId={repas_id} sansCompte={sansCompte} repasPasse={Boolean(repas_date) && repas_date! <= aujourdhui} />
          </section>
        );
      })}
    </div>
  );
}
