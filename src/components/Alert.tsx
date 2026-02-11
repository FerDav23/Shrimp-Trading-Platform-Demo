import React, { ReactNode } from 'react';
import clsx from 'clsx';

export type AlertVariant = 'info' | 'warning' | 'error' | 'success';

interface AlertProps {
  variant?: AlertVariant;
  title: string;
  description?: string;
  /** Lista de ítems (ej. secciones faltantes) que se muestran como viñetas */
  items?: string[];
  onDismiss?: () => void;
  className?: string;
  children?: ReactNode;
}

const variantStyles: Record<
  AlertVariant,
  { container: string; title: string; icon: string }
> = {
  info: {
    container: 'bg-sky-50 border-sky-200 text-sky-800',
    title: 'text-sky-900',
    icon: 'text-sky-500',
  },
  warning: {
    container: 'bg-amber-50 border-amber-200 text-amber-800',
    title: 'text-amber-900',
    icon: 'text-amber-500',
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-800',
    title: 'text-red-900',
    icon: 'text-red-500',
  },
  success: {
    container: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    title: 'text-emerald-900',
    icon: 'text-emerald-500',
  },
};

const IconWarning = () => (
  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

export const Alert: React.FC<AlertProps> = ({
  variant = 'warning',
  title,
  description,
  items,
  onDismiss,
  className,
  children,
}) => {
  const styles = variantStyles[variant];

  return (
    <div
      role="alert"
      className={clsx(
        'rounded-lg border p-4',
        styles.container,
        className
      )}
    >
      <div className="flex gap-3">
        <div className={clsx('flex-shrink-0', styles.icon)}>
          <IconWarning />
        </div>
        <div className="flex-1 min-w-0">
          <p className={clsx('font-semibold', styles.title)}>{title}</p>
          {description && (
            <p className="mt-1 text-sm opacity-90">{description}</p>
          )}
          {items && items.length > 0 && (
            <ul className="mt-2 list-disc list-inside text-sm space-y-0.5">
              {items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
          {children}
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="flex-shrink-0 p-1 rounded hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-transparent"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
