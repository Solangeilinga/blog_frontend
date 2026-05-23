import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "error" | "outline";
  disabled?: boolean;
  wide?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}

const Button = ({ 
  children, 
  onClick, 
  variant = "primary", 
  disabled, 
  wide,
  type = "button",
  className = "" 
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} ${wide ? "w-full" : ""} ${className}`.trim()}
    >
      {children}
    </button>
  );
};

export default Button;