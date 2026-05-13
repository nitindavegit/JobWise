const Logo = ({ size = 'md', showText = true }) => {
  const sizeMap = {
    sm: { img: 28, fontSize: '1.125rem', dot: 5 },
    md: { img: 34, fontSize: '1.35rem', dot: 6 },
    lg: { img: 40, fontSize: '1.625rem', dot: 7 },
    xl: { img: 56, fontSize: '2.25rem', dot: 9 },
    '2xl': { img: 80, fontSize: '3rem', dot: 10 },
  };

  const s = sizeMap[size] || sizeMap.md;

  return (
    <div className="flex items-center" style={{ gap: '8px' }} data-testid="logo">
      {/* Logo Icon */}
      <img
        src="/logo.png"
        alt="JobWise"
        style={{
          width: `${s.img}px`,
          height: `${s.img}px`,
          objectFit: 'contain',
        }}
      />

      {/* Text Wordmark */}
      {showText && (
        <div className="flex items-center" style={{ gap: '1px' }}>
          <span
            className="font-bricolage"
            style={{
              fontSize: s.fontSize,
              fontWeight: 700,
              color: '#1A0B2E',
              lineHeight: 1,
            }}
          >
            Job
          </span>
          <span
            className="font-instrument"
            style={{
              fontSize: s.fontSize,
              fontStyle: 'italic',
              color: '#FF6B6B',
              lineHeight: 1,
            }}
          >
            Wise
          </span>
          <span
            style={{
              width: `${s.dot}px`,
              height: `${s.dot}px`,
              borderRadius: '50%',
              background: '#00E676',
              boxShadow: '0 0 12px rgba(0,230,118,0.7)',
              display: 'inline-block',
              marginLeft: '1px',
              alignSelf: 'flex-end',
              marginBottom: '3px',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Logo;