import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const Header = ({ children, className }: HeaderProps) => {
  // Generate a timestamp to force cache refresh
  const cacheBuster = Date.now();

  return (
    <div className={cn("header", className)}>
      <Link href="/" className="md:flex-1 flex items-center gap-2">
        {/* Use the PNG logo for both desktop and mobile */}
        <div className="flex items-center">
          <Image
            src={`/assets/images/logo.png?v=${cacheBuster}`}
            alt="Logo with name"
            width={60}
            height={32}
            className="hidden md:block" // Bypass Next.js image optimization
          />
          <Image
            src={`/assets/images/logo.png?v=${cacheBuster}`}
            alt="Logo"
            width={32}
            height={32}
            className="mr-2 md:hidden" // Bypass Next.js image optimization
          />
          <h1 className="text-xl font-bold text-white">WriteWizard</h1>
        </div>
      </Link>
      {children}
    </div>
  );
};

export default Header;
