
const Logo = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span className={`font-bricolage font-bold text-[#1A0B2E] ${sizes[size]}`}>
        Job
      </span>
      <span className={`font-instrument italic text-[#FF6B6B] ${sizes[size]}`}>
        Wise
      </span>
      <span 
        className="rounded-full bg-[#00E676]"
        style={{ 
          width: '8px', 
          height: '8px',
          boxShadow: '0 0 12px rgba(0,230,118,0.7)'
        }}
      />
    </div>
  );
};

export default Logo;