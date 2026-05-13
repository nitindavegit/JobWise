const Chip = ({ children, variant = 'default', className = '', ...props }) => {
  const variants = {
    default: {
      background: '#FFE8E0',
      color: '#C2185B',
    },
    skill: {
      background: '#E0D4FF',
      color: '#1A0B2E',
    },
    success: {
      background: 'rgba(0, 230, 118, 0.12)',
      color: '#00C853',
    },
    coral: {
      background: 'rgba(255, 107, 107, 0.12)',
      color: '#FF6B6B',
    },
    dark: {
      background: 'rgba(26, 11, 46, 0.08)',
      color: '#1A0B2E',
    },
  };

  const style = variants[variant] || variants.default;

  return (
    <span
      className={`font-bricolage inline-flex items-center ${className}`}
      style={{
        padding: '0.375rem 0.875rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
        lineHeight: 1.4,
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
};

export default Chip;
