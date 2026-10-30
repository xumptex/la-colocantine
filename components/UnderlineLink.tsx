import Link from "next/link";

type UnderlineLinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
};

// Lien avec le soulignement animé de la charte (s'étire du centre vers les extérieurs)
export default function UnderlineLink({ href, className = "", children }: UnderlineLinkProps) {
  const classes = `relative inline-flex items-center gap-2 py-1 font-medium text-marron after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-marron after:scale-x-0 after:origin-center hover:after:scale-x-100 after:transition-transform after:duration-500 after:ease-out ${className}`;

  // Liens externes (site, mail, téléphone) : simple balise <a>, les sites s'ouvrent dans un nouvel onglet
  if (/^(https?:|mailto:|tel:)/.test(href)) {
    const nouvelOnglet = href.startsWith("http");
    return (
      <a
        href={href}
        className={classes}
        target={nouvelOnglet ? "_blank" : undefined}
        rel={nouvelOnglet ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
