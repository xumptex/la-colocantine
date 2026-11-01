"use client";

import { Fragment } from "react";
import { ListeBlocs, RenduBlocs, largeurBloc } from "@/components/blocs/Blocs";
import type { Bloc, ContenuPage, SlugPage } from "@/lib/contenu/types";
import { useZone } from "./Edition";
import { AjoutBloc, CadreBloc, TYPES_BLOCS } from "./ui";
import {
  EditeurAnnonce,
  EditeurFaq,
  EditeurLivreDor,
  EditeurPolaroids,
  EditeurTexte,
  EditeurTitre,
  ReglagesFaq,
  ReglagesTexte,
  creerBloc,
  deplacer,
  remplacer,
  retirer,
} from "./EditeursBlocs";

function EditeurBloc({ bloc, onChange }: { bloc: Bloc; onChange: (bloc: Bloc) => void }) {
  switch (bloc.type) {
    case "titre":
      return <EditeurTitre bloc={bloc} onChange={onChange} />;
    case "texte":
      return <EditeurTexte bloc={bloc} onChange={onChange} />;
    case "polaroids":
      return <EditeurPolaroids bloc={bloc} onChange={onChange} />;
    case "annonce":
      return <EditeurAnnonce bloc={bloc} onChange={onChange} />;
    case "faq":
      return <EditeurFaq bloc={bloc} onChange={onChange} />;
    case "livre-dor":
      return <EditeurLivreDor />;
  }
}

// Réglages du bloc (bouton engrenage), pour les blocs qui en ont
function reglagesDe(bloc: Bloc, onChange: (bloc: Bloc) => void) {
  if (bloc.type === "texte") return <ReglagesTexte bloc={bloc} onChange={onChange} />;
  if (bloc.type === "faq") return <ReglagesFaq bloc={bloc} onChange={onChange} />;
  return undefined;
}

// Une page du site : affichée normalement, ou modifiable bloc par bloc en mode édition
export default function PageEditable({ slug, initial }: { slug: SlugPage; initial: ContenuPage }) {
  const [contenu, setContenu, enEdition] = useZone(`page:${slug}`, initial);
  const { blocs } = contenu;

  if (!enEdition) return <RenduBlocs blocs={blocs} />;

  const majBlocs = (nouveaux: Bloc[]) => setContenu({ ...contenu, blocs: nouveaux });
  const ajouter = (index: number) => (type: Bloc["type"]) => majBlocs([...blocs.slice(0, index), creerBloc(type), ...blocs.slice(index)]);

  return (
    <ListeBlocs>
      <AjoutBloc onAjouter={ajouter(0)} />
      {blocs.map((bloc, i) => {
        const majBloc = (b: Bloc) => majBlocs(remplacer(blocs, i, b));
        return (
          <Fragment key={bloc.id}>
            <div className={`w-full ${largeurBloc(bloc)} mt-10`}>
              <CadreBloc
                nom={TYPES_BLOCS.find((t) => t.type === bloc.type)?.nom ?? bloc.type}
                premier={i === 0}
                dernier={i === blocs.length - 1}
                onMonter={() => majBlocs(deplacer(blocs, i, -1))}
                onDescendre={() => majBlocs(deplacer(blocs, i, 1))}
                onSupprimer={() => majBlocs(retirer(blocs, i))}
                reglages={reglagesDe(bloc, majBloc)}
              >
                <EditeurBloc bloc={bloc} onChange={majBloc} />
              </CadreBloc>
            </div>
            <AjoutBloc onAjouter={ajouter(i + 1)} />
          </Fragment>
        );
      })}
    </ListeBlocs>
  );
}
