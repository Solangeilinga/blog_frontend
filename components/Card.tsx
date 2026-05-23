import React from "react";

interface CardProps {
  children: React.ReactNode;
  horizontal?: boolean;
}

const Card = ({ children, horizontal }: CardProps) => {
  return (
    <div className={`card bg-base-100 shadow-sm hover:shadow-lg transition-shadow w-full ${horizontal ? "lg:card-side" : ""}`}>
      {children}
    </div>
  );
};

export default Card;