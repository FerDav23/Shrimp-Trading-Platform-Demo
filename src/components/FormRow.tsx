import React, { ReactNode } from 'react';

interface FormRowProps {
  label: string;
  children: ReactNode;
  required?: boolean;
  className?: string;
  /** Estilo de subtítulo para el label (ej. en PackerOffers) */
  labelClassName?: string;
}

export const FormRow: React.FC<FormRowProps> = ({
  label,
  children,
  required,
  className,
  labelClassName,
}) => {
  return (
    <div className={`mb-4 ${className || ''}`}>
      <label className={labelClassName ?? 'block text-sm font-medium text-gray-700 mb-1'}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
};
