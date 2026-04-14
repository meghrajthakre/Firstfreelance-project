export default function Spinner({ size = 20, className = "", variant = "rainbow" }) {
  const variants = {
    rainbow: ["#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981"],
    sunset: ["#FF6B6B", "#FF8E53", "#FFB347", "#FFD700", "#FFE4B5"],
    ocean: ["#00B4DB", "#0083B0", "#005B96", "#003D5C", "#001F2D"],
    neon: ["#00FF88", "#00FFCC", "#00B4FF", "#0066FF", "#0033FF"],
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        {variants[variant].map((color, index) => {
          const rotation = index * 72; // 360/5 = 72 degrees
          const delay = index * 0.1;
          
          return (
            <svg
              key={index}
              className="absolute top-0 left-0 animate-spin"
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill="none"
              style={{ 
                animationDuration: "1s", 
                animationDelay: `${delay}s`,
                transform: `rotate(${rotation}deg)`
              }}
            >
              <path
                d="M22 12a10 10 0 00-10-10"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="15, 200"
                className="opacity-80"
              />
            </svg>
          );
        })}
      </div>
    </div>
  );
}