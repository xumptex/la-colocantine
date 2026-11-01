import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import { LogOut, ShieldCheck, User } from "lucide-react";
import PaperCard from "@/components/PaperCard";
import TitrePage from "@/components/TitrePage";
import UnderlineLink from "@/components/UnderlineLink";
import FormulaireProfil from "@/components/FormulaireProfil";
import { exigerProfil } from "@/lib/auth";
import { seDeconnecter } from "./actions";

export const metadata: Metadata = {
  title: "Mon compte - La Colocantine",
};

export default function ComptePage() {
  return (
    <div className="w-full max-w-2xl mx-auto py-4">
      <TitrePage titre="Mon compte" />
      <PaperCard tilt="none">
        {/* La session est lue à chaque requête : derrière un Suspense */}
        <Suspense fallback={<p className="p-8 text-center font-handwriting text-2xl opacity-60">Chargement...</p>}>
          <Compte />
        </Suspense>
      </PaperCard>
    </div>
  );
}

async function Compte() {
  const profil = await exigerProfil();

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Identité */}
      <div className="flex items-center gap-4">
        {profil.avatarUrl ? (
          <Image src={profil.avatarUrl} alt="" width={64} height={64} className="rounded-full border border-marron/20" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-cyanfonce/15 flex items-center justify-center">
            <User size={28} className="opacity-60" />
          </div>
        )}
        <div>
          <p className="font-handwriting text-3xl leading-tight">Salut {profil.prenom ?? "toi"} !</p>
          <p className="text-sm opacity-70">{profil.email}</p>
        </div>
        {profil.role === "admin" && (
          <span className="ml-auto flex items-center gap-1 text-sm font-semibold border border-marron rounded-full px-3 py-1">
            <ShieldCheck size={16} /> Admin
          </span>
        )}
      </div>

      <section>
        <h2 className="text-xl font-semibold border-b-2 border-marron pb-1 mb-4">Mes infos</h2>
        <FormulaireProfil prenom={profil.prenom} nom={profil.nom} />
      </section>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-marron/10">
        {profil.role === "admin" ? (
          <UnderlineLink href="/admin">
            <ShieldCheck size={18} /> Espace admin
          </UnderlineLink>
        ) : (
          <span></span>
        )}
        <form action={seDeconnecter}>
          <button type="submit" className="flex items-center gap-2 font-medium opacity-80 hover:opacity-100">
            <LogOut size={18} /> Se déconnecter
          </button>
        </form>
      </div>
    </div>
  );
}
