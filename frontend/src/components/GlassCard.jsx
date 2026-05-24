import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', style, hover = true, variant = 'light', ...props }) => {
  const baseStyle = variant === 'dark' ? {
    background: 'rgba(26, 11, 46, 0.55)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  } : {
    background: 'rgba(255, 255, 255, 0.72)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    boxShadow: '0 8px 32px rgba(26, 11, 46, 0.08)',
  };

  return (
    <motion.div
      className={`rounded-3xl ${className}`}
      style={{ ...baseStyle, ...style }}
      whileHover={hover ? { y: -6, scale: 1.01 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;