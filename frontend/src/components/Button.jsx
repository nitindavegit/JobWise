

const Button = ({ variant = 'coral', children, className = '', ...props }) => {
  const baseClasses = 'font-semibold cursor-pointer transition-all duration-200 border-none rounded-full';
  
  const variantClasses = {
    coral: 'bg-[#FF6B6B] text-white px-7 py-3.5 hover:bg-[#FF5252] hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(255,107,107,0.45)] shadow-[0_6px_20px_rgba(255,107,107,0.35)]',
    dark: 'bg-[#1A0B2E] text-white px-7 py-3.5 hover:-translate-y-0.5 hover:shadow-lg',
    ghost: 'bg-[rgba(255,255,255,0.7)] text-[#1A0B2E] border border-[rgba(26,11,46,0.12)] px-7 py-3.5 hover:bg-white'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;