import { useEffect, useRef } from 'react';

const MatchRing = ({ score, size = 64, className = '' }) => {
  const circleRef = useRef(null);
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  // Determine color based on score
  const getColor = () => {
    if (score >= 80) return '#00E676';
    if (score >= 60) return '#FFA726';
    return '#FF6B6B';
  };
  
  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.style.strokeDasharray = circumference;
      circleRef.current.style.strokeDashoffset = circumference;
      
      // Animate on mount
      setTimeout(() => {
        circleRef.current.style.transition = 'stroke-dashoffset 1s ease-out';
        circleRef.current.style.strokeDashoffset = offset;
      }, 100);
    }
  }, [circumference, offset]);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E5E5"
          strokeWidth="4"
        />
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth="4"
          strokeLinecap="round"
          style={{
            filter: score >= 80 ? 'drop-shadow(0 0 6px rgba(0,230,118,0.66))' : 'none'
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span 
          className="font-bricolage font-bold"
          style={{ 
            fontSize: size * 0.35,
            color: getColor()
          }}
        >
          {score}
        </span>
      </div>
    </div>
  );
};

export default MatchRing;