export function PricingBackground() {
  return (
    <>
      <div className="absolute inset-0 z-[-1] overflow-hidden">
        {/* Grid background */}
        <div className="grid-bg background-base" />
        
        {/* Yellow gradient overlays */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-yellow-500/20 via-yellow-500/5 to-transparent rounded-full blur-[100px] transform -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-l from-yellow-500/20 via-yellow-500/5 to-transparent rounded-full blur-[100px] transform translate-y-1/2" />
        
        {/* Grain overlay */}
        <div className="grain-background background-base opacity-50" />
      </div>
    </>
  );
} 