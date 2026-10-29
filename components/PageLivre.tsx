import { evenementsPasses, formatDate, type MessageLivreDor } from "@/lib/data";

const titreEvenement = (id: string) => evenementsPasses.find((e) => e.id === id)?.titre ?? "";

type PageLivreProps = {
  messages?: MessageLivreDor[];
  numero: number;
  className?: string;
};

// Une page du livre d'or. Sans messages, c'est une page blanche (fin du livre).
export default function PageLivre({ messages, numero, className = "" }: PageLivreProps) {
  return (
    <div className={`bg-white overflow-hidden flex flex-col ${className}`}>
      <div className="flex-1 flex flex-col p-6 md:p-10">
        <ul className="space-y-8 flex-1">
          {messages?.map((m) => (
            <li key={m.id} className="border-b border-dashed border-marron/20 pb-6 last:border-0">
              <p className="font-handwriting text-2xl md:text-3xl leading-snug">« {m.message} »</p>
              <p className="mt-2 text-sm opacity-70">
                <span className="font-semibold">{m.auteur}</span> · {titreEvenement(m.evenementId)} · {formatDate(m.date)}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-sm opacity-50">{numero}</p>
      </div>
    </div>
  );
}
