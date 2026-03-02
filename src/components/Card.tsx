import React, { ReactNode } from 'react';
import clsx from 'clsx';
import { card } from '../styles';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  return (
    <div
      className={clsx(card.base, onClick && card.hover, className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
