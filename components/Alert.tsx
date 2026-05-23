import React from "react";

interface AlertProps {
  children: React.ReactNode;
  variant?: "info" | "success" | "warning" | "error";
}


const Alert = ({ children, variant = "info" }: AlertProps) => {
  return (
    <div className={`alert alert-${variant}`}>
      <span>{children}</span>
    </div>
  );
};

export default Alert;