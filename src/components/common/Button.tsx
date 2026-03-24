import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', ...props }) => {
  const base = 'px-4 py-2 rounded font-medium focus:outline-none inline-flex items-center justify-center';
  const common = 'transition-transform transition-colors duration-200 ease-out transform will-change-transform';
  const active = 'active:translate-y-0.5 active:scale-95';
  const focus = 'focus:ring-2 focus:ring-blue-300 focus:ring-offset-2';
  const variants: Record<string, string> = {
    primary: `bg-blue-600 text-white hover:bg-blue-700 ${common} hover:-translate-y-0.5 ${active} ${focus}`,
    secondary: `bg-gray-200 text-gray-800 hover:bg-gray-300 ${common} hover:-translate-y-0.5 ${active} ${focus}`,
    ghost: `bg-transparent ${common} ${active} ${focus}`,
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
};

export default Button;
