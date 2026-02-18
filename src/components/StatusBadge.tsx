import React from 'react';
import clsx from 'clsx';

interface StatusBadgeProps {
  status: string;
  /** Etiqueta opcional para mostrar en lugar de formatear status (ej. textos en español) */
  label?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, className }) => {
  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('published') || statusLower.includes('paid') || statusLower.includes('delivered')) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    if (statusLower.includes('draft') || statusLower.includes('pending')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
    if (statusLower.includes('expired') || statusLower.includes('cancelled') || statusLower.includes('overdue') || statusLower === 'rejected') {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    if (statusLower.includes('completed') || statusLower.includes('sale_completed')) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    if (statusLower.includes('transit') || statusLower.includes('partial')) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        getStatusColor(status),
        className
      )}
    >
      {label ?? status.replace(/_/g, ' ')}
    </span>
  );
};
