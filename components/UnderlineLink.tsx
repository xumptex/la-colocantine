import Link from "next/link";

type UnderlineLinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
};

// Lien avec le soulignement animé de la charte (s'étire du centre vers les extérieurs)
export default function UnderlineLink({ href, className = "", children }: UnderlineLinkProps) {
  return (
    <Link
      href={href}
      className={`relative inline-flex items-center gap-2 py-1 font-medium text-marron after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-marron after:scale-x-0 after:origin-center hover:after:scale-x-100 after:transition-transform after:duration-500 after:ease-out ${className}`}
    >
      {children}
    </Link>
  );
}
