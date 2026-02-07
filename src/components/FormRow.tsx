import React, { ReactNode } from 'react';

interface FormRowProps {
  label: string;
  children: ReactNode;
  required?: boolean;
  className?: string;
}

export const FormRow: React.FC<FormRowProps> = ({
  label,
  children,
  required,
  className,
}) => {
  return (
    <div className={`mb-4 ${className || ''}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
};
