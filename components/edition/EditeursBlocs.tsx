"use client";

import { ArrowLeft, ArrowRight, ArrowDown, ArrowUp, BookOpen, Trash, X } from "lucide-react";
import PaperCard from "@/components/PaperCard";
import { tiltDe } from "@/components/blocs/Blocs";
import type {
  Bloc,
  BlocAnnonce,
  BlocFaq,
  BlocPolaroids,
  BlocTexte,
  BlocTitre,
  Macros,
  Plat,
  Repas,
  TypeBloc,
} from "@/lib/contenu/types";
import { BoutonAjouter, BoutonIcone, Champ, ChampTexte, Choix, ChoixPhoto, optionsInclinaison } from "./ui";

// Opérations sur les listes (sans modifier l'original)
export function deplacer<T>(liste: T[], i: number, decalage: number) {
  const copie = [...liste];
  const [element] = copie.splice(i, 1);
  copie.splice(i + decalage, 0, element);
  return copie;
}
export const remplacer = <T,>(liste: T[], i: number, element: T) => liste.map((e, j) => (j === i ? element : e));
export const retirer = <T,>(liste: T[], i: number) => liste.filter((_, j) => j !== i);

// Contenu d'un nouveau bloc
export function creerBloc(type: TypeBloc): Bloc {
  const id = crypto.randomUUID();
  switch (type) {
    case "titre":
      return { id, type, titre: "Nouveau titre", sousTitre: "Un petit sous-titre" };
    case "texte":
      return {
        id,
        type,
        titre: "Nouvelle carte",
        texte: "Écris ce que tu veux ici.",
        style: "normal",
        inclinaison: "aucune",
        largeur: "moyenne",
        photo: null,
        liens: [],
      };
    case "polaroids":
      return { id, type, photos: [{ legende: "Légende", details: "" }] };
    case "annonce":
      return {
        id,
        type,
        surtitre: "Prochain repas",
        repas: {
          id: crypto.randomUUID(),
          titre: "Nom du repas",
          date: "",
          heure: "19h30",
          prix: 10,
          placesTotal: 12,
          placesPrises: 0,
          menu: [
            { categorie: "Entrée", nom: "", description: "" },
            { categorie: "Plat", nom: "", description: "" },
            { categorie: "Dessert", nom: "", description: "" },
          ],
          macros: { kcal: 0, proteines: 0, glucides: 0, lipides: 0 },
          allergenes: [],
        },
      };
    case "faq":
      return { id, type, inclinaison: "aucune", questions: [{ question: "Nouvelle question ?", reponse: "La réponse." }] };
    case "livre-dor":
      return { id, type };
  }
}

type EditeurProps<B> = { bloc: B; onChange: (bloc: B) => void };

export function EditeurTitre({ bloc, onChange }: EditeurProps<BlocTitre>) {
  return (
    <PaperCard tilt="none" className="w-full max-w-2xl mx-auto">
      <header className="text-center px-8 py-5 md:px-10 space-y-2">
        <ChampTexte
          valeur={bloc.titre}
          onChange={(titre) => onChange({ ...bloc, titre })}
          placeholder="Titre"
          className="font-titres text-4xl md:text-5xl font-extrabold tracking-tight text-center"
        />
        <ChampTexte
          valeur={bloc.sousTitre}
          onChange={(sousTitre) => onChange({ ...bloc, sousTitre })}
          placeholder="Sous-titre (facultatif)"
          className="text-lg opacity-90 text-center"
        />
      </header>
    </PaperCard>
  );
}

export function ReglagesTexte({ bloc, onChange }: EditeurProps<BlocTexte>) {
  return (
    <>
      <Choix label="Inclinaison" valeur={bloc.inclinaison} options={optionsInclinaison} onChange={(inclinaison) => onChange({ ...bloc, inclinaison })} />
      <Choix
        label="Largeur"
        valeur={bloc.largeur}
        options={[
          { valeur: "etroite", texte: "Étroite" },
          { valeur: "moyenne", texte: "Moyenne" },
          { valeur: "large", texte: "Large" },
        ]}
        onChange={(largeur) => onChange({ ...bloc, largeur })}
      />
      <Choix
        label="Style du texte"
        valeur={bloc.style}
        options={[
          { valeur: "normal", texte: "Normal" },
          { valeur: "manuscrit", texte: "Manuscrit" },
        ]}
        onChange={(style) => onChange({ ...bloc, style })}
      />
    </>
  );
}

export function EditeurTexte({ bloc, onChange }: EditeurProps<BlocTexte>) {
  return (
    <PaperCard tilt={tiltDe[bloc.inclinaison]} className="w-full">
      <section className="p-6 md:p-10 flex flex-col lg:flex-row items-center lg:items-start gap-10">
        <div className="flex-1 w-full min-w-0 space-y-6">
          <ChampTexte
            valeur={bloc.titre}
            onChange={(titre) => onChange({ ...bloc, titre })}
            placeholder="Titre (facultatif)"
            className="font-titres text-4xl md:text-5xl font-extrabold tracking-tight"
          />
          <ChampTexte
            multiligne
            valeur={bloc.texte}
            onChange={(texte) => onChange({ ...bloc, texte })}
            placeholder="Ton texte..."
            className={bloc.style === "manuscrit" ? "font-handwriting text-3xl leading-snug" : "text-lg leading-relaxed"}
          />

          {/* Liens */}
          <div className="space-y-2">
            {bloc.liens.map((lien, i) => (
              <div key={i} className="flex flex-wrap items-center gap-2 text-sm">
                <input
                  value={lien.texte}
                  onChange={(e) => onChange({ ...bloc, liens: remplacer(bloc.liens, i, { ...lien, texte: e.target.value }) })}
                  placeholder="Texte du lien"
                  className="flex-1 min-w-32 border border-marron/30 rounded-sm px-2 py-1 font-medium"
                />
                <input
                  value={lien.url}
                  onChange={(e) => onChange({ ...bloc, liens: remplacer(bloc.liens, i, { ...lien, url: e.target.value }) })}
                  placeholder="/events, https://..."
                  className="flex-1 min-w-32 border border-marron/30 rounded-sm px-2 py-1 font-mono text-xs"
                />
                <BoutonIcone icone={X} label="Retirer le lien" danger onClick={() => onChange({ ...bloc, liens: retirer(bloc.liens, i) })} />
              </div>
            ))}
            <BoutonAjouter texte="Ajouter un lien" onClick={() => onChange({ ...bloc, liens: [...bloc.liens, { texte: "Mon lien", url: "/" }] })} />
          </div>
        </div>

        {/* Photo façon Polaroïd */}
        {bloc.photo ? (
          <div className="w-64 shrink-0 bg-white rounded-sm shadow-xl border border-marron/20 p-3 pb-4 rotate-2">
            <ChoixPhoto url={bloc.photo.url} onChange={(url) => onChange({ ...bloc, photo: { ...bloc.photo!, url } })} />
            <ChampTexte
              valeur={bloc.photo.legende}
              onChange={(legende) => onChange({ ...bloc, photo: { ...bloc.photo!, legende } })}
              placeholder="Légende"
              className="font-handwriting text-2xl text-center mt-3"
            />
            <button type="button" onClick={() => onChange({ ...bloc, photo: null })} className="mt-2 w-full text-xs underline opacity-60 hover:opacity-100">
              Enlever le Polaroïd
            </button>
          </div>
        ) : (
          <BoutonAjouter texte="Ajouter un Polaroïd" onClick={() => onChange({ ...bloc, photo: { legende: "Légende" } })} className="w-64 h-32 shrink-0" />
        )}
      </section>
    </PaperCard>
  );
}

export function EditeurPolaroids({ bloc, onChange }: EditeurProps<BlocPolaroids>) {
  const { photos } = bloc;
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12 px-4 sm:px-0">
      {photos.map((photo, i) => (
        <div key={i}>
          <figure className="bg-white rounded-sm shadow-xl border border-marron/20 p-3 pb-4">
            <ChoixPhoto url={photo.url} onChange={(url) => onChange({ ...bloc, photos: remplacer(photos, i, { ...photo, url }) })} />
            <ChampTexte
              valeur={photo.legende}
              onChange={(legende) => onChange({ ...bloc, photos: remplacer(photos, i, { ...photo, legende }) })}
              placeholder="Légende"
              className="font-handwriting text-2xl text-center mt-3"
            />
          </figure>
          <ChampTexte
            valeur={photo.details}
            onChange={(details) => onChange({ ...bloc, photos: remplacer(photos, i, { ...photo, details }) })}
            placeholder="Détails sous la photo (facultatif)"
            className="mt-3 text-center text-sm text-white placeholder:text-white/50"
          />
          <div className="mt-2 flex justify-center gap-1 text-white">
            <BoutonIcone icone={ArrowLeft} label="Avancer" onClick={() => onChange({ ...bloc, photos: deplacer(photos, i, -1) })} disabled={i === 0} />
            <BoutonIcone
              icone={ArrowRight}
              label="Reculer"
              onClick={() => onChange({ ...bloc, photos: deplacer(photos, i, 1) })}
              disabled={i === photos.length - 1}
            />
            <BoutonIcone icone={Trash} label="Supprimer la photo" danger onClick={() => onChange({ ...bloc, photos: retirer(photos, i) })} />
          </div>
        </div>
      ))}
      <BoutonAjouter
        texte="Ajouter un Polaroïd"
        onClick={() => onChange({ ...bloc, photos: [...photos, { legende: "Légende", details: "" }] })}
        className="aspect-square bg-white/10 text-white border-white/40"
      />
    </div>
  );
}

export function EditeurAnnonce({ bloc, onChange }: EditeurProps<BlocAnnonce>) {
  const { repas } = bloc;
  const majRepas = (modif: Partial<Repas>) => onChange({ ...bloc, repas: { ...repas, ...modif } });
  const majMacros = (cle: keyof Macros, valeur: string) => majRepas({ macros: { ...repas.macros, [cle]: Number(valeur) || 0 } });
  const majPlat = (i: number, modif: Partial<Plat>) => majRepas({ menu: remplacer(repas.menu, i, { ...repas.menu[i], ...modif }) });

  return (
    <PaperCard tilt="none" className="w-full">
      <section className="p-6 md:p-10 space-y-8">
        <div className="text-center space-y-1">
          <ChampTexte
            valeur={bloc.surtitre}
            onChange={(surtitre) => onChange({ ...bloc, surtitre })}
            placeholder="Surtitre (ex : Prochain repas)"
            className="font-handwriting text-2xl text-center opacity-80"
          />
          <ChampTexte
            valeur={repas.titre}
            onChange={(titre) => majRepas({ titre })}
            placeholder="Nom du repas"
            className="font-titres text-3xl md:text-4xl font-extrabold text-center tracking-tight"
          />
        </div>

        <fieldset className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <Champ label="Date" type="date" valeur={repas.date} onChange={(date) => majRepas({ date })} className="col-span-2 lg:col-span-1" />
          <Champ label="Heure" valeur={repas.heure} onChange={(heure) => majRepas({ heure })} />
          <Champ label="Prix (€)" type="number" valeur={repas.prix} onChange={(v) => majRepas({ prix: Number(v) || 0 })} />
          <Champ label="Places" type="number" valeur={repas.placesTotal} onChange={(v) => majRepas({ placesTotal: Number(v) || 0 })} />
          <Champ label="Prises hors site" type="number" valeur={repas.placesPrises} onChange={(v) => majRepas({ placesPrises: Number(v) || 0 })} />
        </fieldset>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Menu */}
          <div>
            <h3 className="text-xl font-semibold border-b-2 border-marron pb-1 mb-4">Au menu</h3>
            <ul className="space-y-4">
              {repas.menu.map((plat, i) => (
                <li key={i} className="space-y-1 rounded-sm border border-marron/15 p-3">
                  <div className="flex items-center gap-1">
                    <input
                      value={plat.categorie}
                      onChange={(e) => majPlat(i, { categorie: e.target.value })}
                      placeholder="Catégorie"
                      className="flex-1 text-xs uppercase tracking-widest bg-transparent border-b border-dashed border-marron/30 focus:outline-none focus:border-marron"
                    />
                    <BoutonIcone icone={ArrowUp} label="Monter" disabled={i === 0} onClick={() => majRepas({ menu: deplacer(repas.menu, i, -1) })} />
                    <BoutonIcone
                      icone={ArrowDown}
                      label="Descendre"
                      disabled={i === repas.menu.length - 1}
                      onClick={() => majRepas({ menu: deplacer(repas.menu, i, 1) })}
                    />
                    <BoutonIcone icone={Trash} label="Retirer le plat" danger onClick={() => majRepas({ menu: retirer(repas.menu, i) })} />
                  </div>
                  <ChampTexte valeur={plat.nom} onChange={(nom) => majPlat(i, { nom })} placeholder="Nom du plat" className="font-semibold" />
                  <ChampTexte
                    multiligne
                    valeur={plat.description}
                    onChange={(description) => majPlat(i, { description })}
                    placeholder="Description"
                    className="text-sm leading-relaxed"
                  />
                </li>
              ))}
            </ul>
            <BoutonAjouter
              texte="Ajouter un plat"
              onClick={() => majRepas({ menu: [...repas.menu, { categorie: "Plat", nom: "", description: "" }] })}
              className="mt-3 w-full"
            />
          </div>

          {/* Macros */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b-2 border-marron pb-1">Les macros</h3>
            <div className="grid grid-cols-2 gap-3">
              <Champ label="Calories (kcal)" type="number" valeur={repas.macros.kcal} onChange={(v) => majMacros("kcal", v)} />
              <Champ label="Protéines (g)" type="number" valeur={repas.macros.proteines} onChange={(v) => majMacros("proteines", v)} />
              <Champ label="Glucides (g)" type="number" valeur={repas.macros.glucides} onChange={(v) => majMacros("glucides", v)} />
              <Champ label="Lipides (g)" type="number" valeur={repas.macros.lipides} onChange={(v) => majMacros("lipides", v)} />
            </div>
            <Champ
              label="Allergènes (séparés par des virgules)"
              valeur={repas.allergenes.join(", ")}
              onChange={(v) => majRepas({ allergenes: v.split(",").map((a) => a.trim()).filter(Boolean) })}
            />
            <p className="text-sm opacity-60">
              Le bouton d&apos;inscription s&apos;affiche sous l&apos;annonce. Les places restantes tiennent compte des inscriptions faites sur
              le site, en plus des places prises hors site.
            </p>
            <div className="rounded-sm border border-dashed border-marron/30 p-3 text-sm space-y-2">
              <p>
                <span className="font-semibold">Un nouveau repas ?</span> Repars de zéro plutôt que de modifier l&apos;ancien : ses
                inscriptions et ses commentaires restent attachés à l&apos;ancien repas.
              </p>
              <button
                type="button"
                onClick={() =>
                  window.confirm("Transformer cette annonce en un nouveau repas ? Les inscriptions actuelles resteront liées à l'ancien.") &&
                  majRepas({ id: crypto.randomUUID(), date: "", placesPrises: 0 })
                }
                className="underline font-medium"
              >
                C&apos;est un nouveau repas
              </button>
            </div>
          </div>
        </div>
      </section>
    </PaperCard>
  );
}

export function ReglagesFaq({ bloc, onChange }: EditeurProps<BlocFaq>) {
  return <Choix label="Inclinaison" valeur={bloc.inclinaison} options={optionsInclinaison} onChange={(inclinaison) => onChange({ ...bloc, inclinaison })} />;
}

export function EditeurFaq({ bloc, onChange }: EditeurProps<BlocFaq>) {
  const { questions } = bloc;
  return (
    <PaperCard tilt={tiltDe[bloc.inclinaison]} className="w-full">
      <div className="p-6 md:p-10 space-y-4">
        {questions.map((qr, i) => (
          <div key={i} className="flex gap-2 border-b border-marron/15 pb-4">
            <div className="flex-1 space-y-2">
              <ChampTexte
                valeur={qr.question}
                onChange={(question) => onChange({ ...bloc, questions: remplacer(questions, i, { ...qr, question }) })}
                placeholder="Question"
                className="font-semibold text-lg"
              />
              <ChampTexte
                multiligne
                valeur={qr.reponse}
                onChange={(reponse) => onChange({ ...bloc, questions: remplacer(questions, i, { ...qr, reponse }) })}
                placeholder="Réponse"
                className="leading-relaxed"
              />
            </div>
            <div className="flex flex-col">
              <BoutonIcone icone={ArrowUp} label="Monter" disabled={i === 0} onClick={() => onChange({ ...bloc, questions: deplacer(questions, i, -1) })} />
              <BoutonIcone
                icone={ArrowDown}
                label="Descendre"
                disabled={i === questions.length - 1}
                onClick={() => onChange({ ...bloc, questions: deplacer(questions, i, 1) })}
              />
              <BoutonIcone icone={Trash} label="Supprimer la question" danger onClick={() => onChange({ ...bloc, questions: retirer(questions, i) })} />
            </div>
          </div>
        ))}
        <BoutonAjouter
          texte="Ajouter une question"
          onClick={() => onChange({ ...bloc, questions: [...questions, { question: "Nouvelle question ?", reponse: "" }] })}
          className="w-full"
        />
      </div>
    </PaperCard>
  );
}

export function EditeurLivreDor() {
  return (
    <PaperCard tilt="none" className="w-full">
      <div className="p-8 flex items-center gap-4">
        <BookOpen size={32} className="shrink-0" />
        <div>
          <p className="font-semibold text-lg">Livre d&apos;or</p>
          <p className="opacity-70">Les messages laissés par les convives s&apos;affichent ici. Tu peux déplacer ou supprimer ce bloc.</p>
        </div>
      </div>
    </PaperCard>
  );
}
