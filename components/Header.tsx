import { cn } from "@/lib/utils";
import Link from "next/link";
import Logo from "./Logo";

const Header = ({ children, className }: HeaderProps) => {
  return (
    <header className={cn("header", className)}>
      <Link href="/" className="md:flex-1 group">
        <Logo
          size="sm"
          showText={true}
          className="group-hover:scale-105 transition-transform duration-300"
        />
      </Link>
      <div className="flex items-center gap-4">{children}</div>
    </header>
  );
};

export default Header;
