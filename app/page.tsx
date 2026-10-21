export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-4 w-full max-w-5xl mx-auto px">
      
      {/* 1. CARTE DE BIENVENUE (Légèrement penchée à gauche) */}
      <section className="w-full bg-white rounded-sm p-6 md:p-10 shadow-xl border border-marron/10 transition-transform flex flex-col md:flex-row items-center hover:rotate-1">
        
        {/* Espace Texte */}
        <div className="flex-1 space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Bienvenue à La Colocantine
          </h1>
          <p className="text-lg opacity-90 leading-relaxed">
            Notre resto éphémère de temps en temps dans notre coloc. 
            Cuisine réconfortante, bons produits et grandes tablées entre copains.
          </p>
        </div>

        
      </section>

      {/* 2. CARTE DU PROCHAIN REPAS (Légèrement penchée à droite) */}
      <section className="w-full max-w-md bg-white rounded-sm p-8 text-center shadow-xl border border-marron/10 transition-transform hover:-rotate-1">
        <h2 className="text-2xl font-semibold mb-2">Prochain Repas</h2>
        <p className="mb-6 opacity-80">Le menu est en cours de préparation...</p>
        
        {/* Bouton */}
        <button 
          disabled 
          className="w-full bg-marron text-canard px-6 py-3 font-medium opacity-50 cursor-not-allowed transition-opacity rounded-sm"
        >
          Bientôt disponible
        </button>
      </section>

    </div>
  );
}