"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ImagePlus, LoaderCircle, PenLine, X } from "lucide-react";
import { creerClientNavigateur } from "@/lib/supabase/client";
import { supabaseConfigure } from "@/lib/supabase/env";
import { PHOTOS_MAX } from "@/lib/livre-dor";
import { publierCommentaire } from "@/app/livre-d-or/actions";
import { useEdition } from "./edition/Edition";
import { ChoixEtoiles } from "./Etoiles";

type RepasCommentable = { repas_id: string; repas_titre: string };

const TAILLE_MAX = 5 * 1024 * 1024; // 5 Mo
const carte = "max-w-2xl mx-auto bg-white rounded-sm shadow-xl border border-marron/20 p-6 md:p-8";

// "Laisser un mot" : réservé aux convives d'un repas passé
export default function FormulaireCommentaire() {
  const { utilisateur } = useEdition();
  const router = useRouter();
  const [repas, setRepas] = useState<RepasCommentable[] | null>(null);
  const [repasId, setRepasId] = useState("");
  const [note, setNote] = useState(0);
  const [message, setMessage] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [envoiPhoto, setEnvoiPhoto] = useState(false);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [merci, setMerci] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  // Repas que l'utilisateur peut commenter (vérifié par la base)
  useEffect(() => {
    if (!utilisateur || !supabaseConfigure()) return setRepas(null);
    creerClientNavigateur()
      .rpc("repas_commentables")
      .then(({ data }) => {
        const liste = (data as RepasCommentable[] | null) ?? [];
        setRepas(liste);
        setRepasId(liste[0]?.repas_id ?? "");
      });
  }, [utilisateur]);

  if (!utilisateur) {
    return (
      <div className={`${carte} text-center space-y-3`}>
        <h2 className="flex items-center justify-center gap-2 text-2xl font-semibold">
          <PenLine size={22} /> Laisser un mot
        </h2>
        <p className="opacity-80">
          Tu as participé à un repas ? Utilise le lien reçu par email, ou{" "}
          <Link href="/login" className="font-semibold underline">
            connecte-toi
          </Link>{" "}
          pour laisser un mot.
        </p>
      </div>
    );
  }

  if (merci) {
    return (
      <div className={`${carte} flex flex-col items-center gap-2 text-center`}>
        <Check size={32} />
        <p className="font-handwriting text-3xl">Merci pour ton mot !</p>
      </div>
    );
  }

  if (repas === null) return null;

  if (repas.length === 0) {
    return (
      <div className={`${carte} text-center space-y-2`}>
        <h2 className="flex items-center justify-center gap-2 text-2xl font-semibold">
          <PenLine size={22} /> Laisser un mot
        </h2>
        <p className="opacity-80">Tu pourras laisser un mot après un repas auquel tu étais inscrit.</p>
      </div>
    );
  }

  const ajouterPhoto = async (fichier: File) => {
    setErreur(null);
    if (!fichier.type.startsWith("image/")) return setErreur("Choisis une image.");
    if (fichier.size > TAILLE_MAX) return setErreur("Image trop lourde (5 Mo max).");
    setEnvoiPhoto(true);
    const supabase = creerClientNavigateur();
    const extension = fichier.name.split(".").pop()?.toLowerCase() ?? "jpg";
    // Un dossier par utilisateur (règle de la base)
    const chemin = `${utilisateur.id}/${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage.from("commentaires").upload(chemin, fichier, { cacheControl: "31536000" });
    setEnvoiPhoto(false);
    if (error) return setErreur("Envoi de la photo impossible, réessaie.");
    setPhotos((p) => [...p, supabase.storage.from("commentaires").getPublicUrl(chemin).data.publicUrl]);
  };

  const envoyer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note) return setErreur("Choisis une note.");
    setEnCours(true);
    setErreur(null);
    const resultat = await publierCommentaire({ repasId, message, note, photos });
    setEnCours(false);
    if (resultat.erreur) return setErreur(resultat.erreur);
    setMerci(true);
    router.refresh();
  };

  return (
    <form onSubmit={envoyer} className={`${carte} space-y-5`}>
      <h2 className="flex items-center gap-2 text-2xl font-semibold">
        <PenLine size={22} /> Laisser un mot
      </h2>

      {repas.length > 1 ? (
        <label className="block">
          <span className="text-sm font-medium">Pour quel repas ?</span>
          <select
            value={repasId}
            onChange={(e) => setRepasId(e.target.value)}
            className="mt-1 w-full border border-marron/30 rounded-sm px-3 py-2 bg-white focus:outline-none focus:border-marron"
          >
            {repas.map((r) => (
              <option key={r.repas_id} value={r.repas_id}>
                {r.repas_titre}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <p className="text-sm">
          Pour le repas <span className="font-semibold">{repas[0].repas_titre}</span>
        </p>
      )}

      <div>
        <span className="text-sm font-medium">Ta note</span>
        <ChoixEtoiles note={note} onChange={setNote} />
      </div>

      <textarea
        required
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        maxLength={2000}
        placeholder="C'était comment ?"
        className="w-full border border-marron/30 rounded-sm px-3 py-2 font-handwriting text-2xl focus:outline-none focus:border-marron resize-none"
      />

      {/* Photos, en petits Polaroïds */}
      <div>
        <span className="text-sm font-medium">
          Des photos ? <span className="opacity-60">({PHOTOS_MAX} max)</span>
        </span>
        <div className="mt-2 flex flex-wrap gap-4">
          {photos.map((url, i) => (
            <div key={url} className={`relative bg-white p-1.5 pb-4 shadow-md border border-marron/15 ${i % 2 ? "rotate-2" : "-rotate-2"}`}>
              <span className="relative block w-20 h-20">
                <Image src={url} alt="" fill sizes="80px" className="object-cover" />
              </span>
              <button
                type="button"
                onClick={() => setPhotos((p) => p.filter((u) => u !== url))}
                className="absolute -top-2 -right-2 rounded-full bg-marron text-white p-0.5"
                aria-label="Retirer la photo"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {photos.length < PHOTOS_MAX && (
            <button
              type="button"
              onClick={() => input.current?.click()}
              disabled={envoiPhoto}
              className="w-22 h-26 flex flex-col items-center justify-center gap-1 border-2 border-dashed border-marron/30 rounded-sm text-xs opacity-80 hover:opacity-100 hover:border-marron/60"
            >
              {envoiPhoto ? <LoaderCircle size={20} className="animate-spin" /> : <ImagePlus size={20} />}
              {envoiPhoto ? "Envoi..." : "Ajouter"}
            </button>
          )}
        </div>
        <input
          ref={input}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const fichier = e.target.files?.[0];
            if (fichier) ajouterPhoto(fichier);
            e.target.value = "";
          }}
        />
      </div>

      {erreur && (
        <p role="alert" className="text-sm text-red-700">
          {erreur}
        </p>
      )}

      <button
        type="submit"
        disabled={enCours || envoiPhoto}
        className="w-full bg-marron text-white px-6 py-3 font-medium rounded-sm hover:bg-marron/90 transition-colors disabled:opacity-60"
      >
        {enCours ? "Un instant..." : "Signer le livre d'or"}
      </button>
    </form>
  );
}
