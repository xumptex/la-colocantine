"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { Commentaire } from "@/lib/livre-dor";
import { supprimerCommentaire } from "@/app/livre-d-or/actions";
import Livre from "./Livre";
import FormulaireCommentaire from "./FormulaireCommentaire";
import { useCommentaires } from "./Commentaires";
import { useEdition } from "./edition/Edition";

// Place prise par un message sur une page : un message avec photos compte double
const CAPACITE_PAGE = 3;
const poids = (c: Commentaire) => (c.photos.length > 0 ? 2 : 1);

function paginer(commentaires: Commentaire[]) {
  const pages: Commentaire[][] = [];
  let page: Commentaire[] = [];
  let rempli = 0;
  for (const c of commentaires) {
    if (page.length && rempli + poids(c) > CAPACITE_PAGE) {
      pages.push(page);
      page = [];
      rempli = 0;
    }
    page.push(c);
    rempli += poids(c);
  }
  if (page.length) pages.push(page);
  return pages;
}

export default function LivreDor() {
  const commentaires = useCommentaires();
  const { estAdmin } = useEdition();
  const router = useRouter();
  const [recherche, setRecherche] = useState("");
  const [filtre, setFiltre] = useState("tous");
  const [supprimes, setSupprimes] = useState<string[]>([]);

  // Repas qui ont au moins un commentaire (pour le filtre)
  const repas = useMemo(() => {
    const vus = new Map<string, string>();
    commentaires.forEach((c) => vus.set(c.repasId, c.repasTitre));
    return [...vus].map(([id, titre]) => ({ id, titre }));
  }, [commentaires]);

  const visibles = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    return commentaires
      .filter((c) => !supprimes.includes(c.id))
      .filter((c) => filtre === "tous" || c.repasId === filtre)
      .filter((c) => !q || c.message.toLowerCase().includes(q) || c.prenom.toLowerCase().includes(q));
  }, [commentaires, supprimes, recherche, filtre]);

  const pages = useMemo(() => paginer(visibles), [visibles]);

  const supprimer = async (c: Commentaire) => {
    if (!window.confirm(`Supprimer le mot de ${c.prenom} ?`)) return;
    const resultat = await supprimerCommentaire(c.id);
    if (resultat.erreur) return window.alert(resultat.erreur);
    setSupprimes((s) => [...s, c.id]);
    router.refresh();
  };

  return (
    <div className="space-y-10">
      {/* En-tête : recherche + filtre */}
      {commentaires.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto">
          <label className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
            <input
              type="search"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Rechercher un mot, un prénom..."
              className="w-full bg-white border border-marron/30 rounded-sm pl-10 pr-3 py-2 shadow-md focus:outline-none focus:border-marron"
            />
          </label>
          <select
            value={filtre}
            onChange={(e) => setFiltre(e.target.value)}
            className="bg-white border border-marron/30 rounded-sm px-3 py-2 shadow-md focus:outline-none focus:border-marron"
            aria-label="Filtrer par repas"
          >
            <option value="tous">Tous les repas</option>
            {repas.map((r) => (
              <option key={r.id} value={r.id}>
                {r.titre}
              </option>
            ))}
          </select>
        </div>
      )}

      {pages.length === 0 ? (
        <div className="bg-white rounded-sm shadow-2xl border border-marron/20 p-10 text-center font-handwriting text-3xl">
          <span className="opacity-80">
            {commentaires.length === 0 ? "Le livre d'or attend ses premiers mots..." : "Aucun message ne correspond..."}
          </span>
        </div>
      ) : (
        // La "key" ramène le livre à la première page après une recherche, un filtre ou un changement
        <Livre key={`${filtre}|${recherche}|${visibles.length}`} pages={pages} onSupprimer={estAdmin ? supprimer : undefined} />
      )}

      <FormulaireCommentaire />
    </div>
  );
}
