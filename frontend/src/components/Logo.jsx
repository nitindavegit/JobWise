const Logo = ({ size = 'md' }) => {
  const sizeMap = {
    sm: { img: 40 },
    md: { img: 56 },
    lg: { img: 80 },
    xl: { img: 110 },
    '2xl': { img: 150 },
  };

  const s = sizeMap[size] || sizeMap.md;

  return (
    <div className="flex items-center" data-testid="logo">
      {/* Logo Icon ONLY */}
      <img
        src="/logo.png"
        alt="JobWise"
        style={{
          width: `${s.img}px`,
          height: `${s.img}px`,
          objectFit: 'contain',
        }}
      />
    </div>
  );
};

export default Logo;