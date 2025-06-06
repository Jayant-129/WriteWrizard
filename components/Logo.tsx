import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const Logo = ({ size = "md", showText = true, className = "" }: LogoProps) => {
  const sizeClasses = {
    sm: 24,
    md: 32,
    lg: 48,
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/assets/icons/logo.svg"
        alt="WriteWrizard Logo"
        width={sizeClasses[size]}
        height={sizeClasses[size]}
        className="flex-shrink-0"
      />
      {showText && (
        <h1
          className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent`}
        >
          WriteWrizard
        </h1>
      )}
    </div>
  );
};

export default Logo;
