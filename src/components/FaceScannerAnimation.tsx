const FaceScannerAnimation = ({ size = 200 }: { size?: number }) => {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Outer rotating ring */}
      <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-spin" style={{ animationDuration: '8s' }}>
        <div className="absolute top-0 left-1/2 w-3 h-3 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2 glow-blue"></div>
      </div>
      
      {/* Middle pulsing ring */}
      <div className="absolute inset-4 rounded-full border-2 border-secondary/40 animate-pulse-glow"></div>
      
      {/* Inner scanning effect */}
      <div className="absolute inset-8 rounded-full border border-primary/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/30 to-transparent animate-scan"></div>
      </div>
      
      {/* Center face icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg 
          width={size * 0.4} 
          height={size * 0.4} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          className="text-primary"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M20 21a8 8 0 1 0-16 0" />
        </svg>
      </div>
      
      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-lg"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-lg"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-lg"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-lg"></div>
    </div>
  );
};

export default FaceScannerAnimation;
