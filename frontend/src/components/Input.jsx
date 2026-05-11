
const Input = ({ icon: Icon, className = '', ...props }) => {
  return (
    <div className="relative">
      {Icon && (
        <Icon 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1C1B1F]" 
          size={18}
        />
      )}
      <input
        className={`input-jw w-full ${Icon ? 'pl-11' : 'px-4'} ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;