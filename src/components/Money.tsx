import React from 'react';

interface MoneyProps {
  amount: number;
  currency?: string;
  className?: string;
}

export const Money: React.FC<MoneyProps> = ({ amount, currency = 'USD', className }) => {
  const formatted = new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return <span className={className}>{formatted}</span>;
};
