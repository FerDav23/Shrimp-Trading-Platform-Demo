import React from 'react';
import clsx from 'clsx';
import { badge } from '../styles';

interface StatusBadgeProps {
  status: string;
  /** Etiqueta opcional para mostrar en lugar de formatear status (ej. textos en español) */
  label?: string;
  className?: string;
  /** Si se indica, se usa esta clase completa para el badge (en lugar de base + color por status) */
  fullClassName?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, className, fullClassName }) => {
  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('published') || statusLower.includes('paid') || statusLower.includes('delivered')) {
      return badge.success;
    }
    if (statusLower.includes('draft') || statusLower.includes('pending')) {
      return badge.warning;
    }
    if (statusLower.includes('expired') || statusLower.includes('cancelled') || statusLower.includes('overdue') || statusLower === 'rejected') {
      return badge.error;
    }
    if (statusLower.includes('completed') || statusLower.includes('sale_completed')) {
      return badge.success;
    }
    if (statusLower.includes('transit') || statusLower.includes('partial')) {
      return badge.info;
    }
    return badge.neutral;
  };

  return (
    <span
      className={clsx(fullClassName ?? [badge.base, getStatusColor(status)], className)}
    >
      {label ?? status.replace(/_/g, ' ')}
    </span>
  );
};
