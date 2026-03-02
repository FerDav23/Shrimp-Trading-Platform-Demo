import React, { ReactNode } from 'react';
import { form } from '../styles';

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
    <div className={`${form.row} ${className || ''}`}>
      <label className={labelClassName ?? form.label}>
        {label}
        {required && <span className={form.labelRequired}>*</span>}
      </label>
      {children}
    </div>
  );
};
