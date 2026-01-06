interface GridLinesProps {
  className?: string;
}

export function GridLines({ className }: GridLinesProps) {
  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}>
      {/* Vertical grid lines - 12 columns */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px)',
          backgroundSize: 'calc(100% / 12) 100%',
          opacity: 0.03,
        }}
      />
      
      {/* Horizontal grid lines - 8 rows */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '100% calc(100% / 8)',
          opacity: 0.02,
        }}
      />
      
      {/* Corner accents - top left */}
      <div className="absolute top-0 left-0 w-32 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
      <div className="absolute top-0 left-0 h-32 w-px bg-gradient-to-b from-transparent via-primary/10 to-transparent" />
      
      {/* Corner accents - top right */}
      <div className="absolute top-0 right-0 w-32 h-px bg-gradient-to-l from-transparent via-primary/10 to-transparent" />
      <div className="absolute top-0 right-0 h-32 w-px bg-gradient-to-b from-transparent via-primary/10 to-transparent" />
      
      {/* Corner accents - bottom left */}
      <div className="absolute bottom-0 left-0 w-32 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
      <div className="absolute bottom-0 left-0 h-32 w-px bg-gradient-to-t from-transparent via-primary/10 to-transparent" />
      
      {/* Corner accents - bottom right */}
      <div className="absolute bottom-0 right-0 w-32 h-px bg-gradient-to-l from-transparent via-primary/10 to-transparent" />
      <div className="absolute bottom-0 right-0 h-32 w-px bg-gradient-to-t from-transparent via-primary/10 to-transparent" />
    </div>
  );
}
