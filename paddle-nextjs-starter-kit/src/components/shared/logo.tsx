interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: { icon: 24, text: "text-lg" },
    md: { icon: 32, text: "text-2xl" },
    lg: { icon: 48, text: "text-3xl" },
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <svg
          width={sizes[size].icon}
          height={sizes[size].icon}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main house shape */}
          <path
            d="M8 20L24 8L40 20V40H8V20Z"
            className="stroke-yellow-500"
            strokeWidth="2"
            fill="none"
          />
          
          {/* Chimney */}
          <path
            d="M32 12V8H36V14"
            className="stroke-yellow-500"
            strokeWidth="2"
          />

          {/* Small Door */}
          <path
            d="M22 40V32H26V40"
            className="stroke-yellow-500"
            strokeWidth="1.5"
          />
          
          {/* Small Windows */}
          <rect
            x="13"
            y="24"
            width="6"
            height="6"
            className="stroke-yellow-500"
            strokeWidth="1.5"
            fill="none"
          />
          <rect
            x="29"
            y="24"
            width="6"
            height="6"
            className="stroke-yellow-500"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>
      
      {showText && (
        <span className={`font-semibold ${sizes[size].text} text-white`}>
          StagioAI
        </span>
      )}
    </div>
  );
}