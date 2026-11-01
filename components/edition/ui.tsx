"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  Camera,
  CircleQuestionMark,
  Heading,
  ImagePlus,
  Images,
  LoaderCircle,
  Plus,
  Settings2,
  Trash,
  Type,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { creerClientNavigateur } from "@/lib/supabase/client";
import type { Inclinaison, TypeBloc } from "@/lib/contenu/types";

// Petits composants de l'interface d'édition (réservée aux admins)

type ChampTexteProps = {
  valeur: string;
  onChange: (valeur: string) => void;
  className?: string;
  placeholder?: string;
  multiligne?: boolean;
};

// Texte modifiable directement dans la page : garde le style du bloc et grandit avec son contenu
export function ChampTexte({ valeur, onChange, className = "", placeholder, multiligne = false }: ChampTexteProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [valeur]);

  return (
    <textarea
      ref={ref}
      rows={1}
      value={valeur}
      placeholder={placeholder}
      onChange={(e) => onChange(multiligne ? e.target.value : e.target.value.replace(/\n/g, " "))}
      onKeyDown={(e) => !multiligne && e.key === "Enter" && e.preventDefault()}
      className={`block w-full resize-none overflow-hidden bg-transparent rounded-sm px-1 -mx-1 outline-1 outline-dashed outline-marron/30 hover:outline-marron/60 focus:outline-2 focus:outline-solid focus:outline-marron placeholder:text-marron/40 ${className}`}
    />
  );
}

type ChampProps = {
  label: string;
  valeur: string | number;
  onChange: (valeur: string) => void;
  type?: "text" | "number" | "date" | "email";
  className?: string;
};

// Champ de formulaire classique, avec son étiquette
export function Champ({ label, valeur, onChange, type = "text", className = "" }: ChampProps) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-semibold uppercase tracking-wide opacity-70">{label}</span>
      <input
        type={type}
        value={valeur}
        min={type === "number" ? 0 : undefined}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-marron/30 rounded-sm px-2 py-1.5 bg-white focus:outline-none focus:border-marron"
      />
    </label>
  );
}

type ChoixProps<T extends string> = {
  label: string;
  valeur: T;
  options: { valeur: T; texte: string }[];
  onChange: (valeur: T) => void;
};

// Choix parmi quelques options (boutons côte à côte)
export function Choix<T extends string>({ label, valeur, options, onChange }: ChoixProps<T>) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-70 mb-1">{label}</p>
      <div className="flex rounded-sm border border-marron/30 overflow-hidden">
        {options.map((o) => (
          <button
            key={o.valeur}
            type="button"
            onClick={() => onChange(o.valeur)}
            className={`flex-1 px-2 py-1.5 text-sm transition-colors ${valeur === o.valeur ? "bg-marron text-white" : "hover:bg-marron/5"}`}
          >
            {o.texte}
          </button>
        ))}
      </div>
    </div>
  );
}

export const optionsInclinaison: { valeur: Inclinaison; texte: string }[] = [
  { valeur: "gauche", texte: "Penchée ↶" },
  { valeur: "aucune", texte: "Bien droite" },
  { valeur: "droite", texte: "Penchée ↷" },
];

type BoutonIconeProps = {
  icone: LucideIcon;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
};

export function BoutonIcone({ icone: Icone, label, onClick, disabled, danger }: BoutonIconeProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`p-1.5 rounded-sm transition-colors disabled:opacity-30 ${danger ? "hover:bg-red-100 hover:text-red-700" : "hover:bg-marron/10"}`}
    >
      <Icone size={16} />
    </button>
  );
}

// Bouton "ajouter" en pointillés (ajouter une question, un plat, une photo...)
export function BoutonAjouter({ texte, onClick, className = "" }: { texte: string; onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-2 border-2 border-dashed border-marron/30 rounded-sm px-4 py-2 text-sm font-medium opacity-80 hover:opacity-100 hover:border-marron/60 transition ${className}`}
    >
      <Plus size={16} /> {texte}
    </button>
  );
}

const TAILLE_MAX = 5 * 1024 * 1024; // 5 Mo

type ChoixPhotoProps = {
  url?: string;
  onChange: (url: string | undefined) => void;
  className?: string;
};

// Emplacement photo carré : un clic pour choisir une image, envoyée dans Supabase Storage
export function ChoixPhoto({ url, onChange, className = "" }: ChoixPhotoProps) {
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  const envoyer = async (fichier: File) => {
    setErreur(null);
    if (!fichier.type.startsWith("image/")) return setErreur("Choisis une image.");
    if (fichier.size > TAILLE_MAX) return setErreur("Image trop lourde (5 Mo max).");

    setEnvoi(true);
    const supabase = creerClientNavigateur();
    const extension = fichier.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const chemin = `${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage.from("images").upload(chemin, fichier, { cacheControl: "31536000" });
    setEnvoi(false);
    if (error) return setErreur("Envoi impossible, réessaie.");
    onChange(supabase.storage.from("images").getPublicUrl(chemin).data.publicUrl);
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => input.current?.click()}
        className="group/photo relative aspect-square w-full overflow-hidden bg-cyanfonce/15 border border-marron/10"
      >
        {url ? (
          <Image src={url} alt="" fill sizes="300px" className="object-cover" />
        ) : (
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-marron/50">
            <Camera size={32} />
            <span className="text-sm">Photo à venir</span>
          </span>
        )}
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-marron/70 text-white text-sm font-medium opacity-0 group-hover/photo:opacity-100 transition-opacity">
          {envoi ? <LoaderCircle size={24} className="animate-spin" /> : <ImagePlus size={24} />}
          {envoi ? "Envoi..." : url ? "Changer la photo" : "Choisir une photo"}
        </span>
      </button>
      <input
        ref={input}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const fichier = e.target.files?.[0];
          if (fichier) envoyer(fichier);
          e.target.value = "";
        }}
      />
      {url && (
        <button type="button" onClick={() => onChange(undefined)} className="mt-1 text-xs underline opacity-60 hover:opacity-100">
          Retirer la photo
        </button>
      )}
      {erreur && <p className="mt-1 text-xs text-red-700">{erreur}</p>}
    </div>
  );
}

// Types de blocs proposés dans le menu "Ajouter un bloc"
export const TYPES_BLOCS: { type: TypeBloc; nom: string; description: string; icone: LucideIcon }[] = [
  { type: "titre", nom: "Titre", description: "Un titre de page avec un sous-titre", icone: Heading },
  { type: "texte", nom: "Carte de texte", description: "Un rectangle blanc avec ton texte, et une photo si tu veux", icone: Type },
  { type: "polaroids", nom: "Polaroïds", description: "Une galerie de photos façon Polaroïd", icone: Images },
  { type: "annonce", nom: "Annonce de repas", description: "Menu, date, prix, places et macros", icone: UtensilsCrossed },
  { type: "faq", nom: "Questions / réponses", description: "Une liste de questions qui se déplient", icone: CircleQuestionMark },
  { type: "livre-dor", nom: "Livre d'or", description: "Les messages laissés par les convives", icone: BookOpen },
];

// Bouton "+ Ajouter un bloc" et son menu
export function AjoutBloc({ onAjouter }: { onAjouter: (type: TypeBloc) => void }) {
  const [ouvert, setOuvert] = useState(false);

  if (!ouvert) {
    return (
      <div className="w-full max-w-5xl flex items-center gap-3 group/ajout">
        <span className="flex-1 border-t-2 border-dashed border-white/30 group-hover/ajout:border-white/70 transition-colors"></span>
        <button
          type="button"
          onClick={() => setOuvert(true)}
          className="flex items-center gap-2 rounded-full bg-white/90 hover:bg-white text-marron px-4 py-1.5 text-sm font-semibold shadow-md transition"
        >
          <Plus size={16} /> Ajouter un bloc
        </button>
        <span className="flex-1 border-t-2 border-dashed border-white/30 group-hover/ajout:border-white/70 transition-colors"></span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl bg-white rounded-md shadow-2xl border border-marron/20 p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="font-semibold">Quel bloc ajouter ?</p>
        <button type="button" onClick={() => setOuvert(false)} className="text-sm underline opacity-70 hover:opacity-100">
          Annuler
        </button>
      </div>
      <div className="grid sm:grid-cols-2 gap-2">
        {TYPES_BLOCS.map(({ type, nom, description, icone: Icone }) => (
          <button
            key={type}
            type="button"
            onClick={() => {
              onAjouter(type);
              setOuvert(false);
            }}
            className="flex items-start gap-3 text-left rounded-sm border border-marron/15 p-3 hover:border-marron hover:bg-marron/5 transition"
          >
            <Icone size={20} className="shrink-0 mt-0.5" />
            <span>
              <span className="block font-semibold">{nom}</span>
              <span className="block text-sm opacity-70">{description}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

type CadreBlocProps = {
  nom: string;
  premier: boolean;
  dernier: boolean;
  onMonter: () => void;
  onDescendre: () => void;
  onSupprimer: () => void;
  reglages?: React.ReactNode; // contenu du panneau "Réglages" du bloc
  children: React.ReactNode;
};

// Cadre autour d'un bloc en mode édition, avec sa barre d'outils
export function CadreBloc({ nom, premier, dernier, onMonter, onDescendre, onSupprimer, reglages, children }: CadreBlocProps) {
  const [reglagesOuverts, setReglagesOuverts] = useState(false);

  return (
    <div className="relative w-full rounded-md outline-2 outline-dashed outline-white/50 outline-offset-8 hover:outline-white transition-colors">
      <div className="absolute -top-12 right-0 z-30 flex items-center gap-1 rounded-md bg-white text-marron shadow-lg border border-marron/20 px-2 py-1">
        <span className="text-xs font-semibold uppercase tracking-wide opacity-60 pr-2 mr-1 border-r border-marron/15">{nom}</span>
        <BoutonIcone icone={ArrowUp} label="Monter" onClick={onMonter} disabled={premier} />
        <BoutonIcone icone={ArrowDown} label="Descendre" onClick={onDescendre} disabled={dernier} />
        {reglages && <BoutonIcone icone={Settings2} label="Réglages" onClick={() => setReglagesOuverts(!reglagesOuverts)} />}
        <BoutonIcone
          icone={Trash}
          label="Supprimer"
          danger
          onClick={() => window.confirm(`Supprimer ce bloc « ${nom} » ?`) && onSupprimer()}
        />
      </div>
      {reglages && reglagesOuverts && (
        <div className="absolute top-0 right-0 z-30 w-72 space-y-4 rounded-md bg-white text-marron shadow-2xl border border-marron/20 p-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold">Réglages</p>
            <button type="button" onClick={() => setReglagesOuverts(false)} className="text-sm underline opacity-70 hover:opacity-100">
              Fermer
            </button>
          </div>
          {reglages}
        </div>
      )}
      {children}
    </div>
  );
}
