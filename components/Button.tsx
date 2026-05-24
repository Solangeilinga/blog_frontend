import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "error" | "outline";
  disabled?: boolean;
  wide?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  // CORRIGÉ : prop size ajoutée pour correspondre à l'usage dans ArticleActions
  size?: "xs" | "sm" | "md" | "lg";
}

const Button = ({
  children,
  onClick,
  variant = "primary",
  disabled,
  wide,
  type = "button",
  size,
  className = "",
}: ButtonProps) => {
  const sizeClass = size ? `btn-${size}` : "";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} ${sizeClass} ${wide ? "w-full" : ""} ${className}`.trim()}
    >
      {children}
    </button>
  );
};

export default Button;