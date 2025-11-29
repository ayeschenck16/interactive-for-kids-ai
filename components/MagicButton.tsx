import React from 'react';

interface MagicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

const MagicButton: React.FC<MagicButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon,
  className = '',
  ...props 
}) => {
  const baseStyles = "relative inline-flex items-center justify-center font-bold rounded-full shadow-[0_6px_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-[6px] transition-all duration-150 border-2 border-white/20 select-none";
  
  const variants = {
    primary: "bg-indigo-500 hover:bg-indigo-400 text-white",
    secondary: "bg-purple-500 hover:bg-purple-400 text-white",
    accent: "bg-yellow-400 hover:bg-yellow-300 text-indigo-900",
    danger: "bg-pink-500 hover:bg-pink-400 text-white"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-lg",
    lg: "px-8 py-4 text-xl"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default MagicButton;
