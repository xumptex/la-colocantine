"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, User } from 'lucide-react';
import { creerClientNavigateur } from '@/lib/supabase/client';
import { supabaseConfigure } from '@/lib/supabase/env';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  // Connecté ou non : "Mon compte" remplace "Connexion".
  // Revérifié à chaque changement de page (la connexion se fait côté serveur).
  const [connecte, setConnecte] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    if (!supabaseConfigure()) return;
    const supabase = creerClientNavigateur();
    supabase.auth.getSession().then(({ data }) => setConnecte(Boolean(data.session)));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_evenement, session) => setConnecte(Boolean(session)));
    return () => subscription.unsubscribe();
  }, [pathname]);
  const lienCompte = connecte ? { name: 'Mon compte', href: '/compte' } : { name: 'Connexion', href: '/login' };

  const navLinks = [
    { name: 'Accueil', href: '/' },
    { name: 'Nos événements', href: '/events' },
    { name: 'Livre d\'or', href: '/livre-d-or' },
    { name: 'Aide', href: '/aide' },
    { name: 'Connexion', href: '/login' },
  ];

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          
          {/* Menu PC (Caché sur mobile, affiché à partir des écrans "lg") */}
          <div className="flex items-center justify-between h-16">
          
          {/* 1. GAUCHE : Logo (flex-1 force cette zone à prendre la même largeur que la zone de droite) */}
          <div className="flex-1 flex items-center justify-start">
             <Link href="/" className="flex items-center">
              <Image 
                src="/Colocatine_logo_horiztonal.png" 
                alt="Logo de La Colocantine" 
                width={250} 
                height={50}
              />
            </Link>
          </div>
          
    
            {/* 2. CENTRE : Menu PC */}
          <div className="hidden lg:flex justify-center space-x-8">
            {navLinks.filter(link => link.name.toLowerCase() !== 'connexion' && link.name.toLowerCase() !== 'admin').map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="relative text-marron py-1 text-base font-medium after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-marron after:scale-x-0 after:origin-center hover:after:scale-x-100 after:transition-transform after:duration-400 after:ease-out"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* 3. DROITE : Connexion (PC) ou Hamburger (Mobile) */}
          <div className="flex-1 flex items-center justify-end gap-2 ">
            <User size={20} />
            {/* Connexion PC seul à droite avec l'icône */}
            <Link 
              href={lienCompte.href} 
              className="hidden lg:flex items-center relative text-marron font-semibold after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-marron after:scale-x-0 after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-400 after:ease-out"
            >
              {lienCompte.name}
            </Link>

            {/* Bouton Hamburger Mobile (Caché sur PC) */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-marron hover:text-black focus:outline-none p-2"
              aria-label="Menu principal"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>

      </div>
     
      
      {/* Zone sombre cliquable pour fermer (n'apparaît que si ouvert) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/10 z-40 lg:hidden" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      
      {/* Panneau coulissant */}
      <div 
        className={`fixed top-0 right-0 h-[100dvh] w-70 bg-white z-[100] lg:hidden transition-transform duration-500 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0 shadow-2xl" : "translate-x-full"
        }`}
      >
        {/* En-tête du menu avec le bouton pour fermer */}
        <div className="flex justify-end p-4 border-marron/10">
          <button 
            onClick={() => setIsOpen(false)} 
            className="text-marron p-2 focus:outline-none"
            aria-label="Fermer le menu"
          >
            <X size={28} />
          </button>
        </div>

        {/* Liens de navigation */}
        <div className="px-6 py-4 space-y-1 flex-1">
          {navLinks.filter(link => link.name.toLowerCase() !== 'connexion' && link.name.toLowerCase() !== 'admin').map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block py-4 text-left text-lg font-medium text-marron hover:opacity-70 border-b border-marron/10 last:border-0"
            >
              {link.name}
              
            </Link>
          ))}
        </div>
        {/* Zone de connexion bloquée en bas */}
        <div className="p-6 border-marron/10 shrink-0 ">
          <Link
            href={lienCompte.href} 
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 block w-full text-left font-medium text-lg text-marron hover:opacity-70"
          >
            <User size={22} />
            {lienCompte.name}
          </Link>
        </div>
      </div>
      
    {/* Effet papier sous le menu */}
    <div className="lg:hidden absolute top-[64px] left-0 w-full h-3 bg-marron -skew-y-1 origin-top-left -z-10 "></div>
    <div className="hidden lg:flex absolute top-[65px] left-0 w-full h-6 bg-marron -skew-y-[0.5deg] origin-top-left -z-10 "></div>
    </nav>
  );
}