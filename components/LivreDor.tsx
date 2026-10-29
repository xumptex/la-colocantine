"use client";

import { useMemo, useState } from "react";
import { Search, PenLine } from "lucide-react";
import { evenementsPasses, messagesLivreDor, type MessageLivreDor } from "@/lib/data";
import Livre from "./Livre";

const MESSAGES_PAR_PAGE = 3;

export default function LivreDor() {
  const [messages, setMessages] = useState<MessageLivreDor[]>(messagesLivreDor);
  const [recherche, setRecherche] = useState("");
  const [filtre, setFiltre] = useState("tous");

  // Formulaire "laisser un mot" (front uniquement, rien n'est sauvegardé)
  const [auteur, setAuteur] = useState("");
  const [evenementId, setEvenementId] = useState(evenementsPasses[evenementsPasses.length - 1].id);
  const [texte, setTexte] = useState("");

  const pages = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    const filtres = messages
      .filter((m) => filtre === "tous" || m.evenementId === filtre)
      .filter((m) => !q || m.message.toLowerCase().includes(q) || m.auteur.toLowerCase().includes(q))
      .sort((a, b) => b.date.localeCompare(a.date));

    const resultat: MessageLivreDor[][] = [];
    for (let i = 0; i < filtres.length; i += MESSAGES_PAR_PAGE) {
      resultat.push(filtres.slice(i, i + MESSAGES_PAR_PAGE));
    }
    return resultat;
  }, [messages, recherche, filtre]);

  const ajouterMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setMessages([
      {
        id: Date.now(),
        auteur,
        evenementId,
        message: texte,
        date: new Date().toISOString().slice(0, 10),
      },
      ...messages,
    ]);
    setAuteur("");
    setTexte("");
    setFiltre("tous");
    setRecherche("");
  };

  return (
    <div className="space-y-10">

      {/* En-tête : recherche + filtre */}
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
          {evenementsPasses.map((e) => (
            <option key={e.id} value={e.id}>{e.titre}</option>
          ))}
        </select>
      </div>

      {pages.length === 0 ? (
        <div className="bg-white rounded-sm shadow-2xl border border-marron/20 p-10 text-center font-handwriting text-3xl opacity-80">
          Aucun message ne correspond...
        </div>
      ) : (
        // La "key" ramène le livre à la première page après une recherche, un filtre ou un nouveau message
        <Livre key={`${filtre}|${recherche}|${messages.length}`} pages={pages} />
      )}

      {/* Laisser un mot */}
      <form
        onSubmit={ajouterMessage}
        className="max-w-2xl mx-auto bg-white rounded-sm shadow-xl border border-marron/20 p-6 md:p-8 space-y-4"
      >
        <h2 className="flex items-center gap-2 text-2xl font-semibold">
          <PenLine size={22} /> Laisser un mot
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            required
            value={auteur}
            onChange={(e) => setAuteur(e.target.value)}
            placeholder="Ton prénom"
            className="border border-marron/30 rounded-sm px-3 py-2 focus:outline-none focus:border-marron"
          />
          <select
            value={evenementId}
            onChange={(e) => setEvenementId(e.target.value)}
            className="border border-marron/30 rounded-sm px-3 py-2 bg-white focus:outline-none focus:border-marron"
            aria-label="Repas concerné"
          >
            {evenementsPasses.map((e) => (
              <option key={e.id} value={e.id}>{e.titre}</option>
            ))}
          </select>
        </div>
        <textarea
          required
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
          rows={3}
          placeholder="C'était comment ?"
          className="w-full border border-marron/30 rounded-sm px-3 py-2 font-handwriting text-2xl focus:outline-none focus:border-marron resize-none"
        />
        <button type="submit" className="w-full bg-marron text-white px-6 py-3 font-medium rounded-sm hover:bg-marron/90 transition-colors">
          Signer le livre d&apos;or
        </button>
      </form>
    </div>
  );
}
