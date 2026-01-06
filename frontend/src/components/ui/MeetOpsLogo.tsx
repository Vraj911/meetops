import { Link } from "react-router-dom";
import { useUIStore } from "@/stores/ui.store";

interface MeetOpsLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function MeetOpsLogo({ size = 'md', showText = true, className }: MeetOpsLogoProps) {
  const { theme } = useUIStore();
  const logoPath = theme === 'dark' ? '/logo_light.jpeg' : '/logo_dark.jpeg';
  
  const sizeClasses = {
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-11',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img 
        src={logoPath} 
        alt="MeetOps" 
        className={`${sizeClasses[size]} w-auto object-contain`}
      />
      {showText && (
        <span className={`font-semibold text-foreground tracking-tight ${textSizeClasses[size]}`}>
          MeetOps
        </span>
      )}
    </div>
  );
}

interface MeetOpsLogoLinkProps extends MeetOpsLogoProps {
  to?: string;
}

export function MeetOpsLogoLink({ to = "/", ...props }: MeetOpsLogoLinkProps) {
  return (
    <Link to={to} className="hover:opacity-90 transition-opacity">
      <MeetOpsLogo {...props} />
    </Link>
  );
}
