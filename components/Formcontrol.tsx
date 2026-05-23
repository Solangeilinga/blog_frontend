import React from "react";

interface FormControlProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

const FormControl = ({ label, error, children }: FormControlProps) => {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text font-medium">{label}</span>
      </label>

      {children}

      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
};

export default FormControl;
