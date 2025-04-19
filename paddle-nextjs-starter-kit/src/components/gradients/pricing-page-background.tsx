export function PricingBackground() {
  return (
    <>
      {/* Large grid pattern */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '120px 120px',
          opacity: 0.4,
          maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)'
        }}
      />

      {/* Small grid pattern */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          opacity: 0.3,
          maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 70%)'
        }}
      />

      {/* Grain overlay */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'url("/assets/background/grain-bg.svg")',
          backgroundRepeat: 'repeat',
          opacity: 0.4,
          mixBlendMode: 'overlay'
        }}
      />
    </>
  );
}