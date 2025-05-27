import { PenTool } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const Logo = ({ size = "md", showText = true, className = "" }: LogoProps) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl shadow-lg">
        <PenTool className={`${sizeClasses[size]} text-white`} />
      </div>
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
